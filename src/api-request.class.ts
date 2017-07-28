import * as request from "request";
import * as moment from "moment";
import * as _ from 'lodash';

import { MavenlinkApiEndpoint } from "./api-endpoint.class";

export class MavenlinkApiRequest {

    adminAuthToken: string;
    apiEndpoint: MavenlinkApiEndpoint;

    constructor(options: MavenlinkRequestOptions) {
        this.adminAuthToken = options.adminAuthToken;
        this.apiEndpoint = options.apiEndpoint;
    }

    fetchAllResults(existingResults: any[] = [], callbackFn: (tasks: any[]) => void) {
        request.get({
            'uri': this.apiEndpoint.toString(),
            'auth': {
                'bearer': this.adminAuthToken
            },
            'json': true
        }, (error, response, body) => {

            if (error != undefined) {
                console.log("Error Found");
                throw new Error(error);
            }

            let combinedTasks = existingResults.concat(_.map(body.results, (result: MavenlinkResult) => {
                return body[result.key][result.id];
            }));

            if (body.count > combinedTasks.length) {

                // Set the correct page number based on how many items have been collected
                this.apiEndpoint.apiOptions.page = (combinedTasks.length / this.apiEndpoint.apiOptions.per_page) + 1;

                // we need to get more get more
                this.fetchAllResults(combinedTasks, callbackFn);

            } else {

                // We have all of our tasks
                callbackFn(combinedTasks);

            }
        });
    }

}

export interface MavenlinkRequestOptions {
    adminAuthToken: string;
    apiEndpoint: MavenlinkApiEndpoint
}

export interface MavenlinkResult {
    key: string;
    id: string;
}