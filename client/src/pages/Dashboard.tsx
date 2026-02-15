import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Plus, Users, Box, Layout } from "lucide-react";
import ProfileSettings from "../components/ProfileSettings";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    const { workspaces, createWorkspace, isLoading, selectWorkspace } = useWorkspace();
    const { user } = useAuth();
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const navigate = useNavigate();

    // Reset current workspace when on dashboard
    useEffect(() => {
        selectWorkspace(null);
    }, []);

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        setIsCreating(true);
        try {
            // Simple slug generation
            const slug = newWorkspaceName.toLowerCase().replace(/[^a-z0-9]/g, "-") + Math.floor(Math.random() * 1000);
            const ws = await createWorkspace(newWorkspaceName, slug);
            navigate(`/workspace/${ws.slug}`);
        } catch (err) {
            console.error(err);
            alert("Failed to create workspace.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinByCode = (e: React.FormEvent) => {
        e.preventDefault();
        let code = joinCode.trim();
        // Handle full URL paste
        if (code.includes("/join/")) {
            code = code.split("/join/")[1];
        }

        if (code) {
            navigate(`/join/${code}`);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-900"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            <Sidebar />

            <main className="flex-1 overflow-y-auto w-full relative">
                {/* Hero Header */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-900">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                        alt="Dashboard Cover"
                        className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold text-white drop-shadow-md">
                                Welcome back, {user?.username}
                            </h1>
                            <p className="mt-2 text-gray-300">Ready to build something amazing today?</p>
                        </motion.div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Join / Create Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10 grid gap-6 md:grid-cols-2"
                    >
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Create a Workspace</h2>
                            <form onSubmit={handleCreateWorkspace} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Workspace Name"
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black font-medium placeholder-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ caretColor: '#000000' }}
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                />
                                <button type="submit" disabled={isCreating} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
                                    {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                                </button>
                            </form>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Join a Workspace</h2>
                            <form onSubmit={handleJoinByCode} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Invite Code or Link"
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black font-medium placeholder-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    style={{ caretColor: '#000000' }}
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                />
                                <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800">
                                    Join
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
                        <Layout className="h-6 w-6 text-blue-600" />
                        Your Workspaces
                    </h2>

                    {workspaces.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-500">
                            <Box className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p>No workspaces yet. Create or join one to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {workspaces.map((ws, i) => (
                                <motion.div
                                    key={ws._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <Link
                                        to={`/workspace/${ws.slug}`}
                                        className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
                                    >
                                        <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 translate-y--8 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl transition-all group-hover:scale-150"></div>

                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold">
                                                {ws.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:text-blue-500 group-hover:translate-x-1" />
                                        </div>

                                        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                            {ws.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-mono mb-4">#{ws.slug}</p>

                                        <div className="flex items-center text-sm text-gray-500">
                                            <Users className="mr-2 h-4 w-4" />
                                            {ws.members?.length || 1} members
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <ProfileSettings isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}
