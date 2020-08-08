import React, {useContext} from 'react'
import {Button, Item, Label, Segment} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore';



const ActivityList: React.FC = () => {
    
    const activityStore = useContext(ActivityStore);

    
    return (
        <Segment clearing>
            <Item.Group divided>
                {
                    activityStore.activitiesByDate.map(activity => (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button onClick={() => activityStore.selectActivity(activity.id, false)}
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
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                }
            </Item.Group>
        </Segment>
    )
}


export default observer(ActivityList)