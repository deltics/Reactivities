import React, {useContext} from 'react';
import {Image} from 'semantic-ui-react';
import {RootStoreContext} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


const PhotoUploadPreview = () => {

    const {photoUploadStore: upload} = useContext(RootStoreContext);

    return (
        <Image src={upload.photoUrl} width={200} height={200}/>
    );
};


export default observer(PhotoUploadPreview);

