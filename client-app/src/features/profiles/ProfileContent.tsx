import React, {useContext} from 'react';
import {Tab} from 'semantic-ui-react';
import {observer} from "mobx-react-lite";
import ProfilePhotos from "./ProfilePhotos";
import ProfileDetail from "./ProfileDetail";
import ProfileFollowings from "./ProfileFollowings";
import {RootStoreContext} from "../../app/stores/rootStore";


const panes = [
    {menuItem: 'About', render: () => <ProfileDetail/>},
    {menuItem: 'Photos', render: () => <ProfilePhotos/>},
    {menuItem: 'Activities', render: () => <Tab.Pane>Activities content</Tab.Pane>},
    {menuItem: 'Followers', render: () => <ProfileFollowings />},
    {menuItem: 'Following', render: () => <ProfileFollowings />}
];


const ProfileContent = () => {

    const {profileStore} = useContext(RootStoreContext);

    const onTabChange = (tabIndex: number) => {
        let predicate = '';
        
        switch (tabIndex) {
            case 3:
                predicate = 'followers';
                break;
            case 4:
                predicate = 'following';
                break;
        }
        profileStore.setFollowingsPredicate(predicate);
    }

    return (
        <Tab menu={{fluid: true, vertical: true}}
             menuPosition={'right'}
             panes={panes}
             onTabChange={(e, data) => onTabChange(data.activeIndex as number)}/>
    )
}

export default observer(ProfileContent);