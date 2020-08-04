import React from 'react'
import {Grid} from "semantic-ui-react";
import {IActivity} from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";


interface IProps {
    activities: IActivity[],
    doSelectActivity: (id: string) => void,
    selectedActivity: IActivity | null,
    editMode: boolean,
    setEditMode: (editMode: boolean) => void,
    setSelectedActivity: (activity: IActivity | null) => void,
    doCreateActivity: (activity: IActivity) => void,
    doUpdateActivity: (activity: IActivity) => void,
    doDeleteActivity: (id: string) => void
}


const ActivityDashboard: React.FC<IProps> = ({
                                                 activities,
                                                 doSelectActivity,
                                                 selectedActivity,
                                                 editMode,
                                                 setEditMode,
                                                 setSelectedActivity,
                                                 doCreateActivity,
                                                 doUpdateActivity,
                                                 doDeleteActivity
                                             }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities}
                              doSelectActivity={doSelectActivity}
                              doDeleteActivity={doDeleteActivity}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {/* The && operator: everything to the RHS of && is only output if the LHS is true/not null */}
                {selectedActivity && !editMode &&
                <ActivityDetail activity={selectedActivity}
                                setEditMode={setEditMode}
                                setSelectedActivity={setSelectedActivity}/>}
                {/* Setting a key ensures that when props change we force an update of the form component */}
                {editMode && <ActivityForm activity={selectedActivity!}
                                           key={selectedActivity ? selectedActivity.id : 0}
                                           setEditMode={setEditMode}
                                           onActivityCreated={doCreateActivity}
                                           onActivityUpdated={doUpdateActivity}
                />}
            </Grid.Column>
        </Grid>
    )
}


export default ActivityDashboard