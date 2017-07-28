import * as moment from 'moment';

export class MavenlinkApiEndpoint {
    apiRoot: string;
    apiEndpoint: string;
    apiOptions: MavenlinkApiOptions;

    constructor(options: MavenlinkApiEndpointOptions) {
        this.apiRoot = options.apiRoot;
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
            }
        }

        return stringOptions.slice(0, stringOptions.length-1);
    }

    toString(): string {
        return `${this.apiRoot}/${this.apiEndpoint}.json?${this.stringifyApiOptions()}`;
    }
}

export interface MavenlinkApiEndpointOptions {
    apiRoot: string;
    apiEndpoint: string;
    apiOptions: MavenlinkApiOptions;
}

export interface MavenlinkApiOptions {
    per_page?: number;
    page?: number;
    all_on_account?: boolean;
    updated_after?: moment.Moment;
}