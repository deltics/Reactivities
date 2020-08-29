import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Tab, Card, Header, Image, Button, Grid} from "semantic-ui-react";
import {RootStoreContext} from "../../app/stores/rootStore";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";


const ProfilePhotos = () => {

    const {profileStore, photoUploadStore: photos} = useContext(RootStoreContext);
    const {profile, isCurrentUser} = profileStore;

    const [addingPhoto, setAddingPhoto] = useState(false);
    const [target, setTarget] = useState<string | undefined>();


    const upload = () => {
        photos.upload().then(() => setAddingPhoto(false));
    }


    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated='left' icon={'image'} content={'Photos'}/>
                    {isCurrentUser && <Button basic
                                              floated='right'
                                              content={addingPhoto ? 'Cancel' : 'Add Photo'}
                                              onClick={() => setAddingPhoto(!addingPhoto)}/>}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addingPhoto ? (
                        <PhotoUploadWidget upload={upload}/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile?.photos.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url}/>
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button basic
                                                    positive
                                                    content={'Main'}
                                                    loading={profileStore.submitting && target === 'main' + photo.id}
                                                    disabled={photo.isMain}
                                                    onClick={() => {
                                                        setTarget('main' + photo.id);
                                                        profileStore.setMainPhoto(photo).then(() => setTarget(undefined));
                                                    }}/>
                                            <Button basic
                                                    negative 
                                                    icon='trash'
                                                    loading={profileStore.submitting && target === 'delete' + photo.id}
                                                    disabled={photo.isMain}
                                                    onClick={() => {
                                                        setTarget('delete' + photo.id);
                                                        profileStore.deletePhoto(photo).then(() => setTarget(undefined));
                                                    }}/>
                                        </Button.Group>)}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}


export default observer(ProfilePhotos);