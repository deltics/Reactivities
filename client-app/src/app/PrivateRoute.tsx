import React, {useContext} from 'react';
import {RouteComponentProps, RouteProps, Route, Redirect} from 'react-router-dom';
import {RootStoreContext} from "./stores/rootStore";
import {observer} from "mobx-react-lite";


interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>;
}

// This creates a component that can be used in place of a standard "<Route>" component
//  in App.tsx routes that redirects to the home page if there is no current logged in user.

const PrivateRoute: React.FC<IProps> = ({component: Component, ...rest}) => {

    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn} = rootStore.userStore;

    return (
        <Route {...rest}
               render={props => isLoggedIn ? <Component {...props} /> : <Redirect to={'/'} />} />
    )
}

export default observer(PrivateRoute);
