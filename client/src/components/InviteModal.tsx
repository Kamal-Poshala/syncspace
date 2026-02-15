import { useState, useEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import { apiRequest } from "../lib/api";
import { X, Copy, Check, Search, UserPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../types";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
    const { currentWorkspace, generateInvite, addMember } = useWorkspace();
    const [activeTab, setActiveTab] = useState<"link" | "search">("link");

    // Link State
    const [inviteLink, setInviteLink] = useState("");
    const [copied, setCopied] = useState(false);

    // Search State
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingId, setAddingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    // Initial Link Gen
    useEffect(() => {
        if (isOpen && currentWorkspace) {
            setInviteLink(`${window.location.origin}/join/${currentWorkspace.inviteCode || "..."}`);
            if (!currentWorkspace.inviteCode) {
                generateInvite(currentWorkspace.slug).then(code => {
                    setInviteLink(`${window.location.origin}/join/${code}`);
                });
            }
        }
    }, [isOpen, currentWorkspace]);

    // Search Logic (Debounced in effect would be better, but simple handler here)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const users = await apiRequest<User[]>(`/users/search?query=${encodeURIComponent(query)}`, {
                    token: localStorage.getItem("token") || ""
                });
                setResults(users);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddMember = async (userId: string) => {
        setAddingId(userId);
        try {
            await addMember(currentWorkspace!.slug, userId);
            setMessage("User added!");
            setTimeout(() => setMessage(""), 2000);
            // Remove from results to prevent double add
            setResults(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            setMessage("Failed to add user.");
        } finally {
            setAddingId(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-900">Invite People</h2>
                            <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab("link")}
                                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'link' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Copy Link
                            </button>
                            <button
                                onClick={() => setActiveTab("search")}
                                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Search Users
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === "link" ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">Share this link with anyone you want to join this workspace.</p>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            readOnly
                                            value={inviteLink}
                                            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 focus:outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className={`flex items-center rounded-lg px-4 py-2 font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by username..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="h-48 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            </div>
                                        ) : results.length > 0 ? (
                                            <ul className="space-y-2">
                                                {results.map(user => (
                                                    <li key={user._id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50">
                                                        <div className="flex items-center space-x-3">
                                                            <img src={user.avatar} className="h-8 w-8 rounded-full bg-gray-200" alt="" />
                                                            <span className="font-medium text-gray-900">{user.username}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddMember(user._id)}
                                                            disabled={!!addingId}
                                                            className="rounded-md bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 disabled:opacity-50"
                                                        >
                                                            {addingId === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : query.length > 1 ? (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No users found
                                            </div>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                Type to search...
                                            </div>
                                        )}
                                    </div>
                                    {message && <p className="text-center text-sm text-green-600">{message}</p>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
