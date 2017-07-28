import * as request from "request";
import * as moment from "moment";
import * as _ from 'lodash';

import { MavenlinkApiEndpoint } from "./api-endpoint.class";
import { MavenlinkApiRequest } from './api-request.class';

export class MavenlinkClient {
    appId: string;
    secretToken: string;
    callbackUrl: string;
    adminAuthToken: string;
    apiRoot: string = 'https://api.mavenlink.com/api/v1';

    checkTaskTimer: NodeJS.Timer;

    constructor(options: MavenlinkClientOptions) {
        this.appId = options.appId;
        this.secretToken = options.secretToken;
        this.callbackUrl = options.callbackUrl;
        this.adminAuthToken = options.adminAuthToken;
        if (options.apiRoot !== undefined) {
            this.apiRoot = options.apiRoot;
        }
    }

    checkTaskIsComplete(options: MavenlinkWatcherOptions = {}, callbackFn: (tasks: any[]) => void) {

        const frequency = options.frequency || 3600; // Default to once an hour
        let lastCheckedTime = moment("2017-07-26T14:23:37-0400");

            this.checkTaskTimer = setInterval(() => {

                console.log(`...Checking if any new tasks completed since: ${lastCheckedTime}`);

                // Fetch All Stories and loop
                let apiEndpoint = new MavenlinkApiEndpoint({
                    apiRoot: this.apiRoot,
                    apiEndpoint: 'stories',
                    apiOptions: {
                        per_page: 200,
                        page: 1,
                        all_on_account: true,
                        updated_after: lastCheckedTime
                    }
                });

                console.log(`Fetching ${apiEndpoint}`);

                let apiRequest = new MavenlinkApiRequest({
                    adminAuthToken: this.adminAuthToken,
                    apiEndpoint: apiEndpoint
                });

                apiRequest.fetchAllResults(undefined, (tasks: any[]) => {
                    console.log("Final Callback");
                    // console.log(tasks);
                    console.log(tasks.length);

                    // todo: Grab all the story state changes for all of these stories
                    // We might need to do some type of async promises in case there are a LOT of stories at the same time

                    // todo: Check each story state change to see if it is complete since lastCheckedTime
                    // If so, add it to the return array

                    // After stories loop, check if there are any complete
                    callbackFn([]);

                    // At the end we need to update that we checked the task
                    lastCheckedTime = moment();

                });

            }, frequency * 1000);

    }

    stopCheckingTask() {
        clearInterval(this.checkTaskTimer);
    }

}

export interface MavenlinkClientOptions {
    appId: string;
    secretToken: string;
    callbackUrl: string;
    adminAuthToken: string;
    apiRoot?: string;
}

export interface MavenlinkWatcherOptions {
    frequency?: number; // This is the frequency at which an API is watched in seconds

}

export interface MavenlinkResult {
    key: string;
    id: string;
}