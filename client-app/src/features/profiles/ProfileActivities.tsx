import React, {useEffect, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {Tab, Grid, Header, Card, Image, TabProps} from 'semantic-ui-react';
import {Link, useHistory} from 'react-router-dom';
import {IUserActivity} from '../../app/models/useractivity';
import {format} from 'date-fns';
import {RootStoreContext} from '../../app/stores/rootStore';


const panes = [
    {menuItem: 'Future Events', pane: {key: 'futureEvents'}},
    {menuItem: 'Past Events', pane: {key: 'pastEvents'}},
    {menuItem: 'Hosting', pane: {key: 'hosted'}}
];


const ProfileActivities = () => {
    const history = useHistory();
    const {profileStore} = useContext(RootStoreContext);
    const {loadingActivities, activities, setActivitiesPredicate} = profileStore;

    useEffect(() => {
        setActivitiesPredicate('future');
    }, [setActivitiesPredicate]);

    const handleTabChange = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        data: TabProps
    ) => {
        let predicate;
        switch (data.activeIndex) {
            case 1:
                predicate = 'past';
                break;
            case 2:
                predicate = 'hosting';
                break;
            default:
                predicate = 'future';
                break;
        }
        setActivitiesPredicate(predicate);
    };

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Activities'}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab panes={panes}
                         menu={{secondary: true, pointing: true}}
                         onTabChange={(e, data) => handleTabChange(e, data)}/>
                    <br/>
                    <div>
                        <Card.Group itemsPerRow={4}>
                            {activities.map((activity: IUserActivity) => (
                                <Card as={Link}
                                      to={`/activities/${activity.id}`}
                                      key={activity.id}
                                      onClick={() => history.push(`/activities/${activity.id}`)}>
                                    <Image src={`/assets/categoryImages/${activity.category}.jpg`}
                                           style={{minHeight: 100, objectFit: 'cover'}}/>
                                    <Card.Content>
                                        <Card.Header textAlign='center'>{activity.title}</Card.Header>
                                        <Card.Meta textAlign='center'>
                                            <div>{format(new Date(activity.date), 'do LLL')}</div>
                                            <div>{format(new Date(activity.date), 'h:mm a')}</div>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Group>
                    </div>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileActivities);
