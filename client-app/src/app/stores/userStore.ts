import {action, computed, observable, runInAction} from "mobx";
import {IUser, IUserFormValues} from "../models/user";
import agent from "../api/agent";
import {RootStore} from "./rootStore";
import {history} from '../..';


class UserStore {

    refreshTokenTimeoutId: any;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    private startRefreshTokenTimer(user: IUser) {
        // Get the payload section of the user's jwt token
        const token = JSON.parse(atob(user.token.split('.')[1]));

        // Get the token expiry (milliseconds)
        const expires = new Date(token.exp * 1000);

        // Calculate the timeout required:
        //
        // The expiry is in the future, so calculate the time period between
        //  that future time and now, in milliseconds.  We want to trigger
        //  a call to refresh our token 30 seconds before the token expires
        //  so we subtract 30,000 milliseconds from the calculated time

        const triggerTime = expires.getTime() - Date.now() - (30 * 1000);

        // Now set a timer that will call this.refreshToken at the specified time,
        //  storing the timeoutId
        this.refreshTokenTimeoutId = setTimeout(this.refreshToken, triggerTime);
    }

    private stopRefreshTokenTimer() {
        this.refreshTokenTimeoutId && clearTimeout(this.refreshTokenTimeoutId);
        this.refreshTokenTimeoutId = null;
    }


    @action setUser = (user: IUser) => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);

        if (this.rootStore.modalStore.modal) {
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        }

        this.startRefreshTokenTimer(user);
    }


    @observable user: IUser | null = null;
    @observable isFacebookLoginActive: boolean = false;


    @computed get isLoggedIn() {
        return !!this.user
    }


    @action getUser = async () => {
        try {
            this.setUser(await agent.User.current());
        } catch (err) {
            console.error(err);
        }
    }


    @action login = async (values: IUserFormValues) => {
        try {
            this.setUser(await agent.User.login(values));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    @action register = async (values: IUserFormValues) => {
        try {
            this.setUser(await agent.User.register(values));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    @action logout = () => {
        this.stopRefreshTokenTimer();
        this.rootStore.commonStore.setToken(null);
        this.user = null;

        history.push('/');
    }


    @action facebookLogin = async (response: any) => {
        this.isFacebookLoginActive = true;
        try {
            this.setUser(await agent.User.fbLogin(response.accessToken));
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => this.isFacebookLoginActive = false);
        }
    }


    @action refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            this.setUser(await agent.User.refreshToken());
        } catch (error) {
            console.error(error);
        }
    }
}


export default UserStore;