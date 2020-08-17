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
            
            history.push('/activities');
           
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    
    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        
        history.push('/');
    }
}


export default UserStore;