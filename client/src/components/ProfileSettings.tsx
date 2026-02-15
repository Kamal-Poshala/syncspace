import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Camera, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const updates: any = {};
            if (username !== user?.username) updates.username = username;
            if (avatar !== user?.avatar) updates.avatar = avatar;
            if (password) updates.password = password;

            await updateProfile(updates);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setPassword("");
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setIsLoading(false);
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
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Edit Profile</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative group cursor-pointer">
                                    <img
                                        src={avatar || user?.avatar || "https://via.placeholder.com/150"}
                                        alt="Avatar"
                                        className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-50 transition group-hover:opacity-75"
                                    />
                                    <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition group-hover:opacity-100">
                                        <Camera className="h-8 w-8 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append("file", file);

                                                try {
                                                    setIsLoading(true);
                                                    // Direct fetch for multipart
                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: formData
                                                    });
                                                    const data = await res.json();
                                                    if (data.url) setAvatar(data.url);
                                                } catch (err) {
                                                    setMessage({ type: "error", text: "Upload failed" });
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">Click to upload new picture</p>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password (Optional)</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Feedback */}
                            {message.text && (
                                <div className={`rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Save Changes
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
