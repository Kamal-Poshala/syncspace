import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { X, Loader2, Trash2, Users, Shield, User as UserIcon, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkspaceSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WorkspaceSettingsModal({ isOpen, onClose }: WorkspaceSettingsModalProps) {
    const { currentWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
    const { user: currentUser } = useAuth();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const isOwner = currentWorkspace?.owner === currentUser?._id ||
        (typeof currentWorkspace?.owner === 'object' && currentWorkspace.owner._id === currentUser?._id);

    useEffect(() => {
        if (currentWorkspace) {
            setName(currentWorkspace.name);
        }
        setShowDeleteConfirm(false);
        setError("");
    }, [currentWorkspace, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWorkspace || !name.trim()) return;

        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            await updateWorkspace(currentWorkspace.slug, name.trim());
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to update workspace");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentWorkspace) return;
        setIsDeleting(true);
        try {
            await deleteWorkspace(currentWorkspace.slug);
            onClose();
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to delete workspace");
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOwner && isOpen) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl text-center">
                        <Shield className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                        <p className="text-gray-400 mb-6">Only the workspace owner can access settings.</p>
                        <button onClick={onClose} className="w-full rounded-lg bg-gray-800 py-2 text-white hover:bg-gray-700 transition-colors">Close</button>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <Settings className="mr-3 h-6 w-6 text-blue-500" />
                                    Workspace Management
                                </h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm">Manage {currentWorkspace?.name}'s core configuration and members.</p>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* General Settings */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center">
                                    General Info
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                                            Display Name
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                                style={{ caretColor: '#000000' }}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={isLoading || !name.trim() || name === currentWorkspace?.name}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-700"
                                            >
                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
                                    {success && <p className="text-xs text-green-500 mt-1 ml-1">Changes saved!</p>}
                                </form>
                            </section>

                            {/* Member Management */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center">
                                        Members ({currentWorkspace?.members.length})
                                    </h3>
                                    <Users className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="rounded-xl border border-white/5 bg-black/20 divide-y divide-white/5 max-h-48 overflow-y-auto">
                                    {currentWorkspace?.members.map((member, idx) => {
                                        const memberUser = typeof member.userId === 'object' ? member.userId : null;
                                        return (
                                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 border border-blue-500/20 overflow-hidden">
                                                        {memberUser?.avatar ? (
                                                            <img src={memberUser.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{memberUser?.username || "Unknown"}</p>
                                                        <p className="text-[10px] text-gray-500 capitalize">{member.role}</p>
                                                    </div>
                                                </div>
                                                {member.role === 'admin' && <Shield className="h-3 w-3 text-blue-500" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="pt-4 border-t border-white/5">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-500/80 mb-4">
                                    Danger Zone
                                </h3>
                                {!showDeleteConfirm ? (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-red-500">Delete Workspace</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Permanently remove this workspace and all its data.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-red-500 bg-red-500/10 p-4">
                                        <p className="text-sm text-white font-bold mb-3">Are you absolutely sure?</p>
                                        <p className="text-xs text-red-200 mb-4">You'll lose all channels, messages, and canvas content. This cannot be undone.</p>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={isDeleting}
                                                onClick={handleDelete}
                                                className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-bold text-white hover:bg-red-600 transition-all flex items-center justify-center"
                                            >
                                                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Trash2 className="h-3 w-3 mr-2" />}
                                                Confirm Delete
                                            </button>
                                            <button
                                                disabled={isDeleting}
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-4 rounded-lg bg-gray-800 text-xs text-white hover:bg-gray-700 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
