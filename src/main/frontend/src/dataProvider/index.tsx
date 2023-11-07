import simpleRest from "./dataProvider";
import { fetchUtils } from "react-admin";

const fetchJson = (url: any, options: any = {}) => {
	options.user = {
		authenticated: true
	};
	options["credentials"] = "include"
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
	getTimelineData: (params: {start: string, end: string, groups: any} | {id: string}) => {
		return fetch("../api/timeline-event?" + new URLSearchParams(params), {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	},
	getTimelineGroups: () => {
		return fetch("../api/employee", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
	}
}
