import * as request from "request";
import * as moment from "moment";
import * as _ from 'lodash';

import { MavenlinkApiEndpoint } from "./api-endpoint.class";
import { MavenlinkObjects } from './models/objects.model';
import {
    MavenlinkAliasType, MavenlinkAPICreateType, MavenlinkAPIType, MavenlinkNativeType,
    MavenlinkType
} from './models/type.model';

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

                            let includeIdName = `${includeItem}_id`;

                            // Check for special cases and fix id name for those instances
                            if (includeItem === 'participants') {
                                includeIdName = 'participant_ids';
                            }

                            // Grab the id of each included item
                            let includeId = builtObject[includeIdName];

                            // Check if type is an alias and if so convert it to native
                            let nativeType: MavenlinkNativeType = MavenlinkObjects.isAliasType(includeItem) ? MavenlinkObjects.getNativeType(<MavenlinkAliasType>includeItem) : <MavenlinkNativeType>includeItem;

                            // Get the plural name for the native type
                            let pluralName = MavenlinkObjects.getPluralName(nativeType);

                            // Check if includeId is an array or a string
                            if (Array.isArray(includeId)) {

                                builtObject[includeItem] = [];

                                // Fetch included model and include it as an attribute as the primary model
                                includeId.forEach(id => builtObject[includeItem].push(body[pluralName][id]) );

                            } else {

                                // Fetch included model and include it as an attribute as the primary model
                                builtObject[includeItem] = body[pluralName][includeId];

                            }

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

    createItem(createObject: MavenlinkAPICreateType): Promise<MavenlinkAPIType> {
        return new Promise((resolve, reject) => {

            request.post({
                'uri': this.apiEndpoint.toString(),
                'auth': {
                    'bearer': this.authToken
                },
                'json': true,
                'body': createObject
            }, (error, response, body) => {

                if (error != undefined) {
                    console.log("Error Found");
                    reject(error);
                }

                if (body.errors !== undefined) {
                    reject(body.errors);
                }

                console.log(`${this.apiEndpoint}`);
                console.log(body);
                resolve(body);
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

