import {action, computed, observable, runInAction} from "mobx";
import {IUser, IUserFormValues} from "../models/user";
import agent from "../api/agent";
import {RootStore} from "./rootStore";
import {history} from '../..';


class UserStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }


    @observable user: IUser | null = null;
    @observable isFacebookLoginActive: boolean = false;


    @computed get isLoggedIn() {
        return !!this.user
    }

    
    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (err) {
            console.error(err);
        }
    }
    
    
    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            });
            
            // Only code that modifies the observables in the store needs to "runInAction".
            
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            
            history.push('/activities');
           
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    
    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal()

            history.push('/activities');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    
    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        
        history.push('/');
    }
    
    
    @action facebookLogin = async (response: any) => {
        this.isFacebookLoginActive = true;
        try {
            const user = await agent.User.fbLogin(response.accessToken);
            
            runInAction(() => {
                this.user = user;
            });
            
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => this.isFacebookLoginActive = false);
        }
    }
}


export default UserStore;