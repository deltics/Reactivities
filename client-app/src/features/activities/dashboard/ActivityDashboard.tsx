import React from 'react'
import {Grid} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";


interface IProps {
    activities: IActivity[]
}


const ActivityDashboard: React.FC<IProps> = ({activities}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetail />
            </Grid.Column>
        </Grid>
    )
}


export default ActivityDashboard