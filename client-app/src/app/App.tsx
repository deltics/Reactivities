import React, {useEffect, Fragment, useContext} from 'react';
import {Container} from "semantic-ui-react";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import ActivityStore from "./stores/activityStore";
import {observer} from "mobx-react-lite";
import {Route, RouteComponentProps, withRouter} from 'react-router';
import HomePage from "../features/home/homepage";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDetail from "../features/activities/details/ActivityDetail";


const App: React.FC<RouteComponentProps> = ({location}) => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities()
    }, [activityStore]);

    return (
        <Fragment>
            <Route exact path='/' component={HomePage}/>
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <NavBar/>
                    <Container style={{marginTop: '7em'}}>
                        <Route exact path='/activities' component={ActivityDashboard}/>
                        <Route path='/activities/:id' component={ActivityDetail}/>
                        <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
                    </Container>
                </Fragment>
            )}/>
        </Fragment>
    )
}

export default withRouter(observer(App));
