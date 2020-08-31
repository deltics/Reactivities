import React, {useContext} from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import {observer} from "mobx-react-lite";


const ProfileFollowings = () => {
    
    const rootStore = useContext(RootStoreContext);
    const { profileStore } = rootStore;
    const { profile } = profileStore;
    
    return (
        <Tab.Pane loading={profileStore.loadingProfiles}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={
                            profileStore.followingsPredicate === 'followers' 
                                ? `People following ${profile!.displayName}`
                                : `People ${profile!.displayName} is following`
                        }
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {profileStore.followings.map(profile => (
                            <ProfileCard key={profile.username}
                                         profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileFollowings);