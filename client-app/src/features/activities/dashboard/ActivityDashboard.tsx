import React, {useContext} from 'react'
import {Grid} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";
import {observer} from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";


const ActivityDashboard: React.FC = () => {
    
    const activityStore = useContext(ActivityStore);
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {/* The && operator: everything to the RHS of && is only output if the LHS is not falsy */}
                {activityStore.selectedActivity && !activityStore.editing &&
                <ActivityDetail />}
                {/* Setting a key ensures that when props change we force an update of the form component */}
                {activityStore.editing && <ActivityForm key={activityStore.selectedActivity ? activityStore.selectedActivity.id : 0} />}
            </Grid.Column>
        </Grid>
    )
}


export default observer(ActivityDashboard)