import { MavenlinkType } from './type.model';

export class MavenlinkObjects {

    static pluralNames: {[key: string]: string} = {
        'story': 'stories',
        'user': 'users',
        'workspace': 'workspaces'
    };

    static getPluralName(singularName: MavenlinkType) {
        return this.pluralNames[singularName];
    }
}