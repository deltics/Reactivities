import {observer} from "mobx-react-lite";
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {IActivity} from "../../../app/models/activity";
import {format} from 'date-fns';
import {RootStoreContext} from "../../../app/stores/rootStore";
import ActivityListItemAttendees from "./ActivityListItemAttendees";


interface IProps {
    activity: IActivity
}


const ActivityListItem: React.FC<IProps> = ({activity}) => {

    const {activityStore} = useContext(RootStoreContext);
    const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'}/>
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description> Hosted by {host.displayName} </Item.Description>
                            {(activity.hosting || activity.attending) && (
                                <Item.Description>
                                    {activity.hosting && (
                                        <Label basic
                                               color={'orange'}
                                               content={'You Are Hosting'}/>
                                    )}
                                    {(!activity.hosting && activity.attending) && (
                                        <Label basic
                                               color={'green'}
                                               content={'You Are Going'}/>
                                    )}
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock'/> {format(activity.date, 'h:mm a')}
                <Icon name='marker'/> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees}/>
                <Segment clearing>
                    <span> {activity.description} </span>
                    <Button as={Link} to={`/activities/${activity.id}`}
                            floated='right'
                            content='View'
                            color='blue'/>
                    <Button onClick={() => activityStore.deleteActivity(activity.id)}
                            name={activity.id}
                            loading={activityStore.submitting && (activityStore.targetId === activity.id)}
                            floated='right'
                            content='Delete'
                            color='red'/>
                    <Label basic content={activity.category}/>
                </Segment>
            </Segment>
        </Segment.Group>
    );
}

export default observer(ActivityListItem);