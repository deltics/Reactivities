import {observer} from "mobx-react-lite";
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import ActivityStore from "../../../app/stores/activityStore";
import {IActivity} from "../../../app/models/activity";


interface IProps {
    activity: IActivity
}


const ActivityListItem: React.FC<IProps> = ({activity}) => {

    const activityStore = useContext(ActivityStore);

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
                <Icon name='clock'/> {activity.date}
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