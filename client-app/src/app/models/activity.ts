import {IAttendee} from "./attendee";
import {IComment} from "./comment";


export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
}


export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    attendees: IAttendee[];
    attending: boolean;
    hosting: boolean;
    comments: IComment[];
}


export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date;
}


export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    description: string = '';
    category: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        // Date contains both the date and time, but in the form we present date and time
        //  as separate values so we need to ensure that the time property also contains
        //  the same date/time value.
        //
        // The Form ignores the Time component of date and ignores the Date component of time.
        
        if (init && init.date) {
            init.time = init.date;
        }
        Object.assign(this, init);
    }
}