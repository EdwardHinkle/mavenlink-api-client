import * as request from "request";
import * as moment from "moment";
import * as _ from 'lodash';

import { MavenlinkApiEndpoint } from "./api-endpoint.class";
import { MavenlinkObjects } from './models/objects.model';

export class MavenlinkApiRequest {

    authToken: string;
    apiEndpoint: MavenlinkApiEndpoint;

    constructor(options: MavenlinkRequestOptions) {
        this.authToken = options.authToken;
        this.apiEndpoint = options.apiEndpoint;
    }

    fetchAllResults<T>(existingResults: T[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {

            request.get({
                'uri': this.apiEndpoint.toString(),
                'auth': {
                    'bearer': this.authToken
                },
                'json': true
            }, (error, response, body) => {

                if (error != undefined) {
                    console.log("Error Found");
                    throw new Error(error);
                }

                console.log(`${this.apiEndpoint}`);

                let combinedTasks = existingResults.concat(_.map(body.results, (result: MavenlinkResult) => {
                    // Grab the main object we were fetching
                    let builtObject = body[result.key][result.id];

                    // Check if we are including any models
                    if (this.apiEndpoint.apiOptions.include !== undefined) {
                        this.apiEndpoint.apiOptions.include.forEach((includeItem) => {

                            // Grab the id of each included item
                            let includeId = builtObject[`${includeItem}_id`];

                            // Fetch included model and include it as an attribute as the primary model
                            builtObject[includeItem] = body[MavenlinkObjects.getPluralName(includeItem)][includeId];
                        });
                    }

                    return builtObject;
                }));

                if (body.count > combinedTasks.length) {

                    // Set the correct page number based on how many items have been collected
                    this.apiEndpoint.apiOptions.page = (combinedTasks.length / this.apiEndpoint.apiOptions.per_page) + 1;

                    // we need to get more get more
                    this.fetchAllResults(combinedTasks).then((tasks) => {
                        resolve(tasks);
                    });

                } else {

                    // We have all of our tasks
                    resolve(combinedTasks);

                }
            });

        });
    }

}

export interface MavenlinkRequestOptions {
    authToken: string;
    apiEndpoint: MavenlinkApiEndpoint
}

export interface MavenlinkResult {
    key: string;
    id: string;
}

