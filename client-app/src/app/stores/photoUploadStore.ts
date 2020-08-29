import {RootStore} from "./rootStore";
import {action, observable, runInAction} from "mobx";
import agent from "../api/agent";
import {toast} from "react-toastify";


class PhotoUploadStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }


    @observable source: any = undefined;
    @observable sourceUrl: string | null = null;
    @observable photo: Blob | null = null;
    @observable photoUrl: string | null = null;
    @observable loading: boolean = false;
    @observable uploading: boolean = false;


    @action setSource = (file: any) => {
        createImageBitmap(file).then(bmp => runInAction(() => this.source = bmp));
        this.sourceUrl = file.preview;
    }


    @action setPhoto = (photo: Blob) => {
        this.photoUrl && URL.revokeObjectURL(this.photoUrl);

        this.photo = photo;
        this.photoUrl = URL.createObjectURL(photo);
    }


    @action upload = async () => {
        this.uploading = true;
        try {
            const photo = await agent.Photos.upload(this.photo!);

            runInAction(() => {
                const {profileStore, userStore} = this.rootStore;
                if (!profileStore.profile)
                    return;

                profileStore.profile.photos.push(photo);
                if (photo.isMain && userStore.user) {
                    userStore.user.image = photo.url;
                    profileStore.profile.image = photo.url;
                }

                this.sourceUrl && URL.revokeObjectURL(this.sourceUrl);
                this.photoUrl && URL.revokeObjectURL(this.photoUrl);

                this.source = null;
                this.sourceUrl = null;
                this.photo = null;
                this.photoUrl = null;
            });
        } catch (error) {
            console.error(error);
            toast.error('Problem uploading photo');
        } finally {
            runInAction(() => {
                this.uploading = false;
            })
        }
    }
}


export default PhotoUploadStore;