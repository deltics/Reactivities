import React, {useEffect, Fragment, useContext} from 'react';
import {Container} from "semantic-ui-react";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./layout/LoadingComponent";
import ActivityStore from "./stores/activityStore";
import {observer} from "mobx-react-lite";


const App = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => { activityStore.loadActivities() }, [activityStore]);
    
    return (
        <Fragment>
            <NavBar/>
            <Container style={{marginTop: '7em'}}>
                {activityStore.loading && <LoadingComponent inverted={true} content='Loading activities...'/>}
                {!activityStore.loading && <ActivityDashboard />}
            </Container>
        </Fragment>
    )
}

export default observer(App);
