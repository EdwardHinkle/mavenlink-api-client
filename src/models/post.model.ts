export interface MavenlinkPost {
    message: string;
    workspace_id: string;
    subject_id?: string;
    subject_type?: 'Post'
    story_id?: string;
    recipient_ids?: string[];
    attachment_ids?: string[];
}

export interface MavenlinkCreatePost {
    post: MavenlinkPost;
}