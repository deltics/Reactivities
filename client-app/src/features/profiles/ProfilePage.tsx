import React, {useContext, useEffect, Fragment} from 'react';
import {observer} from "mobx-react-lite";
import ProfileHeader from "./ProfileHeader";
import {Grid} from "semantic-ui-react";
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreContext} from "../../app/stores/rootStore";
import ProfileContent from "./ProfileContent";
import LoadingComponent from "../../app/layout/LoadingComponent";


const ProfilePage: React.FC<RouteComponentProps<{ username: string }>> = ({match}) => {

    const {profileStore} = useContext(RootStoreContext);

    useEffect(() => {
        profileStore.getProfile(match.params.username);
    }, [profileStore, match.params.username])
    
    return (
        <Fragment>
            {profileStore.loading || (profileStore.profile == null) ? <LoadingComponent content={'Loading profile...'}/>
            : <Grid>
                <Grid.Column width={16}>
                    <ProfileHeader />
                    <ProfileContent />
                </Grid.Column>
            </Grid>}
        </Fragment>
    );
}


export default observer(ProfilePage);