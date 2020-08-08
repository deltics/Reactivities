import React, {FormEvent, useContext, useEffect, useState} from 'react'
import {Button, Form, Grid, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';
import ActivityStore from "../../../app/stores/activityStore";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from 'react-router-dom';


interface RouteParams {
    id: string
}


const ActivityForm: React.FC<RouteComponentProps<RouteParams>> = (
    {
        match,
        history
    }) => {

    const activityStore = useContext(ActivityStore);

    let [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (match.params.id) {
            activityStore.loadActivity(match.params.id)
                .then(() => {
                    activityStore.activity && setActivity(activityStore.activity);
                });
        }

        return () => {
            activityStore.clearActivity();
        };
    }, [activityStore, match.params.id]);


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
        await activityStore.saveActivity(activity, isNew)
            .then(() => {
                history.push(`/activities/${activity.id}`) 
            });
    }

    return (
        <Grid>
            <Grid.Column width={10}>
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
                        <Button onClick={() => history.push(`/activities/${activity.id}`)} floated='right' type='button'
                                content='Cancel'/>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    );
}


export default observer(ActivityForm)