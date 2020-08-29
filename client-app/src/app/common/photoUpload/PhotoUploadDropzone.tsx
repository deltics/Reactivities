import React, {useCallback, useContext} from 'react'
import {useDropzone} from 'react-dropzone'
import {Header, Icon} from "semantic-ui-react";
import {RootStoreContext} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


const dropzoneStyle = {
    border: 'dashed 3px',
    borderColor: '#ddf',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',  // WHY?  (needed to fix an error with "style" below, but still: WHY?)
    height: '200px'
}


const dropzoneActive = {
    ...dropzoneStyle,
    borderColor: '#afa'
}


const PhotoUploadDropzone = () => {
    
    const {photoUploadStore: upload} = useContext(RootStoreContext);

    const onDrop = useCallback(acceptedFiles => {
        // Dropzone accepts multiple files but we will only consider the first,
        //  adding a 'preview' property to the file (the local Url to the file)
        //  before then setting that file using the passing in file setter

        const file = Object.assign(acceptedFiles[0], {preview: URL.createObjectURL(acceptedFiles[0])});
        upload.setSource(file);
    }, [upload])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} style={isDragActive ? dropzoneActive : dropzoneStyle}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge' color={isDragActive ? 'green' : 'grey'}/>
            <Header content='Drop image here' color={isDragActive ? 'green' : 'grey'}/>
        </div>
    )
}

export default observer(PhotoUploadDropzone);