import React, {Fragment, useContext} from 'react';
import {Menu, Header} from 'semantic-ui-react';
import {Calendar} from 'react-widgets';
import {RootStoreContext} from "../../../app/stores/rootStore";
import {observer} from "mobx-react-lite";

const ActivityFilters = () => {

    const {activityStore} = useContext(RootStoreContext);
    const {filter, setFilter} = activityStore;

    return (
        <Fragment>
            <Menu vertical size={'large'} style={{width: '100%', marginTop: 50}}>
                <Header icon={'filter'} attached color={'teal'} content={'Filters'}/>
                <Menu.Item active={filter.size === 0} color={'blue'} name={'all'} content={'All Activities'} onClick={() => setFilter()}/>
                <Menu.Item active={filter.has('isGoing')} color={'blue'} name={'username'} content={"I'm Going"} onClick={() => setFilter('isGoing', true)}/>
                <Menu.Item active={filter.has('isHost')} color={'blue'} name={'host'} content={"I'm hosting"} onClick={() => setFilter('isHost', true)}/>
            </Menu>
            <Header icon={'calendar'} attached color={'teal'} content={'Select Date'}/>
            <Calendar value={filter.get('startDate') || new Date()} 
                onChange={(date) => setFilter('startDate', date)}/>
        </Fragment>
    )
};

export default observer(ActivityFilters);