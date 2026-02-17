import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Socket } from "socket.io-client";
import { createSocket } from "../lib/socket";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../lib/api";
import type { Workspace, User, Channel, DM } from "../types";

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    socket: Socket | null;
    isLoading: boolean;
    refreshWorkspaces: () => Promise<void>;
    selectWorkspace: (slug: string | null) => void;
    createWorkspace: (name: string, slug: string) => Promise<Workspace>;
    generateInvite: (slug: string) => Promise<string>;
    joinWorkspace: (code: string) => Promise<{ slug: string; message: string }>;
    addMember: (slug: string, userId: string) => Promise<void>;
    updateWorkspace: (slug: string, name: string) => Promise<Workspace>;
    deleteWorkspace: (slug: string) => Promise<void>;
    onlineUsers: User[];
    typingUsers: string[];
    channels: Channel[];
    refreshChannels: () => Promise<void>;
    deleteChannel: (channelId: string) => Promise<void>;
    dms: DM[];
    refreshDMs: () => Promise<void>;
    getOrCreateDM: (otherUserId: string) => Promise<DM | null>;
    content: string;
    setContent: (content: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Real-time state
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [dms, setDMs] = useState<DM[]>([]);
    const [content, setContent] = useState("");

    // Fetch channels when workspace changes
    const refreshChannels = async () => {
        if (!token || !currentWorkspace) return;
        try {
            const data = await apiRequest<Channel[]>(`/channels/workspace/${currentWorkspace._id}`, { token });
            setChannels(data);
        } catch (err) {
            console.error("Failed to fetch channels", err);
            setChannels([]);
        }
    };

    // Fetch DMs
    const refreshDMs = async () => {
        if (!token || !currentWorkspace) return;
        try {
            const data = await apiRequest<DM[]>(`/dms/workspace/${currentWorkspace._id}`, { token });
            setDMs(data);
        } catch (err) {
            console.error("Failed to fetch DMs", err);
            setDMs([]);
        }
    };

    const getOrCreateDM = async (otherUserId: string) => {
        if (!token || !currentWorkspace) return null;
        try {
            const data = await apiRequest<DM>("/dms/create", {
                method: "POST",
                body: JSON.stringify({ workspaceId: currentWorkspace._id, otherUserId }),
                token
            });
            // Update DMs list if new?
            // actually refreshDMs might be better or just append if not exists
            setDMs(prev => {
                if (prev.find(d => d._id === data._id)) return prev;
                return [data, ...prev];
            });
            return data;
        } catch (err) {
            console.error("Failed to create DM", err);
            return null;
        }
    };

    useEffect(() => {
        refreshChannels();
        refreshDMs();
    }, [currentWorkspace?._id, token]);

    // Fetch workspaces on load/auth
    const refreshWorkspaces = async () => {
        if (!token) return;
        try {
            const data = await apiRequest<Workspace[]>("/workspaces", { token });
            setWorkspaces(data);
        } catch (err) {
            console.error("Failed to fetch workspaces", err);
        }
    };

    useEffect(() => {
        refreshWorkspaces();
    }, [token]);

    // Create socket once when user has token
    useEffect(() => {
        if (!token) return;

        console.log("Creating socket connection");
        const newSocket = createSocket(token);
        setSocket(newSocket);
        newSocket.connect();

        newSocket.on("workspace:connected", (data: { users: User[] }) => {
            setOnlineUsers(data.users || []);
        });

        newSocket.on("user:joined", (data: { user: User }) => {
            setOnlineUsers(prev => [...prev.filter(u => u._id !== data.user._id), data.user]);
        });

        newSocket.on("user:left", (data: { socketId: string }) => {
            setOnlineUsers(prev => prev.filter(u => (u as any).socketId !== data.socketId));
        });

        newSocket.on("typing:start", ({ username }: { username: string }) => {
            setTypingUsers(prev => {
                if (prev.includes(username)) return prev;
                return [...prev, username];
            });
        });

        newSocket.on("typing:stop", ({ username }: { username: string }) => {
            setTypingUsers(prev => prev.filter(u => u !== username));
        });

        // Content Sync
        newSocket.on("workspace:connected", (data: { content?: string; users?: User[] }) => {
            if (data.content !== undefined) setContent(data.content);
            if (data.users) setOnlineUsers(data.users);
        });

        newSocket.on("workspace:update", (data: { content: string }) => {
            setContent(data.content);
        });

        return () => {
            console.log("Disconnecting socket");
            newSocket.disconnect();
            setSocket(null);
        };
    }, [token]);

    // Handle workspace room switching
    useEffect(() => {
        if (!socket || !currentWorkspace) return;

        console.log("Joining workspace room:", currentWorkspace.slug);
        socket.emit("workspace:join", { slug: currentWorkspace.slug });

        return () => {
            console.log("Leaving workspace room:", currentWorkspace.slug);
            socket.emit("workspace:leave", { slug: currentWorkspace.slug });
            setOnlineUsers([]);
            setTypingUsers([]);
            // Don't clear content here, let selectWorkspace(null) handle it or keep it for next load
        };
    }, [socket, currentWorkspace?._id]);

    const selectWorkspace = async (slug: string | null) => {
        if (!slug) {
            setCurrentWorkspace(null);
            setContent("");
            return;
        }
        setIsLoading(true);
        try {
            const data = await apiRequest<Workspace>(`/workspaces/${slug}`, { token: token! });
            setCurrentWorkspace(data);
            // Use API content as starting point while waiting for socket
            setContent(data.content || "");
        } catch (err) {
            console.error("Failed to select workspace", err);
            setCurrentWorkspace(null);
            setContent("");
        } finally {
            setIsLoading(false);
        }
    };

    const createWorkspace = async (name: string, slug: string) => {
        const data = await apiRequest<Workspace>("/workspaces", {
            method: "POST",
            body: JSON.stringify({ name, slug }),
            token: token!,
        });
        setWorkspaces(prev => [...prev, data]);
        return data;
    };

    const generateInvite = async (slug: string) => {
        const data = await apiRequest<{ inviteCode: string }>(`/workspaces/${slug}/invite`, {
            method: "POST",
            token: token!,
        });
        return data.inviteCode;
    };

    const joinWorkspace = async (code: string) => {
        const data = await apiRequest<{ slug: string; message: string }>(`/workspaces/join/${code}`, {
            method: "POST",
            token: token!,
        });

        await refreshWorkspaces();
        return data;
    };

    const addMember = async (slug: string, userId: string) => {
        await apiRequest(`/workspaces/${slug}/add-member`, {
            method: "POST",
            body: JSON.stringify({ userId }),
            token: token!,
        });
    };

    const updateWorkspace = async (slug: string, name: string) => {
        const data = await apiRequest<Workspace>(`/workspaces/${slug}`, {
            method: "PUT",
            body: JSON.stringify({ name }),
            token: token!,
        });

        // Update local state
        setWorkspaces(prev => prev.map(ws => ws.slug === slug ? data : ws));
        if (currentWorkspace?.slug === slug) {
            setCurrentWorkspace(data);
        }

        return data;
    };

    const deleteWorkspace = async (slug: string) => {
        await apiRequest(`/workspaces/${slug}`, {
            method: "DELETE",
            token: token!,
        });

        setWorkspaces(prev => prev.filter(ws => ws.slug !== slug));
        if (currentWorkspace?.slug === slug) {
            setCurrentWorkspace(null);
        }
    };

    const deleteChannel = async (channelId: string) => {
        if (!token) return;
        try {
            await apiRequest(`/channels/${channelId}`, {
                method: "DELETE",
                token,
            });
            // Update local state by removing deleted channel
            setChannels(prev => prev.filter(c => c._id !== channelId));
        } catch (err) {
            console.error("Failed to delete channel", err);
            throw err;
        }
    };

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            currentWorkspace,
            socket,
            isLoading,
            refreshWorkspaces,
            selectWorkspace,
            createWorkspace,
            generateInvite,
            joinWorkspace,
            addMember,
            updateWorkspace,
            deleteWorkspace,
            onlineUsers,
            typingUsers,
            channels,
            refreshChannels,
            deleteChannel,
            dms,
            refreshDMs,
            getOrCreateDM,
            content,
            setContent
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}
