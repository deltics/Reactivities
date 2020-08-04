import React, {useState, useEffect, Fragment, SyntheticEvent} from 'react';
import {Container} from "semantic-ui-react";
import {IActivity} from "./models/activity";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import agent from "./api/agent";
import LoadingComponent from "./layout/LoadingComponent";


const App = () => {
    // You can useState as many times as needed to reserve/modify state for different purposes.
    //
    // useState creates a named container for a specified state type and a method for modifying
    //  that state as well as providing the initial value for the state container:
    //
    //   const [stateContainer, modifierMethod] = userState<statetype or type union>(initialState)
    //
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');


    const onOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    const doSelectActivity = (id: string) => {
        setEditMode(false);
        setSelectedActivity(activities.filter(a => a.id === id)[0]);
    }

    const doCreateActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.create(activity)
            .then(() => {
                    setActivities([...activities, activity]);
                    setSelectedActivity(activity);
                    setEditMode(false);
                    setSubmitting(false);
                }
            )
    }

    const doUpdateActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.Activities.update(activity)
            .then(() => {
                    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
                    setSelectedActivity(activity);
                    setEditMode(false);
                    setSubmitting(false);
                }
            );
    }

    const doDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setSubmitting(true);
        setTarget(event.currentTarget.name);
        agent.Activities.delete(id)
            .then(() => {
                    setActivities([...activities.filter(a => a.id !== id)]);
                    setSubmitting(false);
                    setSelectedActivity(null);
                    setTarget('');
                }
            );
    }


    // useEffect() takes 2 args, the first is a fn equiv to componentDidMount and the second
    //  equiv to componentDidUpdate (to respond to property changes).  We MUST pass an
    //  empty arg ([]) to the 2nd param if we modify props in componentDidMount otherwise we
    //  trigger a never-ending cycle of "did update" calls.
    useEffect(() => {
        agent.Activities.list()
            .then((response) => {
                let activities: IActivity[] = [];

                response.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    activities.push(activity);
                })

                setActivities(activities);
            })
            .then(() => setLoading(false))
    }, [])

    return (
        <Fragment>
            <NavBar openCreateForm={onOpenCreateForm}/>
            <Container style={{marginTop: '7em'}}>
                {loading && <LoadingComponent inverted={true} content='Loading activities...'/>}
                {!loading && <ActivityDashboard activities={activities}
                                                selectedActivity={selectedActivity!}
                                                editMode={editMode}
                                                submitting={submitting}
                                                target={target}
                                                setEditMode={setEditMode}
                                                setSelectedActivity={setSelectedActivity}
                                                doCreateActivity={doCreateActivity}
                                                doSelectActivity={doSelectActivity}
                                                doUpdateActivity={doUpdateActivity}
                                                doDeleteActivity={doDeleteActivity}/>}
            </Container>
        </Fragment>
    )
}

export default App;
