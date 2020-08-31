import React, {useContext, Fragment} from 'react';
import {Segment, Item, Header, Button, Grid, Statistic, Divider, Reveal} from 'semantic-ui-react';
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../app/stores/rootStore";


function ProfileHeader() {

    const {profileStore} = useContext(RootStoreContext);
    const {profile} = profileStore;

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar
                                        size='small'
                                        src={profile!.image || '/assets/user.png'}/>
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1'>{profile!.displayName}</Header>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile!.followerCount}/>
                        <Statistic label='Following' value={profile!.followingCount}/>
                    </Statistic.Group>
                    {!profileStore.isCurrentUser && <Fragment>
                        <Divider/>
                        <Reveal animated='move'>
                            <Reveal.Content visible style={{width: '100%'}}>
                                <Button fluid
                                        color='teal'
                                        content={profile!.following ? 'Following' : 'Not following'}/>
                            </Reveal.Content>
                            <Reveal.Content hidden>
                                <Button fluid
                                        basic
                                        loading={profileStore.submitting}
                                        color={profile!.following ? 'red' : 'green'}
                                        content={profile!.following ? 'Unfollow' : 'Follow'}
                                        onClick={() => profileStore.follow(profile!.username, !profile!.following)}/>
                            </Reveal.Content>
                        </Reveal>
                    </Fragment>}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default observer(ProfileHeader);