import { Link } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { Hash, Plus, UserPlus, Settings } from "lucide-react";
import { useState } from "react";
import InviteModal from "./InviteModal";
import ProfileSettings from "./ProfileSettings";
import CreateChannelModal from "./CreateChannelModal";

export default function Sidebar() {
    const { workspaces, currentWorkspace, channels, dms, refreshChannels } = useWorkspace();
    const { user } = useAuth();
    const [showInvite, setShowInvite] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showCreateChannel, setShowCreateChannel] = useState(false);

    // Mock DM creation using Invite Modal for now or add a User Search Modal
    // For now, let's use the Invite modal as a way to "find" people, but ideally we have a "New Message" button
    // that opens a user search. 
    // Since we have "Advanced Invite Modal" which has search, maybe we can reuse it or create a simple user finder.

    return (
        <div className="flex h-full w-64 flex-col border-r border-gray-800 bg-gray-900 text-white">
            {/* Workspace Switcher Header */}
            <div className="flex h-14 items-center border-b border-gray-800 px-4">
                <h1 className="truncate font-bold tracking-tight text-white">{currentWorkspace?.name || "SyncSpace"}</h1>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-3">
                {/* Workspaces List (Shortcuts) */}
                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between px-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Workspaces
                        </h3>
                        <Link to="/" className="text-gray-500 hover:text-white">
                            <Settings className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="space-y-1">
                        {workspaces.map((ws) => (
                            <Link
                                key={ws._id}
                                to={`/workspace/${ws.slug}`}
                                className={cn(
                                    "flex items-center rounded-md px-2 py-1.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white",
                                    currentWorkspace?.slug === ws.slug && "bg-blue-600 text-white hover:bg-blue-600"
                                )}
                            >
                                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded bg-gray-700 text-xs font-bold shadow-sm">
                                    {ws.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="truncate">{ws.name}</span>
                            </Link>
                        ))}
                        <Link
                            to="/"
                            className="flex items-center rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-800 hover:text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add / Join
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Content
                    </h3>
                    <div className="space-y-1">
                        <Link
                            to={`/workspace/${currentWorkspace?.slug}/doc/main`}
                            className={cn(
                                "flex items-center rounded-md px-2 py-1.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <span className="mr-2 h-4 w-4">📄</span>
                            <span>Canvas</span>
                        </Link>
                    </div>
                </div>

                {/* Channels */}
                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between px-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Channels
                        </h3>
                        <button
                            onClick={() => setShowCreateChannel(true)}
                            className="text-gray-500 hover:text-white transition"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {channels.map((channel) => (
                            <Link
                                key={channel._id}
                                to={`/workspace/${currentWorkspace?.slug}/channel/${channel._id}`}
                                className={cn(
                                    "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition",
                                    // TODO: Highlight active channel based on URL
                                    "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                {channel.isPrivate ? (
                                    <Hash className="mr-2 h-4 w-4 text-gray-500" />
                                ) : (
                                    <Hash className="mr-2 h-4 w-4 text-gray-500" />
                                )}
                                <span className="truncate">{channel.name}</span>
                            </Link>
                        ))}

                        {channels.length === 0 && (
                            <p className="px-2 text-xs text-gray-600 italic">No channels yet.</p>
                        )}
                    </div>
                </div>

                {/* Direct Messages */}
                <div>
                    <div className="mb-2 flex items-center justify-between px-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Direct Messages
                        </h3>
                        <button
                            className="text-gray-500 hover:text-white transition"
                            onClick={() => setShowInvite(true)}
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-1">
                        {dms.map((dm) => {
                            const otherUser = dm.members.find(m => m._id !== user?._id);
                            return (
                                <Link
                                    key={dm._id}
                                    to={`/workspace/${currentWorkspace?.slug}/dm/${dm._id}`}
                                    className={cn(
                                        "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition",
                                        "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    <div className="relative mr-2">
                                        <img
                                            src={otherUser?.avatar || "https://via.placeholder.com/24"}
                                            className="h-4 w-4 rounded-full bg-gray-600 object-cover"
                                            alt=""
                                        />
                                        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full border border-gray-900 bg-green-500"></span>
                                    </div>
                                    <span className="truncate">{otherUser?.username || "Unknown"}</span>
                                </Link>
                            );
                        })}
                        {dms.length === 0 && (
                            <p className="px-2 text-xs text-gray-600 italic">No DMs yet.</p>
                        )}

                        <button
                            onClick={() => setShowInvite(true)}
                            className="mt-6 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-blue-400 hover:bg-gray-800 hover:text-blue-300"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite People
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={() => setShowProfile(true)}
                    className="flex w-full items-center rounded-lg p-2 hover:bg-gray-800"
                >
                    <div className="relative">
                        <img src={user?.avatar} alt="" className="h-9 w-9 rounded-full bg-gray-700 object-cover" />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-gray-900 bg-green-500"></span>
                    </div>
                    <div className="ml-3 flex-1 text-left">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-gray-500">Online</p>
                    </div>
                </button>
            </div>

            <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} />
            <ProfileSettings isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <CreateChannelModal
                isOpen={showCreateChannel}
                onClose={() => setShowCreateChannel(false)}
                onChannelCreated={() => refreshChannels()}
            />
        </div>
    );
}
