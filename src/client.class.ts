import * as request from "request";
import * as moment from "moment";
import * as _ from 'lodash';

import { MavenlinkApiEndpoint } from "./api-endpoint.class";
import { MavenlinkApiRequest } from './api-request.class';
import { MavenlinkStory } from './models/story.model';
import { MavenlinkStoryStateChanges } from "./models/story-state-changes.model";
import { MavenlinkStoryType } from './models/story-type.model';

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

    checkStoryIsComplete(options: MavenlinkWatcherOptions, callbackFn: (completedStories: { story?: MavenlinkStory; changes?: MavenlinkStoryStateChanges }[]) => void) {

        const story_type = options.story_type;
        const frequency = options.frequency || 60; // Default to once an hour
        let lastCheckedTime = moment();

            this.checkTaskTimer = setInterval(() => {

                console.log(`...any new tasks completed since: ${lastCheckedTime}`);

                // Fetch All Stories and loop
                let apiEndpoint = new MavenlinkApiEndpoint({
                    apiRoot: this.apiRoot,
                    apiEndpoint: 'stories',
                    apiOptions: {
                        per_page: 200,
                        page: 1,
                        all_on_account: true,
                        updated_after: lastCheckedTime,
                        // updated_before: moment(lastCheckedTime).add(5, 'hours'),
                        story_type: [story_type],
                        include: ['workspace']
                    }
                });

                let apiRequest = new MavenlinkApiRequest({
                    adminAuthToken: this.adminAuthToken,
                    apiEndpoint: apiEndpoint
                });

                apiRequest.fetchAllResults().then((stories: MavenlinkStory[]) => {
                    console.log(`Stories retrieved ${stories.length}`);

                    let waitingForStateChanges: Promise<MavenlinkStoryStateChanges[]>[] = [];

                    // Grab all the story state changes for all of these stories
                    stories.forEach((story) => {
                        let stateChangeRequest = new MavenlinkApiRequest({
                            adminAuthToken: this.adminAuthToken,
                            apiEndpoint: new MavenlinkApiEndpoint({
                                apiRoot: this.apiRoot,
                                apiEndpoint: 'story_state_changes',
                                apiOptions: {
                                    per_page: 200,
                                    page: 1,
                                    story_id: story.id,
                                    include: ['user']
                                }
                            })
                        });

                        waitingForStateChanges.push(stateChangeRequest.fetchAllResults());
                    });

                    return Promise.all(waitingForStateChanges)
                            // flatten multi-dimensional array
                        .then(stateChangeArrays => _.flatten(stateChangeArrays))
                            // filter out any state changes that are before last time checked or are not becoming complete
                        .then(stateChanges => stateChanges.filter(stateChange => stateChange.state == 'completed' && lastCheckedTime.isBefore(stateChange.created_at)))
                            // filter out all stories that do not have a complete state change
                        .then((completedStateChanges) => {
                            console.log(`State changes retrieved ${completedStateChanges.length}`);

                            if (completedStateChanges.length > 0) {
                                // grab a list of story ids that were recently marked as completed
                                let completedStoryIds = completedStateChanges.map(stateChange => stateChange.story_id);

                                // reduce the list of stories to be only stories marked complete recently
                                let completedStories = stories.filter(story => completedStoryIds.indexOf(story.id) !== -1);

                                // Add state change object to their stories
                                let storiesWithChanges: { story?: MavenlinkStory; changes?: MavenlinkStoryStateChanges }[] = [];
                                completedStories.forEach((story) => {
                                    let storyWithChanges: { story?: MavenlinkStory; changes?: MavenlinkStoryStateChanges } = {};
                                    storyWithChanges.story = story;
                                    storyWithChanges.changes = completedStateChanges.find((stateChange => stateChange.story_id == story.id));
                                    storiesWithChanges.push(storyWithChanges);
                                });

                                return storiesWithChanges;
                            } else {
                                return [];
                            }
                        });

                }).then((storiesWithChanges) => {

                    // At the end we need to update that we checked the task
                    lastCheckedTime = moment();

                    // return final stories
                    if (storiesWithChanges.length > 0) {
                        callbackFn(storiesWithChanges);
                    }
                });

            }, frequency * 60000);

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
    frequency?: number; // This is the frequency at which an API is watched in minutes
    story_type: MavenlinkStoryType;
}

export interface MavenlinkResult {
    key: string;
    id: string;
}