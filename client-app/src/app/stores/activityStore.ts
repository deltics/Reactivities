import {action, computed, observable, runInAction} from "mobx";
import {IActivity} from "../models/activity";
import agent from "../api/agent";
import {format} from "date-fns";
import {v4 as uuid} from "uuid";
import {RootStore} from "./rootStore";
import {IAttendee} from "../models/attendee";
import {toast} from "react-toastify";
import {IUser} from "../models/user";
import {IPhoto} from "../models/profile";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";


class ActivityStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map<string, IActivity>();
    @observable activity: IActivity | null = null;
    @observable loading = false;
    @observable editing = false;
    @observable submitting = false;
    @observable targetId = '';
    @observable.ref commentHub: HubConnection | null = null;


    @computed get activitiesByDate() {
        const activities: IActivity[] = Array.from(this.activityRegistry.values());

        const sortedActivities = activities
            .slice()
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = format(activity.date, 'eeee do MMMM, yyyy');
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }


    @action connectCommentHub = (activityId: string) => {
        // Connects to /comments endpoint passing access_token as a query string parameter
        this.commentHub = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/comments', {accessTokenFactory: () => this.rootStore.commonStore.token!})
            .configureLogging(LogLevel.Information)
            .build();

        // Establishes the client side methods that the server-side Hub can Send messages to
        this.commentHub.on('NewComment', comment => {
            runInAction(() => this.activity!.comments.push(comment));
        })
        this.commentHub.on('Info', info => {
            console.log(info);
        });

        // Now start the connection
        this.commentHub.start()
            .then(() => {
                if (this.commentHub!.state === 'Connected')
                    this.commentHub!.invoke("Join", activityId);
            }).catch(error => console.error(error));
    }


    @action
    disconnectCommentHub = () => {
        if (this.commentHub!.state !== 'Connected')
            return;

        this.commentHub!.invoke("Leave", this.activity!.id)
            .then(() => this.commentHub!.stop())
            .catch(e => console.error(e));
    }


    @action
    addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
            await this.commentHub?.invoke('SendComment', values);
        } catch (error) {
            console.error(error);
        }
    }


    @action
    loadActivities = async () => {
        this.loading = true;

        try {
            const activities = await agent.Activities.list();

            runInAction('grouping activities', () => {
                const user = this.rootStore.userStore.user!;

                activities && activities.forEach(activity => {
                    const attendance = activity.attendees.find(x => x.username === user?.username);

                    activity.attending = !!attendance;
                    activity.hosting = !!attendance && attendance.isHost;
                    activity.date = new Date(activity.date);

                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (err) {
            runInAction('error loading activities', () => {
                console.error(err);
            });
        } finally {
            runInAction('cleanup after loading activities', () => {

                this.loading = false
            });
        }
    }


    @action
    loadActivity = async (id: string) => {
        let registeredActivity = this.activityRegistry.get(id);

        if (registeredActivity) {
            this.activity = registeredActivity;
            return registeredActivity;
        } else {
            this.loading = true;
            try {
                const activity = await agent.Activities.details(id);
                runInAction('after loading specific activity', () => {
                    const user = this.rootStore.userStore.user!;
                    if (activity) {
                        const attendance = activity.attendees.find(x => x.username === user.username);

                        activity.attending = !!attendance;
                        activity.hosting = !!attendance && attendance.isHost;
                        activity.date = new Date(activity.date);
                    }
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                });
                return activity;
            } catch (err) {
                runInAction('error when loading specific activity', () => {
                    console.error(err);
                })
            } finally {
                runInAction('cleanup after loading specific activity', () => {
                    this.loading = false;
                });
            }
        }
    }


    @action
    clearActivity = () => {
        this.activity = null;
    }


    @action
    selectActivity = (id: string | null, editing: boolean) => {
        this.editing = editing;
        this.activity = id ? this.activityRegistry.get(id)! : null;
    }


    @action
    saveActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            const isNew = (!activity.id);

            if (isNew) {
                activity.id = uuid();
                await agent.Activities.create(activity);

                // Now we need to update the local models to reflect the behaviour of
                //  the api.  Specifically, add the current user as attending and
                //  hosting the new activity.
                //
                // These changes do not affect any observable state so we don't need 
                //  to runInAction().

                const user = this.rootStore.userStore.user!;

                const attendee: IAttendee = {
                    displayName: user.displayName,
                    username: user.username,
                    image: user.image,
                    isHost: true,
                    following: false        // Can't follow yourself
                }
                activity.hosting = true;
                activity.attendees.push(attendee);
                activity.comments = [];

            } else {
                await agent.Activities.update(activity);
            }
            runInAction('after saving activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.editing = false;
            });
        } catch (err) {
            console.error(err);
        }
        runInAction('cleanup after saving activity', () => {
            this.submitting = false;
        });
    }


    @action
    deleteActivity = async (id: string) => {
        this.submitting = true;
        this.targetId = id;
        try {
            await agent.Activities.delete(id);
            runInAction('after deleting activity', () => {
                this.activityRegistry.delete(id);
                this.selectActivity(null, false);
            });
        } catch (err) {
            console.error(err);
        }
        runInAction('cleanup after deleting activity', () => {
            this.targetId = '';
            this.submitting = false;
        });
    }


    @action
    joinActivity = async () => {
        this.submitting = true;
        try {
            const activity = this.activity!;

            await agent.Activities.join(activity.id);

            runInAction('after joining activity', () => {
                const user = this.rootStore.userStore.user!;

                const attendee: IAttendee = {
                    displayName: user.displayName,
                    username: user.username,
                    image: user.image,
                    isHost: false,
                    following: false    // Can't follow yourself!
                }

                activity.attendees.push(attendee);
                activity.attending = true;

                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.error(error);
            toast.error('Problem joining the activity');
        }
        runInAction('cleanup after joining an activity', () => {
            this.submitting = false;
        });
    }


    @action
    leaveActivity = async () => {
        this.submitting = true;
        try {
            const activity = this.activity!;

            await agent.Activities.leave(activity.id);

            runInAction('after leaving activity', () => {
                const user = this.rootStore.userStore.user!;

                activity.attendees = activity.attendees.filter(a => a.username !== user.username);
                activity.attending = false;

                this.activityRegistry.set(activity.id, activity);
            })
        } catch (error) {
            console.error(error);
            toast.error('Problem leaving the activity');
        }
        runInAction('cleanup after leaving an activity', () => {
            this.submitting = false;
        })
    }


    @action
    updateHostPhotos = (user: IUser, photo: IPhoto) => {
        this.activityRegistry.forEach(a => {
            a.attendees.forEach(aa => {
                if (aa.username === user.username)
                    aa.image = photo.url;
            });
        });
    }


    @action
    updateDisplayName = (user: IUser) => {
        this.activityRegistry.forEach(a => {
            a.attendees.forEach(aa => {
                if (aa.username === user.username)
                    aa.displayName = user.displayName;
            });
        });
    }
}


export default ActivityStore;