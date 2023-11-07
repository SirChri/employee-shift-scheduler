import { stringify } from "query-string";
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY
} from "react-admin";
import { fetchUtils, DataProvider } from 'ra-core';

/**
 * Maps react-admin queries to a REST API implemented using Java Spring Boot and Swagger
 *
 * @example
 * GET_LIST     => GET http://my.api.url/posts?page=0&pageSize=10
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?id=1234&id=5678
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (apiUrl: any, httpClient = fetchUtils.fetchJson): DataProvider => {
  /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
  const convertDataRequestToHTTP = (type: string, resource: string, params: any): any => {
    let url = "";
    const options:any = {};
    switch (type) {
      case GET_LIST: {
        const { page, perPage } = params.pagination;
        url = `${apiUrl}/${resource}?page=${page}&pageSize=${perPage}`;
        break;
      }
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case GET_MANY: {
        const query = {
          filter: JSON.stringify({ id: params.ids })
        };
        let idStr = "";
        const queryString = params.ids.map((id: any) => idStr + `id=${id}`);
        url = `${apiUrl}/${resource}?${idStr}}`;
        break;
      }
      case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        url = `${apiUrl}/${resource}?page=${page}&pageSize=${perPage}`;
        break;
      }
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = "PUT";
        options.body = JSON.stringify(params.data);
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = "POST";
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = "DELETE";
        break;
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

  /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} Data response
     */
  const convertHTTPResponse = (response: any, type: string, resource: string, params: any): object => {
    const { headers, json } = response;
    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        if (!json.hasOwnProperty("totalElements")) {
          throw new Error(
            "The numberOfElements property must be must be present in the Json response"
          );
        }
        return {
          data: json.content,
          total: parseInt(json.totalElements, 10)
        };
      case CREATE:
        return { data: { ...params.data, id: json.id } };
      default:
        return { data: json };
    }
  };

  /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a data response
     */
  return (type: string, resource: string, params: any): Promise<any> => {
    // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    if (type === UPDATE_MANY) {
      return Promise.all(
        params.ids.map((id: any) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify(params.data)
          })
        )
      ).then(responses => ({
        data: responses.map(response => response.json)
      }));
    }
    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    if (type === DELETE_MANY) {
      return Promise.all(
        params.ids.map((id: any) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: "DELETE"
          })
        )
      ).then(responses => ({
        data: responses.map(response => response.json)
      }));
    }

    const { url, options } = convertDataRequestToHTTP(type, resource, params);
    return httpClient(url, options).then(response =>
      convertHTTPResponse(response, type, resource, params)
    );
  };
};

//import { stringify } from 'query-string';
//import { fetchUtils, DataProvider } from 'ra-core';

/**
 * Maps react-admin queries to a simple REST API
 *
 * This REST dialect is similar to the one of FakeRest
 *
 * @see https://github.com/marmelab/FakeRest
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
/*export default (
    apiUrl: string,
    httpClient = fetchUtils.fetchJson,
    countHeader: string = 'Content-Range'
): DataProvider => ({
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;

        const filter = params.filter;
        const operators = { '_gte': '>=', '_lte': '<=', '_neq': '!=' };

        const filters = Object.keys(filter).map(key => {
            if (["_gte", "_lte", "_neq"].includes(key.slice(-4))) {
                return { field: key.slice(0, -4), operator: key.slice(-4), value: filter[key] }
            }
            
            return { field: key, operator: '=', value: filter[key] };
        });

        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([rangeStart, rangeEnd]),
            filter: JSON.stringify(filters),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const options =
            countHeader === 'Content-Range'
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Range: `${resource}=${rangeStart}-${rangeEnd}`,
                      }),
                  }
                : {};

        return httpClient(url, options).then(({ headers, json }) => {
            if (!headers.has(countHeader)) {
                throw new Error(
                    `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
                );
            }
            
                return {
                    data: json,
                    total:
                        countHeader === 'Content-Range'
                            ? parseInt(headers?.get('content-range')?.split('/')?.pop() || "0", 10)
                            : parseInt(headers?.get(countHeader.toLowerCase()) || "0"),
                };
        });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({'1': { field: "id", operator: 'in', value: params.ids }})
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;

        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const options =
            countHeader === 'Content-Range'
                ? {
                      // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
                      headers: new Headers({
                          Range: `${resource}=${rangeStart}-${rangeEnd}`,
                      }),
                  }
                : {};

        return httpClient(url, options).then(({ headers, json }) => {
            if (!headers.has(countHeader)) {
                throw new Error(
                    `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
                );
            }
            return {
                data: json,
                total:
                    countHeader === 'Content-Range'
                    ? parseInt(headers?.get('content-range')?.split('/')?.pop() || "0", 10)
                    : parseInt(headers?.get(countHeader.toLowerCase()) || "0"),
            };
        });
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        ).then(responses => ({ data: responses.map(({ json }) => json.id) })),

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'text/plain',
            }),
        }).then(({ json }) => ({ data: json })),

    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                })
            )
        ).then(responses => ({
            data: responses.map(({ json }) => json.id),
        })),
});*/