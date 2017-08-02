import {MavenlinkUser} from './user.model';

export interface MavenlinkWorkspace {
    access_level: 'invitation' | 'open' | 'admin';
    archived: boolean;
    budget_used?: number;
    budgeted: boolean;
    can_create_line_items: boolean;
    can_invite: boolean;
    change_orders_enabled: boolean;
    client_role_name: string;
    consultant_role_name: string;
    created_at: string;
    currency_base_unit: number;
    currency_symbol: string;
    currency?: string;
    default_rate: number;
    description: string;
    due_date: string;
    has_budget_access: boolean;
    id: string;
    over_budget?: boolean;
    percentage_complete: number;
    permissions: any;
    posts_require_privacy_decision: boolean;
    price_in_cents?: number;
    price?: number;
    require_expense_approvals: boolean;
    require_time_approvals: boolean;
    start_date: string;
    title: string;
    updated_at: string;
    participants? : MavenlinkUser[];
}