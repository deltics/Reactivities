import React, {useContext, Fragment} from "react";
import {Button, Container, Image, Header, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {RootStoreContext} from "../../app/stores/rootStore";
import LoginForm from "../login/loginForm";
import RegisterForm from "../login/registerForm";


const HomePage = () => {
    
    const {modalStore, userStore} = useContext(RootStoreContext);
    const {isLoggedIn, user} = userStore;

    const token = window.localStorage.getItem('jwt');

    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
                    Reactivities
                </Header>
                {
                    (isLoggedIn && user && token)
                        ? (
                            <Fragment>
                                <Header as='h2' inverted content={`Welcome back ${user.displayName}`}/>
                                <Button as={Link} to='/activities' size='huge' inverted>
                                    Go to activities...
                                </Button>
                            </Fragment>
                        )
                        : (
                            <Fragment>
                                <Header as='h2' inverted content='Welcome to Reactivities'/>
                                <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                                    Login
                                </Button>
                                <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                                    Register
                                </Button>
                            </Fragment>
                        )
                }
            </Container>
        </Segment>
    );
}


export default HomePage;