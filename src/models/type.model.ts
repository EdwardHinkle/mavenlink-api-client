import {MavenlinkPost} from './post.model';
import {MavenlinkStory} from './story.model';
import {MavenlinkUser} from './user.model';
import {MavenlinkWorkspace} from './workspace.model';

export type MavenlinkNativeType = 'story' | 'user' | 'workspace';

export type MavenlinkAliasType = 'participants';

export type MavenlinkType = MavenlinkNativeType | MavenlinkAliasType;

export type MavenlinkAPIType = MavenlinkPost | MavenlinkStory | MavenlinkUser | MavenlinkWorkspace;