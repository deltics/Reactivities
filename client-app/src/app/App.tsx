import React, {useEffect, Fragment, useContext} from 'react';
import {Container} from "semantic-ui-react";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import {observer} from "mobx-react-lite";
import {Route, RouteComponentProps, withRouter} from 'react-router';
import HomePage from "../features/home/homepage";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDetail from "../features/activities/details/ActivityDetail";
import NotFound from "./layout/NotFound";
import {Switch} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import {RootStoreContext} from "./stores/rootStore";
import LoginForm from "../features/login/loginForm";
import LoadingComponent from "./layout/LoadingComponent";


const App: React.FC<RouteComponentProps> = ({location}) => {
    const {activityStore, commonStore, userStore} = useContext(RootStoreContext);

    useEffect(() => {
        activityStore.loadActivities()
    }, [activityStore]);

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore.token, userStore.getUser, commonStore.setAppLoaded]);


    if (!commonStore.appLoaded)
        return <LoadingComponent content='Loading application...'/>;

    return (
        <Fragment>
            <ToastContainer position='bottom-right'/>
            <Route exact path='/' component={HomePage}/>
            <Route path={'/(.+)'} render={() => (
                <Fragment>
                    <NavBar/>
                    <Container style={{marginTop: '7em'}}>
                        <Switch>
                            <Route exact path='/activities' component={ActivityDashboard}/>
                            <Route path='/activities/:id' component={ActivityDetail}/>
                            <Route key={location.key} path={['/createActivity', '/manage/:id']}
                                   component={ActivityForm}/>
                            <Route path='/login' component={LoginForm}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Container>
                </Fragment>
            )}/>
        </Fragment>
    )
}

export default withRouter(observer(App));
