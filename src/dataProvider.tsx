import simpleRest from "ra-data-simple-rest";
import { fetchUtils, Admin, Resource } from 'react-admin';

const httpClient = (url: any, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}

export default simpleRest("http://localhost:5555/api", httpClient);