import {action, computed, configure, observable, runInAction} from "mobx";
import {createContext} from "react";
import {IActivity} from "../models/activity";
import agent from "../api/agent";


configure({enforceActions: 'always'});


class ActivityStore {

    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined = undefined;
    @observable loading = false;
    @observable editing = false;
    @observable submitting = false;
    @observable targetId = '';


    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .slice()
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }


    @action
    loadActivities = async () => {
        this.loading = true;

        const activities = await agent.Activities.list();

        runInAction('loading activities', () => {
            try {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            } catch (err) {
                console.error(err);
            }
            this.loading = false
        });
    }


    @action
    selectActivity = (id: string | null, editing: boolean) => {
        this.editing = editing;
        this.selectedActivity = this.activityRegistry.get(id);
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