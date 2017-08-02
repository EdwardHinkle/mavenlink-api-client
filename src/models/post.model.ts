import {MavenlinkObject} from './object.interface';

export interface MavenlinkPost extends MavenlinkObject {
    message: string;
    workspace_id: string;
    subject_id?: string;
    subject_type?: 'Post'
    story_id?: string;
    recipient_ids?: string[];
    attachment_ids?: string[];
}