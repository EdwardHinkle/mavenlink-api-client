import * as moment from 'moment';

import { MavenlinkStoryType } from './models/story-type.model';
import {MavenlinkAliasType, MavenlinkType} from './models/type.model';

export class MavenlinkApiEndpoint {
    apiRoot: string = 'https://api.mavenlink.com/api/v1';
    apiEndpoint: string;
    apiOptions: MavenlinkApiOptions;

    constructor(options: MavenlinkApiEndpointOptions) {
        this.apiRoot = options.apiRoot ? options.apiRoot : this.apiRoot;
        this.apiEndpoint = options.apiEndpoint;
        this.apiOptions = options.apiOptions;
    }

    stringifyApiOptions(): string {
        let stringOptions = '';

        for (let key in this.apiOptions) {
            switch(key) {
                case 'per_page':
                    stringOptions += `${key}=${this.apiOptions.per_page}&`;
                    break;
                case 'page':
                    stringOptions += `${key}=${this.apiOptions.page}&`;
                    break;
                case 'all_on_account':
                    stringOptions += `${key}=${this.apiOptions.all_on_account}&`;
                    break;
                case 'updated_after':
                    stringOptions += `${key}=${this.apiOptions.updated_after.toISOString()}&`;
                    break;
                case 'updated_before':
                    stringOptions += `${key}=${this.apiOptions.updated_before.toISOString()}&`;
                    break;
                case 'story_type':
                    stringOptions += `${key}=${this.apiOptions.story_type.join(",")}&`;
                    break;
                case 'story_id':
                    stringOptions += `${key}=${this.apiOptions.story_id}&`;
                    break;
                case 'include':
                    stringOptions += `${key}=${this.apiOptions.include.join(",")}&`;
                    break;
            }
        }

        return stringOptions.slice(0, stringOptions.length-1);
    }

    toString(): string {
        return `${this.apiRoot}/${this.apiEndpoint}.json?${this.stringifyApiOptions()}`;
    }
}

export interface MavenlinkApiEndpointOptions {
    apiRoot?: string;
    apiEndpoint: string;
    apiOptions: MavenlinkApiOptions;
}

export interface MavenlinkApiOptions {
    per_page?: number;
    page?: number;
    all_on_account?: boolean;
    updated_after?: moment.Moment;
    updated_before?: moment.Moment;
    story_type?: MavenlinkStoryType[],
    story_id?: string;
    include?: MavenlinkType[];
}

