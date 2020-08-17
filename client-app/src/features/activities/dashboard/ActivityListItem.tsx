import {observer} from "mobx-react-lite";
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {IActivity} from "../../../app/models/activity";
import {format} from 'date-fns';
import {RootStoreContext} from "../../../app/stores/rootStore";


interface IProps {
    activity: IActivity
}


const ActivityListItem: React.FC<IProps> = ({activity}) => {

    const {activityStore} = useContext(RootStoreContext);

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png'/>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description> Hosted by Bob </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock'/> {format(activity.date, 'h:mm a')}
                <Icon name='marker'/> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary> Attendees will be shown here </Segment>
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
        </Segment.Group>


    );
}

export default observer(ActivityListItem);