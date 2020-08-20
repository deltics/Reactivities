import React from "react";
import {Image, List, Popup} from "semantic-ui-react";
import {IAttendee} from "../../../app/models/attendee";
import {observer} from "mobx-react-lite";


interface IProps {
    attendees: IAttendee[]
}

const ActivityListItemAttendees: React.FC<IProps> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.username}>
                    <Popup header={attendee.displayName}
                           trigger={<Image circular
                                           size={'mini'}
                                           src={attendee.image || '/assets/user.png'}/>
                           }/>
                </List.Item>
            ))}
        </List>
    )
}


export default observer(ActivityListItemAttendees);