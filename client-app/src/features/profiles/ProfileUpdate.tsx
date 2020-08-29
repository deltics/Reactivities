import React, {useContext} from 'react'
import {Button, Form} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {RootStoreContext} from "../../app/stores/rootStore";
import {Field, Form as FinalForm} from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import {combineValidators, isRequired} from "revalidate";
import {IProfile} from "../../app/models/profile";


const formValidators = combineValidators({
    displayName: isRequired({message: 'Display Name is required'})
});


const ProfileUpdate: React.FC<{ profile: IProfile, finished: () => void }> = ({profile, finished}) => {
    const {profileStore} = useContext(RootStoreContext);

    const onSubmitFinalForm = (values: any) => {
        profileStore.updateProfile(values)
            .then(() => finished())
    }

    return (
        <FinalForm initialValues={profile}
                   onSubmit={onSubmitFinalForm}
                   validate={formValidators}
                   render={({handleSubmit, invalid, pristine, submitting}) => (
                       <Form onSubmit={handleSubmit}
                             loading={profileStore.loading}>
                           <Field component={TextInput}
                                  placeholder='Display Name'
                                  name='displayName'
                                  value={profile.displayName}/>
                           <Field component={TextAreaInput}
                                  placeholder='Bio'
                                  name='bio'
                                  value={profile.bio}/>
                           <Button type='submit'
                                   disabled={profileStore.loading || invalid || pristine}
                                   loading={submitting}
                                   floated='right'
                                   positive
                                   content='Submit'/>
                           <Button type='button'
                                   disabled={profileStore.loading}
                                   onClick={() => finished()}
                                   floated='right'
                                   content='Cancel'/>
                       </Form>

                   )}/>
    );
}


export default observer(ProfileUpdate)