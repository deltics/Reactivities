import React, {useContext} from 'react';
import {Form as FinalForm, Field} from 'react-final-form';
import {Button, Form, Header} from 'semantic-ui-react';
import TextInput from "../../app/common/form/TextInput";
import {RootStoreContext} from "../../app/stores/rootStore";
import {IUserFormValues} from "../../app/models/user";
import {FORM_ERROR} from "final-form";
import {combineValidators, isRequired} from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";


const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
});


const LoginForm = () => {

    const {userStore} = useContext(RootStoreContext);

    return (
        <FinalForm validate={validate}
                   onSubmit={(values: IUserFormValues) =>
                       userStore.login(values).catch(error => ({
                           [FORM_ERROR]: error
                       }))
                   }
                   render={({
                                handleSubmit,
                                submitting,
                                submitError,
                                invalid,
                                pristine,
                                dirtySinceLastSubmit
                            }) => (
                       <Form onSubmit={handleSubmit} 
                             error>
                           <Header as='h2'
                                   content='Login to Reactivities'
                                   color='teal'
                                   textAlign='center'/>
                           <Field name='email'
                                  placeholder={'Email'}
                                  component={TextInput}/>
                           <Field name='password'
                                  placeholder='Password'
                                  type='password'
                                  component={TextInput}/>
                           {(submitError && !dirtySinceLastSubmit) &&
                           <ErrorMessage error={submitError} text={'Invalid email or password'}/>
                           }
                           <Button color={'teal'}
                                   fluid
                                   disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                                   loading={submitting}
                                   content='Login'/>
                       </Form>
                   )}/>
    )
}


export default LoginForm;