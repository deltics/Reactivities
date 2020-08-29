import React, {useContext, Fragment, useState} from 'react'
import {Button, Grid, Header, Tab} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import LoadingComponent from "../../app/layout/LoadingComponent";
import {RootStoreContext} from "../../app/stores/rootStore";
import ProfileUpdate from "./ProfileUpdate";


const ProfileDetail = () => {

    const {profileStore} = useContext(RootStoreContext);
    const {profile, isCurrentUser} = profileStore;

    const [updating, setUpdating] = useState(false);
    

    return (
        <Fragment>
            {profileStore.loading && <LoadingComponent content='Loading details...'/>}
            {!profileStore.loading &&
            <Tab.Pane>
                <Grid>
                    <Grid.Column width={16} style={{paddingBottom: 0}}>
                        <Header floated='left' icon={'image'} content={'Profile'}/>
                        {isCurrentUser && <Button basic
                                                  floated='right'
                                                  content={updating ? 'Cancel' : 'Edit'}
                                                  onClick={() => setUpdating(!updating)}/>}
                    </Grid.Column>
                    <Grid.Column width={16}>
                        {updating ? <ProfileUpdate profile={profile!} finished={() => setUpdating(false)}/> : <span>{profile?.bio}</span>}
                    </Grid.Column>
                </Grid>
            </Tab.Pane>
            }
        </Fragment>
    );
}


export default observer(ProfileDetail)