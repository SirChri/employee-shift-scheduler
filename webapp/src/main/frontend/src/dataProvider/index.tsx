import simpleRest from "./dataProvider";
import { fetchUtils } from "react-admin";

const fetchJson = (url: any, options: any = {}) => {
	return fetchUtils.fetchJson(url, options);
};

const baseDataProvider = simpleRest("../api", fetchJson);

export const dataProvider = {
	...baseDataProvider,
	getSystemConfigs: () => {
		return fetch("../api/sysconfig", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	},
	getTimelineData: (params: {start: string, end: string, groups: any, detailed: boolean, timezone: string | undefined}) => {
		return fetch("../api/event/in", {
			method: "POST",
			credentials: 'include',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		}).then(res => res.json())
	},
	updatePassword: (params: {user: number, password: string}) => {
		return fetch("../api/user/password/"+params.user, {
			method: "PUT",
			credentials: 'include',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({password: params.password})
		}).then(res => res.json())
	},
	getTimelineGroups: () => {
		return fetch("../api/employee", {
			method: "GET",
			credentials: 'include',
			headers: {     "Content-Type": "application/json"   },
		}).then(res => res.json())
	},
	getUserPreferences: () => {
		return fetch("../api/user/preferences", {
			method: "GET",
			credentials: 'include',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
		}).then(res => res.json())
	},
	updateUserPreferences: (params: any) => {
		return fetch("../api/user/preferences", {
			method: "PUT",
			credentials: 'include',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		}).then(res => res.json())
	},
    getLookupList: (resource: string, sortBy: string | undefined, sortDir: string | undefined) => {
        let query:any = {
            sortBy: sortBy || "code",
            sortDir: sortDir || "ASC",
        };

        return fetchJson(`../api/${resource}/list`, {
            method: 'POST',
            body: JSON.stringify(query),
        }).then(({ headers, json }) => {            
            return {
                data: json.data,
                total: json.count
            };
        });
    },
}
