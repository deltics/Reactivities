import React, {useContext} from 'react';
import {Segment, Item, Header, Button, Image} from 'semantic-ui-react';
import {IActivity} from "../../../app/models/activity";
import {observer} from "mobx-react-lite";
import {format} from 'date-fns';
import {Link} from "react-router-dom";
import {RootStoreContext} from "../../../app/stores/rootStore";


const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};


const ActivityDetailHeader: React.FC<{ activity: IActivity}> = ({activity}) => {
    
    const {activityStore} = useContext(RootStoreContext);
    const {hosting, attending} = activity;
    const canCancel = attending && !hosting;
    const canJoin = !hosting && !attending;
    const host = activity.attendees.find(x => x.isHost)!;

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment basic style={activityImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date, 'eeee do MMMM')}</p>
                                <p>
                                    Hosted by <Link to={`/profiles/${host.username}`}>{host.displayName}</Link>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {hosting && (
                    <Button as={Link} to={`/manage/${activity.id}`} color='orange'>
                        Manage Event
                    </Button>
                )}
                {canCancel && (
                    <Button loading={activityStore.submitting} onClick={activityStore.leaveActivity}>Cancel attendance</Button>
                )}
                {canJoin && (
                    <Button loading={activityStore.submitting} onClick={activityStore.joinActivity} color='teal'>Join Activity</Button>
                )}
            </Segment>
        </Segment.Group>
    );
}


export default observer(ActivityDetailHeader);