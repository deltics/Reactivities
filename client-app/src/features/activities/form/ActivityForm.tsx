import React, {ChangeEvent, FormEvent, useState} from 'react'
import {Button, Form, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";


interface IProps {
    activity: IActivity | null,
    setEditMode: (enabled: boolean) => void,
}


const ActivityForm: React.FC<IProps> = ({activity: initialActivity, setEditMode}) => {

    const initializeForm = () => {
        if (initialActivity){
            return initialActivity
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
    
    // FormEvent<T> needs both Input and TextArea elements in the type union because
    //  we will be re-using this handler for all form inputs, including the textarea
    //  used for the "Description" field.
    const onInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }
    
    const onSubmitForm = () => {
        console.log(activity);
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    return (
        <Segment clearing>
            <Form onSubmit={onSubmitForm}>
                <Form.Input placeholder='Title' name='title' onChange={onInputChange} value={activity.title}/>
                <Form.TextArea rows={2} placeholder='Description' name='description' onChange={onInputChange} value={activity.description}/>
                <Form.Input placeholder='Category' name='category' onChange={onInputChange} value={activity.category}/>
                <Form.Input type='date' placeholder='Date' name='date' onChange={onInputChange} value={activity.date}/>
                <Form.Input placeholder='City' name='city' onChange={onInputChange} value={activity.city}/>
                <Form.Input placeholder='Venue' name='venue' onChange={onInputChange} value={activity.venue}/>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}


export default ActivityForm