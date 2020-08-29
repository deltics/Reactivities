import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import {createContext} from "react";
import {configure} from "mobx";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import PhotoUploadStore from "./photoUploadStore";
import ProfileStore from "./profileStore";


configure({enforceActions: 'always'});


export class RootStore {
    
    activityStore: ActivityStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    photoUploadStore: PhotoUploadStore;
    profileStore: ProfileStore;
    userStore: UserStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.photoUploadStore = new PhotoUploadStore(this);
        this.profileStore = new ProfileStore(this);
        this.userStore = new UserStore(this);
    }
}


export const RootStoreContext = createContext(new RootStore());
