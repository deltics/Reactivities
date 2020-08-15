import axios, {AxiosResponse} from 'axios';
import {IActivity} from "../models/activity";
import {history} from '../..';
import {toast} from 'react-toastify';


axios.defaults.baseURL = 'http://localhost:5000/api/';

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
    }
});


const responseBody = (response: AxiosResponse) => (response?.data ?? null);


const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));


const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
};


const Activities = {
    list: (): Promise<IActivity[]> => requests.get('activities'),
    details: (id: string) => requests.get(`activities/${id}`),
    create: (activity: IActivity) => requests.post('activities', activity),
    update: (activity: IActivity) => requests.put(`activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`activities/${id}`)
}


export default {
    Activities
}