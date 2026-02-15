export interface User {
    _id: string; // or id, depending on backend response, usually _id from Mongo
    username: string;
    avatar?: string;
    status?: string;
}

export interface Member {
    userId: User;
    role: 'admin' | 'editor' | 'viewer';
    joinedAt: string;
}

export interface Workspace {
    _id: string;
    name: string;
    slug: string;
    inviteCode?: string;
    owner: User | string;
    members: Member[];
    content?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Channel {
    _id: string;
    workspaceId: string;
    name: string;
    topic?: string;
    isPrivate: boolean;
    members: string[]; // User IDs
    createdAt: string;
}

export interface Message {
    _id: string;
    content: string;
    sender: User;
    channelId?: string;
    dmId?: string;
    workspaceId: string;
    createdAt: string;
    isSystem?: boolean;
}

export interface DM {
    _id: string;
    workspaceId: string;
    members: User[];
    lastMessageAt: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string; // This might be _id in some contexts, be careful
        _id: string; // Ensure consistency
        username: string;
        avatar: string;
        status: string;
    };
}
