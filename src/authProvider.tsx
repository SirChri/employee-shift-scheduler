import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        const request = new Request('/api/session', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw response.statusText;
                }
                return response.json();
            })
            .then(({ token }) => {
                return Promise.resolve();
            });
    },
    logout: () => {
        const request = new Request('/api/session', {
            method: 'DELETE',
            headers: new Headers({ 'Content-Type': 'application/json' })
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw response.statusText;
                }
                return response.json();
            })
            .then(({ token }) => {
                return Promise.resolve();
            });
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
        const request = new Request('/api/session', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw response.statusText;
                }
                return response.json();
            })
            .then(({ data }) => {
                return Promise.resolve();
            });
    },
    getPermissions: () => Promise.reject('Unknown method')
};