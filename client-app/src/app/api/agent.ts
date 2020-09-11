import axios, {AxiosResponse} from 'axios';
import {IActivitiesEnvelope, IActivity} from "../models/activity";
import {history} from '../..';
import {toast} from 'react-toastify';
import {IUser, IUserFormValues} from "../models/user";
import {IPhoto, IProfile} from "../models/profile";
import {IUserActivity} from "../models/useractivity";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;


axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


axios.interceptors.response.use(undefined, error => {

    if ((error.message === 'Network Error') && (!error.response))
        toast.error('Network error.  Check that the server is available.');
    
    if (!error || !error.response.hasOwnProperty('status'))
        throw error.response;
    
    const {status, data, config, headers} = error.response;
    
    if ((status === 401) && (headers["www-authenticate"].includes('expired')))
    {
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Session has expired.  Please login again');
        return;
    }

    // '/notfound' doesn't actually identify the NotFound component - it is simply an
    //  invalid url.  i.e. it _literally_ does not exist and so forces the NotFound route.

    if (status === 404) {
        history.push('/notfound');
    } else if ((status === 400) && (config.method === 'get') && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    } else if (status === 500) {
        toast.error('An error occured on the server.  Check the server logs for more information.');
    } else {
        console.error(error.response);
        throw error.response;
    }
});


const responseBody = (response: AxiosResponse) => (response?.data ?? null);


// This can be used to introduce an artificial delay in requests, for dev-testing purposes
// const sleep = (ms: number) => (response: AxiosResponse) =>
//    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


// These functions wrap axios methods for calling to a specified url.  They all simply return the
//  body of the response resulting from the request
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    getWithParams: (url: string, params: URLSearchParams) => axios.get(url, {params: params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postFileFormData: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        
        return axios.post(url, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(responseBody);
    },
};

// These functions use the requests axios wrapper methods to call Activity related endpoints
const Activities = {
    list: (limit?: number, page?: number, filter?: Map<string, string>): Promise<IActivitiesEnvelope> => {

        const params = new URLSearchParams();

        limit && params.append('limit', limit.toString());
        limit && page && params.append('offset', `${page ? page * limit : 0}`);

        filter && filter.forEach((value, key) => {
            params.append(key, value);
        });

        return requests.getWithParams('activities', params);
    },
    details: (id: string): Promise<IActivity> => requests.get(`activities/${id}`),
    create: (activity: IActivity) => requests.post('activities', activity),
    update: (activity: IActivity) => requests.put(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`activities/${id}`),
    join: (id: string) => requests.post(`activities/${id}/attend`, {}),
    leave: (id: string) => requests.delete(`activities/${id}/attend`)
}

// These functions use the requests axios wrapper methods to call User related endpoints
const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
    fbLogin: (accessToken: string) => requests.post(`/user/facebook`, {accessToken}),
    refreshToken: (): Promise<IUser> => requests.post(`/user/refreshToken`, {})
}

// These functions use the requests axios wrapper methods to call User related endpoints
const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    put: (profile: Partial<IProfile>) => requests.put(`profiles`, profile),
    follow: (username: string) => requests.post(`profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.delete(`profiles/${username}/follow`),
    getFollowings: (username: string, predicate: string): Promise<IProfile[]> => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    getActivities: (username: string, predicate: string): Promise<IUserActivity[]> => requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}

const Photos = {
    delete: (id: string) => requests.delete(`photos/${id}`),
    setMain: (id: string) => requests.post(`photos/${id}/setmain`, {}),
    upload: (photo: Blob): Promise<IPhoto> => requests.postFileFormData(`/photos`, photo)
}

// Most of everything above is internal to this module.  Only the Activities and User
//  objects (methods) are exported
export default {
    Activities,
    Photos,
    Profiles,
    User
}