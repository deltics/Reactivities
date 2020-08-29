import axios, {AxiosResponse} from 'axios';
import {IActivity} from "../models/activity";
import {history} from '../..';
import {toast} from 'react-toastify';
import {IUser, IUserFormValues} from "../models/user";
import {IPhoto, IProfile} from "../models/profile";


axios.defaults.baseURL = 'http://localhost:5000/api/';


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

    if ((error.message === 'Network Error') && (!error.response)) {
        toast.error('Network error.  Check that the server is available.');
    }
    const {status, data, config} = error.response;

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


// This is used to introduce an artificial delay in requests, for dev-testing purposes
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


// These functions wrap axios methods for calling to a specified url.  They all simply return the
//  body of the response resulting from the request
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
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
    list: (): Promise<IActivity[]> => requests.get('activities'),
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
}

// These functions use the requests axios wrapper methods to call User related endpoints
const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    put: (profile: Partial<IProfile>) => requests.put(`profiles`, profile)
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