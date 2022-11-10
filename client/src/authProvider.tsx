import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        const request = new Request(process.env.REACT_APP_SERVER_BASEURL+'/api/session', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            credentials: 'include',
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                return Promise.resolve();
            });
    },
    logout: () => {
        const request = new Request(process.env.REACT_APP_SERVER_BASEURL+'/api/session', {
            method: 'DELETE',
            credentials: 'include',
            headers: new Headers({ 'Content-Type': 'application/json' })
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.resolve({redirectTo: '/login'});
                }
                return response.json();
            })
            .then(({ token }) => {
                return Promise.resolve();
            });
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        const request = new Request(process.env.REACT_APP_SERVER_BASEURL+'/api/session', {
            method: 'GET',
            credentials: 'include',
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject()
                }
                return response.json();
            })
            .then(({ data }) => {
                return Promise.resolve();
            });
    },
    getPermissions: () => Promise.resolve(),
};