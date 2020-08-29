import React, {useContext, Fragment} from 'react';
import {Button, Container, Dropdown, Image, Menu} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {Link, NavLink} from "react-router-dom";
import {RootStoreContext} from "../../app/stores/rootStore";


const NavBar: React.FC = () => {

    const {userStore} = useContext(RootStoreContext);
    const {user} = userStore;

    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header as={NavLink} exact to={'/'}>
                    <img src={"/assets/logo.png"} alt="logo" style={{marginRight: '15px'}}/>
                    Reactivities
                </Menu.Item>
                {
                    user && (
                        <Fragment>
                            <Menu.Item name='Activities' as={NavLink} to={'/activities'}/>
                            <Menu.Item>
                                <Button as={Link} to={'/createActivity'} positive content={'Create Activity'}/>
                            </Menu.Item>
                            <Menu.Item position='right'>
                                <Image avatar
                                       spaced='right'
                                       src={user.image || '/assets/user.png'}/>
                                <Dropdown pointing='top left'
                                          text={`${user.displayName}`}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link}
                                                       to={`/profiles/${user.username}`}
                                                       text='My profile'
                                                       icon='user'/>
                                        <Dropdown.Item onClick={userStore.logout} text='Logout'
                                                       icon='power'/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>
                        </Fragment>
                    )
                }
            </Container>
        </Menu>
    )
}


export default observer(NavBar);