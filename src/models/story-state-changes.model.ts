import { MavenlinkStory } from './story.model';
import { MavenlinkUser } from './user.model';

export interface MavenlinkStoryStateChanges {
    id: number;
    created_at: string;
    state: 'not started' | 'started' | 'completed';
    formatted_state: string;
    user_id: string;
    story_id: string;
    story?: MavenlinkStory;
    user?: MavenlinkUser;
}