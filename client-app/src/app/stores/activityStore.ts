import {action, computed, configure, observable, runInAction} from "mobx";
import {createContext} from "react";
import {IActivity} from "../models/activity";
import agent from "../api/agent";


configure({enforceActions: 'always'});


class ActivityStore {

    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null;
    @observable loading = false;
    @observable editing = false;
    @observable submitting = false;
    @observable targetId = '';


    @computed get activitiesByDate() {
        const activities: IActivity[] = Array.from(this.activityRegistry.values());

        const sortedActivities = activities
            .slice()
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }


    @action
    loadActivities = async () => {
        this.loading = true;

        try {
            const activities = await agent.Activities.list();

            runInAction('grouping activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
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
        let activity = this.activityRegistry.get(id);

        if (activity) {
            this.activity = activity;
        } else {
            this.loading = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('after loading specific activity', () => {
                    this.activity = activity;
                })
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
        this.activity = this.activityRegistry.get(id);
    }


    @action
    saveActivity = async (activity: IActivity, create: boolean) => {
        this.submitting = true;
        try {
            if (create) {
                await agent.Activities.create(activity);
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
}


export default createContext(new ActivityStore());