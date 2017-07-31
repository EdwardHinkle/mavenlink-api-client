import { MavenlinkWorkspace } from './workspace.model';

export interface MavenlinkStory {
    id: string;
    workspace_id: string;
    workspace?: MavenlinkWorkspace;
    parent_id: string;
    title: string;
    description: string;
    story_type: 'task' | 'deliverable' | 'milestone' | 'issue';
    state: 'not started' | 'started' | 'completed' | 'new' | 'reopened' | 'in progress' | 'blocked' | 'fixed' | 'duplicate' | 'can\'t reproduce' | 'resolved' | 'won\'t fix';
    priority: 'low' | 'normal' | 'high' | 'critical';
    position:  number;
    archived: boolean;
    deleted_at?: string;
    percentage_complete: number;
    updated_at: string;
    created_at: string;
    due_date: string;
    start_date: string;
    sub_story_count: number;
    weight: number;
    billable?: boolean;
    fixed_fee?: boolean;
    budget_estimate_in_cents?: number;
    sub_stories_budget_estimate_in_cents?: number;
    budget_used_in_cents?: number;
    sub_stories_budget_used_in_cents?: number;
    time_estimate_in_minutes?: number;
    sub_stories_time_estimate_in_minutes?: number;
    logged_billable_time_in_minutes?: number;
    sub_stories_billable_time_in_minutes?: number;
    logged_nonbillable_time_in_minutes?: number;
}