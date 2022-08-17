import simpleRest from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

const fetchJson = (url: any, options: any = {}) => {
	options.user = {
		authenticated: true
	};
	options["credentials"] = "include"
	return fetchUtils.fetchJson(url, options);
};

const baseUrl = process.env.REACT_APP_SERVER_BASEURL;
const baseDataProvider = simpleRest(baseUrl + "/api", fetchJson);

export const dataProvider = {
	...baseDataProvider,
	getSystemConfigs: () => {
		return fetch(baseUrl + "/api/sysconfig", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	},
	getTimelineData: (params: {start: string, end: string, groups: any}) => {
		return fetch(baseUrl + "/api/timeline-agenda?" + new URLSearchParams(params), {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	},
	getTimelineGroups: () => {
		return fetch(baseUrl + "/api/employee", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	}
}
