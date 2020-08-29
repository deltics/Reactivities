import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {Header, Image, Grid, Segment, SegmentGroup, Item, Button} from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';
import PhotoUploadDropzone from "./PhotoUploadDropzone";
import PhotoUploadCropper from "./PhotoUploadCropper";
import {RootStoreContext} from "../../stores/rootStore";
import PhotoUploadPreview from "./PhotoUploadPreview";


const PhotoUploadWidget: React.FC<{upload: () => void}> = ({upload}) => {

    const {photoUploadStore: uploadStore} = useContext(RootStoreContext);


    useEffect(() => {
        // Cleanup the URL object after rendering

        // useEffect accepts a function that is called at a point equivalent to
        //  componentDidMount and if we RETURN a function from that function, then
        //  this returned function is called at a point equivelent to ..didUNmount

        return () => {
            uploadStore.sourceUrl && URL.revokeObjectURL(uploadStore.sourceUrl);
            uploadStore.photoUrl && URL.revokeObjectURL(uploadStore.photoUrl);
        }
    })

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 1 - Add Photo'/>
                    <PhotoUploadDropzone/>
                </Grid.Column>
                <Grid.Column width={1}/>
                <Grid.Column width={5}>
                    <Header sub color={uploadStore.source ? 'teal' : 'grey'} content='Step 2 - Resize image'/>
                    <div style={{height: 200, position: 'relative'}}>
                        {uploadStore.source && <PhotoUploadCropper/>}
                    </div>
                </Grid.Column>
                <Grid.Column width={1}/>
                <Grid.Column width={5}>
                    <Header sub color={uploadStore.photo ? 'teal' : 'grey'} content='Step 3 - Preview & Upload'/>
                    {uploadStore.photo &&
                    <Fragment>
                        <PhotoUploadPreview/>
                        <Button basic fluid positive icon={'check'} loading={uploadStore.uploading} onClick={() => upload()}/>
                    </Fragment>}
                </Grid.Column>
            </Grid>
        </Fragment>
    );
};

export default observer(PhotoUploadWidget);