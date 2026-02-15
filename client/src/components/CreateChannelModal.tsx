import { useState } from "react";
import { X, Hash, Lock, Globe } from "lucide-react";
import { apiRequest } from "../lib/api";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import type { Channel } from "../types";

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChannelCreated: (channel: Channel) => void;
}

export default function CreateChannelModal({ isOpen, onClose, onChannelCreated }: CreateChannelModalProps) {
    const { currentWorkspace } = useWorkspace();
    const { token } = useAuth();
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!currentWorkspace || !token) return;

        setIsLoading(true);
        try {
            const channel = await apiRequest<Channel>("/channels", {
                method: "POST",
                token,
                body: JSON.stringify({
                    workspaceId: currentWorkspace._id,
                    name: name.toLowerCase().replace(/[^a-z0-9-]/g, "-"), // Simple sanitization
                    isPrivate,
                    topic
                })
            });
            onChannelCreated(channel);
            onClose();
            setName("");
            setTopic("");
            setIsPrivate(false);
        } catch (err: any) {
            setError(err.message || "Failed to create channel");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Create Channel</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                                <Hash className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm text-black font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                style={{ caretColor: '#000000' }}
                                placeholder="e.g. project-alpha"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Lowercase, no spaces.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic (Optional)</label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            style={{ caretColor: '#000000' }}
                            placeholder="What's this channel about?"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition" onClick={() => setIsPrivate(!isPrivate)}>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isPrivate ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}>
                            {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{isPrivate ? "Private Channel" : "Public Channel"}</p>
                            <p className="text-xs text-gray-500">{isPrivate ? "Only invited members can view" : "Anyone in the workspace can join"}</p>
                        </div>
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? "bg-blue-600" : "bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? "translate-x-6" : "translate-x-1"}`} />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                            {isLoading ? "Creating..." : "Create Channel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
