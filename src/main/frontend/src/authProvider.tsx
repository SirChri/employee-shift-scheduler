import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        const request = new Request('../api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject(response.statusText);
                }
                return response.json();
            })
            .then(( auth ) => {
                localStorage.setItem('roles', auth.roles);
                return Promise.resolve();
            });
    },
    logout: () => {
        const request = new Request('../api/logout', {
            method: 'POST',
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
        const request = new Request('../api/session', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    return Promise.reject()
                }
                return Promise.resolve();
            })
    },
    getPermissions: () => {
        const role = localStorage.getItem('roles');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};