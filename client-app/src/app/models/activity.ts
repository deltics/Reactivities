import {IAttendee} from "./attendee";
import {IComment} from "./comment";


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
        if (init && init.date) {
            init.time = init.date;
        }
        Object.assign(this, init);
    }
}