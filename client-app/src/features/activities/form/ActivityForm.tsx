import React, {FormEvent, useContext, useState} from 'react'
import {Button, Form, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';
import ActivityStore from "../../../app/stores/activityStore";
import {observer} from "mobx-react-lite";


const ActivityForm: React.FC = () => {

    const activityStore = useContext(ActivityStore);

    const initializeForm = () => {
        if (activityStore.selectedActivity) {
            return activityStore.selectedActivity
        } else {
            return {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    };
    let [activity, setActivity] = useState<IActivity>(initializeForm);


    // FormEvent<T> needs both Input and TextArea elements in the type union because
    //  we will be re-using this handler for all form inputs, including the textarea
    //  used for the "Description" field.
    const onInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }

    const onSubmitForm = async () => {
        const isNew = (activity.id.length === 0);

        if (isNew) {
            activity = {...activity, id: uuid()};
        }

        await activityStore.saveActivity(activity, isNew);
    }

    return (
        <Segment clearing>
            <Form onSubmit={onSubmitForm}>
                <Form.Input placeholder='Title' name='title' onChange={onInputChange} value={activity.title}/>
                <Form.TextArea rows={2} placeholder='Description' name='description' onChange={onInputChange}
                               value={activity.description}/>
                <Form.Input placeholder='Category' name='category' onChange={onInputChange} value={activity.category}/>
                <Form.Input type='datetime-local' placeholder='Date' name='date' onChange={onInputChange}
                            value={activity.date}/>
                <Form.Input placeholder='City' name='city' onChange={onInputChange} value={activity.city}/>
                <Form.Input placeholder='Venue' name='venue' onChange={onInputChange} value={activity.venue}/>
                <Button loading={activityStore.submitting} floated='right' positive type='submit' content='Submit'/>
                <Button onClick={() => activityStore.selectActivity(activity.id, false)} floated='right' type='button'
                        content='Cancel'/>
            </Form>
        </Segment>
    )
}


export default observer(ActivityForm)