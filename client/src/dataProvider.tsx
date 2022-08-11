import simpleRest from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";

const httpClient = (url: any, options: any) => {
    options.credentials = "include";
    return fetchUtils.fetchJson(url, options);
  };

export default simpleRest(process.env.REACT_APP_SERVER_BASEURL+"/api", httpClient);