import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import {Container} from "semantic-ui-react";
import {IActivity} from "./models/activity";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";


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


    const openCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    const selectActivity = (id: string) => {
        setEditMode(false);
        setSelectedActivity(activities.filter(a => a.id === id)[0]);
    }


    // useEffect() takes 2 args, the first is a fn equiv to componentDidMount and the second
    //  equiv to componentDidUpdate (to respond to property changes).  We MUST pass an
    //  empty arg ([]) to the 2nd param if we modify props in componentDidMount otherwise we
    //  trigger a never-ending cycle of "did update" calls.
    useEffect(() => {
        axios.get<IActivity[]>('http://localhost:5000/api/activities')
            .then((response) => {
                setActivities(response.data)
            })
    }, [])


    return (
        <Fragment>
            <NavBar openCreateForm={openCreateForm}/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard activities={activities}
                                   selectActivity={selectActivity}
                                   selectedActivity={selectedActivity!}
                                   editMode={editMode}
                                   setEditMode={setEditMode}
                                   setSelectedActivity={setSelectedActivity}
                />
            </Container>

            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
        </Fragment>
    )
}

export default App;
