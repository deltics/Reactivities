import React, {useContext} from 'react'
import {Container, Grid} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {observer} from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";


const ActivityDashboard: React.FC = () => {

    const activityStore = useContext(ActivityStore);

    return (
        <Container>
            {activityStore.loading && <LoadingComponent inverted={true} content='Loading activities...'/>}
            {!activityStore.loading && <Grid>
                <Grid.Column width={10}>
                    <ActivityList/>
                </Grid.Column>
                <Grid.Column width={6}>
                </Grid.Column>
            </Grid>}
        </Container>
    )
}


export default observer(ActivityDashboard)