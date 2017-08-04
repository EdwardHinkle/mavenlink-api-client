# mavenlink-api-client
A TypeScript/JavaScript Node.js API Client for Mavenlink's API

## Usage

First, install the package using npm:

    npm install mavenlink-api --save

Then, require the package and use it like so:

    import { MavenlinkClient } from 'mavenlink-api';

    var client = new MavenlinkClient({
        appId: string;
        secretToken: string;
        callbackUrl: string;
        adminAuthToken: string;
        apiRoot?: string;
    });

## License

MIT