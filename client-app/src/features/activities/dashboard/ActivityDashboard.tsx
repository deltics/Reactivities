import React, {useContext, useEffect, useState} from 'react'
import {Container, Grid, Loader} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../../app/stores/rootStore";
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from "./ActivityFilters";


const ActivityDashboard: React.FC = () => {

    const {activityStore} = useContext(RootStoreContext);
    const {loadActivities, page, setPage, totalPages} = activityStore;

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const [loadingNext, setLoadingNext] = useState(false);


    const getNextPage = () => {
        setLoadingNext(true);
        setPage(activityStore.page + 1);
        loadActivities().then(() => setLoadingNext(false));
    }

    return (
        <Container>
            <Grid>
                <Grid.Column width={10}>
                    <InfiniteScroll pageStart={0}
                                    loadMore={getNextPage}
                                    hasMore={!loadingNext && ((page + 1) < totalPages)}
                                    initialLoad={false}>
                        <ActivityList/>
                    </InfiniteScroll>
                </Grid.Column>
                <Grid.Column width={6}>
                    <ActivityFilters/>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active={loadingNext}/>
                </Grid.Column>
            </Grid>
        </Container>
    )
}


export default observer(ActivityDashboard)