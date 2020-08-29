import {RootStore} from "./rootStore";
import {action, computed, observable, runInAction} from "mobx";
import agent from "../api/agent";
import {IPhoto, IProfile} from "../models/profile";


class ProfileStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }


    @observable profile: IProfile | null = null;
    @observable loading: boolean = false;
    @observable submitting: boolean = false;


    @computed get isCurrentUser() {
        const currentUser = this.rootStore.userStore.user;
        return (this.profile && (currentUser?.username === this.profile?.username));
    }


    @action getProfile = async (username: string) => {
        this.loading = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            })
        } catch (err) {
            console.error(err);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    @action deletePhoto = async (photo: IPhoto) => {
        this.submitting = true
        try {
            await agent.Photos.delete(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(p => p.id !== photo.id); 
            })
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    }


    @action setMainPhoto = async (photo: IPhoto) => {
        this.submitting = true
        try {
            await agent.Photos.setMain(photo.id);
            runInAction(() => {
                const user = this.rootStore.userStore.user!;
                
                user.image = photo.url;
                
                this.profile!.photos.find(x => x.isMain)!.isMain = false;
                this.profile!.photos.find(x => x.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                
                this.rootStore.activityStore.updateHostPhotos(user, photo);
            })
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    }
    
    
    @action updateProfile = async (profile: Partial<IProfile>) => {
        this.submitting = true
        try {
            await agent.Profiles.put(profile);
            
            runInAction(() => {
                const user = this.rootStore.userStore.user!;

                if (user.displayName !== profile.displayName)
                    user.displayName = profile.displayName!;

                this.profile = Object.assign(this.profile, profile);
                
                this.rootStore.activityStore.updateDisplayName(user);
            })
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    }
}


export default ProfileStore;
    