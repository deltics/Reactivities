import React, {useCallback, useState, Fragment, useRef, useContext, createRef, useEffect} from 'react';
import {Image} from 'semantic-ui-react';
import Cropper from "react-easy-crop";
import {RootStoreContext} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


const PhotoUploadCropper = () => {

    const {photoUploadStore: upload} = useContext(RootStoreContext);
    let canvasRef = createRef<HTMLCanvasElement>();

    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [pixels, setPixels] = useState({x: 0, y: 0, width: 0, height: 0});
    
    
    const renderCrop = async () => {
        if (pixels.width === 0 || !upload.source)
            return;

        const {x, y, width, height} = pixels;
        
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(upload.source, x, y, width, height, 0, 0, width, height);
        
        const result = await canvas.convertToBlob({
            type: 'image/jpeg',
            quality: 0.95
        });
        
        upload.setPhoto(result);
    }

    const onCropComplete = useCallback((newArea, newPixels) => {
        setPixels(Object.assign(pixels, {...newPixels}));
        renderCrop();
    }, []);


    return (
        <Fragment>
            <Image src={upload.sourceUrl}
                   style={{display: 'none'}}/>
            <canvas ref={canvasRef} />
            <Cropper image={upload.sourceUrl ? upload.sourceUrl : ''}
                     crop={crop}
                     zoom={zoom}
                     aspect={1}
                     onCropChange={setCrop}
                     onZoomChange={setZoom}
                     onCropComplete={onCropComplete}/>
        </Fragment>
    );
};


export default observer(PhotoUploadCropper);

