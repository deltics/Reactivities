import React, {useContext, useEffect, Fragment} from 'react'
import {Grid} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from 'react-router-dom';
import ActivityDetailChat from "./ActivityDetailChat";
import ActivityDetailInfo from "./ActivityDetailInfo";
import ActivityDetailHeader from "./ActivityDetailHeader";
import ActivityDetailSidebar from "./ActivityDetailSidebar";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {RootStoreContext} from "../../../app/stores/rootStore";


interface RouteParams {
    id: string
}


const ActivityDetail: React.FC<RouteComponentProps<RouteParams>> = ({match, history}) => {

    const {activityStore} = useContext(RootStoreContext);
    const {activity} = activityStore;

    useEffect(() => {
        activityStore.loadActivity(match.params.id);
    }, [activityStore, activityStore.loadActivity, match.params.id]);


    return (
        <Fragment>
            {activityStore.loading && <LoadingComponent content='Loading activity...' />}
            {activity && <Grid>
                <Grid.Column width={10}>
                    <ActivityDetailHeader activity={activity}/>
                    <ActivityDetailInfo activity={activity}/>
                    <ActivityDetailChat/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <ActivityDetailSidebar/>
                </Grid.Column>
            </Grid>}
        </Fragment>
    );
}


export default observer(ActivityDetail)