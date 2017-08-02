import {MavenlinkAliasType, MavenlinkNativeType, MavenlinkType} from './type.model';

export class MavenlinkObjects {

    static pluralNames: {[key: string]: string} = {
        'story': 'stories',
        'user': 'users',
        'workspace': 'workspaces'
    };

    static aliasNames: {[key: string]: string} = {
        'participants': 'user'
    };

    static isAliasType(type: string): boolean {
        return Object.keys(this.aliasNames).indexOf(type) !== -1;
    }

    static isNativeType(type: string): boolean {
        return Object.keys(this.pluralNames).indexOf(type) !== -1;
    }

    static getPluralName(singularName: MavenlinkType) {
        return this.pluralNames[singularName];
    }

    static getNativeType(aliasName: MavenlinkAliasType): MavenlinkNativeType {
        return <MavenlinkNativeType>this.aliasNames[aliasName];
    }
}