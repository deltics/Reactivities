import React from 'react'
import {Button, Card, Image} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";


interface IProps {
    activity?: IActivity
}


const ActivityDetail: React.FC<IProps> = ({activity}) => {
    return (
        <Card fluid>
            <Image src='/assets/placeholder.png' wrapped ui={false} />
            <Card.Content>
                <Card.Header>Title</Card.Header>
                <Card.Meta>
                    <span>Date</span>
                </Card.Meta>
                <Card.Description>
                    Description
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' content='Edit' />
                    <Button basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}


export default ActivityDetail