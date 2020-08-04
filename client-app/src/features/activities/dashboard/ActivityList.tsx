import React, {SyntheticEvent} from 'react'
import {Button, Item, Label, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";


interface IProps {
    activities: IActivity[],
    submitting: boolean,
    target: string,
    doSelectActivity: (id: string) => void,
    doDeleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void
}


const ActivityList: React.FC<IProps> = ({
                                            activities,
                                            submitting,
                                            target,
                                            doSelectActivity,
                                            doDeleteActivity
                                        }) => {
    return (
        <Segment clearing>
            <Item.Group divided>
                {
                    activities.map(activity => (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button onClick={() => doSelectActivity(activity.id)}
                                            floated='right'
                                            content='View'
                                            color='blue'/>
                                    <Button onClick={(e) => doDeleteActivity(e, activity.id)}
                                            name={activity.id}
                                            loading={submitting && (target === activity.id)}
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


export default ActivityList