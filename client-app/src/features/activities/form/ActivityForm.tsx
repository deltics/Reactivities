import React, {useContext, useEffect, useState} from 'react'
import {Button, Form, Grid, Segment} from "semantic-ui-react";
import {ActivityFormValues} from "../../../app/models/activity";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from 'react-router-dom';
import {Form as FinalForm, Field} from 'react-final-form';
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import PickListInput from "../../../app/common/form/PickListInput";
import {categoryOptions} from "../../../app/common/options/categoryOptions";
import DateTimeInput from "../../../app/common/form/DateTimeInput";
import {format} from 'date-fns';
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate';
import {RootStoreContext} from "../../../app/stores/rootStore";

interface RouteParams {
    id: string
}


const formValidators = combineValidators({
    title: isRequired({message: 'Title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description must be at least 5 characters'}))(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});


const ActivityForm: React.FC<RouteComponentProps<RouteParams>> = (
    {
        match,
        history
    }) => {

    const {activityStore} = useContext(RootStoreContext);

    let [activity, setActivity] = useState(new ActivityFormValues());

    useEffect(() => {
        if (match.params.id) {
            activityStore.loadActivity(match.params.id)
                .then(
                    (activity) => setActivity(new ActivityFormValues(activity))
                );
        }
    }, [activityStore, match.params.id]);


    const onSubmitFinalForm = (values: any) => {
        // First, take the values for date and time that we separated for the
        //  form UX and recombine into the date property of the Activity...
        
        let {date, time, ...activity} = values;

        date = format(date, 'yyyy-MM-dd');
        time = format(time, 'HH:mm:00');

        activity.date = new Date(date + ' ' + time);
        
        // Now we can save it (the store will figure out whether it is a new
        //  activity to be created or an update of an existing one)

        activityStore.saveActivity(activity)
            .then(() => {
                history.push(`/activities/${activity.id}`)
            });
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm initialValues={activity}
                               onSubmit={onSubmitFinalForm}
                               validate={formValidators}
                               render={({handleSubmit, invalid, pristine}) => (
                                   <Form onSubmit={handleSubmit}
                                         loading={activityStore.loading}>
                                       <Field component={TextInput}
                                              placeholder='Title'
                                              name='title'
                                              value={activity.title}/>
                                       <Field component={TextAreaInput}
                                              placeholder='Description'
                                              name='description'
                                              value={activity.description}/>
                                       <Field component={PickListInput}
                                              placeholder='Category'
                                              name='category'
                                              options={categoryOptions}
                                              value={activity.category}/>
                                       <Form.Group widths='equal'>
                                           <Field<Date> date={true}
                                                        component={DateTimeInput}
                                                        placeholder='Date'
                                                        name='date'
                                                        value={activity.date}/>
                                           <Field<Date> time={true}
                                                        component={DateTimeInput}
                                                        placeholder='Time'
                                                        name='time'
                                                        value={activity.date}/>
                                       </Form.Group>
                                       <Field component={TextInput}
                                              placeholder='City'
                                              name='city'
                                              value={activity.city}/>
                                       <Field component={TextInput}
                                              placeholder='Venue'
                                              name='venue'
                                              value={activity.venue}/>
                                       <Button type='submit'
                                               disabled={activityStore.loading || invalid || pristine}
                                               loading={activityStore.submitting}
                                               floated='right'
                                               positive
                                               content='Submit'/>
                                       <Button type='button'
                                               disabled={activityStore.loading}
                                               onClick={() => {
                                                   history.push(activity.id ? `/activities/${activity.id}` : '/activities');
                                               }}
                                               floated='right'
                                               content='Cancel'/>
                                   </Form>

                               )}/>
                </Segment>
            </Grid.Column>
        </Grid>
    );
}


export default observer(ActivityForm)