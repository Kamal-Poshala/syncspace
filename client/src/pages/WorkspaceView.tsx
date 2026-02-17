import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import Sidebar from "../components/Sidebar";
import RichEditor from "../components/RichEditor";
import ChatArea from "../components/ChatArea";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

// Helper to generate consistent color from string
const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use HSL for nice pastel colors: Hue 0-360, Saturation 70%, Lightness 80%
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 80%)`;
};

export default function WorkspaceView() {
    const { slug, channelId, docId, dmId } = useParams<{ slug: string; channelId?: string; docId?: string; dmId?: string }>();
    const { user } = useAuth();
    const {
        selectWorkspace,
        currentWorkspace,
        isLoading,
        socket,
        onlineUsers,
        typingUsers,
        channels,
        content,
        setContent
    } = useWorkspace();

    const [isTyping, setIsTyping] = useState(false);
    const [showChatPanel, setShowChatPanel] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            selectWorkspace(slug);
        }
    }, [slug]);

    // Redirect to general channel if at root workspace and channels loaded
    useEffect(() => {
        if (slug && !channelId && !docId && !dmId && channels.length > 0) {
            // Find general or first
            const general = channels.find(c => c.name === "general");
            if (general) {
                navigate(`/workspace/${slug}/channel/${general._id}`, { replace: true });
            } else if (channels[0]) {
                navigate(`/workspace/${slug}/channel/${channels[0]._id}`, { replace: true });
            }
        }
    }, [slug, channelId, docId, dmId, channels, navigate]);


    const handleContentChange = (val: string) => {
        setContent(val);
        socket?.emit("workspace:update", { slug, content: val });

        if (!isTyping) {
            setIsTyping(true);
            socket?.emit("typing:start", { slug });
            setTimeout(() => {
                setIsTyping(false);
                socket?.emit("typing:stop", { slug });
            }, 1000);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-pulse text-blue-500 font-medium">Loading Workspace...</div></div>;
    if (!currentWorkspace) return <div className="p-10 text-center text-gray-500">Workspace not found</div>;

    const userColor = user ? stringToColor(user._id || user.username) : "#fef08a";

    // Navigation logic
    const isMessaging = !!channelId || !!dmId;

    const currentChannel = isMessaging ? channels.find(c => c._id === channelId) : null;

    return (
        <div className="flex h-screen w-full overflow-hidden mesh-background selection:bg-primary/30">
            <Sidebar />

            <main className="flex flex-1 flex-col relative z-10 overflow-hidden">
                {/* Topbar - Ultra Glass */}
                <header className="flex h-20 items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 md:px-10 backdrop-blur-2xl transition-all">
                    <div className="flex items-center gap-6">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 rounded-2xl bg-white/5 p-2 text-gray-400 hover:text-white hover:bg-primary/20 transition-all border border-white/5"
                            title="Back to Dashboard"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Link>

                        <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-white/40">Workspace</span>
                            <span className="text-lg font-black text-white truncate tracking-tight">{currentWorkspace.name}</span>
                            {isMessaging && (
                                <>
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mx-1"></div>
                                    <span className="flex items-center gap-2 text-sm font-bold text-primary truncate bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        {currentChannel ? currentChannel.name : "Direct Message"}
                                    </span>
                                </>
                            )}
                        </div>

                        {typingUsers.length > 0 && (
                            <span className="ml-6 hidden lg:flex items-center text-[10px] font-black uppercase tracking-tighter text-primary animate-pulse">
                                {typingUsers[0]} IS SYNCHRONIZING...
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex -space-x-3 overflow-hidden p-1 hidden sm:flex">
                            {onlineUsers.slice(0, 4).map((u) => (
                                <img
                                    key={u._id}
                                    className="h-9 w-9 rounded-xl ring-2 ring-background object-cover shadow-2xl transition-all hover:z-10 hover:-translate-y-1"
                                    src={u.avatar || "https://via.placeholder.com/32"}
                                    alt={u.username}
                                    title={u.username}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setShowChatPanel(!showChatPanel)}
                            className={cn(
                                "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all border",
                                showChatPanel
                                    ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                    : "bg-white/5 text-gray-300 border-white/10 hover:border-primary/40 hover:text-white"
                            )}
                        >
                            <MessageSquare className="h-4 w-4" />
                            {showChatPanel ? "Collapse" : "Expand Chat"}
                        </button>
                    </div>
                </header>

                {/* Content Area - Floating Glass Layers */}
                <div className="flex flex-1 overflow-hidden p-6 gap-6 relative">
                    {/* Main Workspace (Canvas) */}
                    <div className={cn(
                        "flex-1 h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                        showChatPanel && isMessaging ? "hidden lg:flex" : "flex"
                    )}>
                        <div className="flex-1 glass-card rounded-[2rem] overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
                                <div className="mx-auto max-w-4xl h-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <RichEditor
                                            content={content}
                                            onChange={handleContentChange}
                                            userColor={userColor}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Side Panel */}
                    <div className={cn(
                        "h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-20",
                        showChatPanel && isMessaging
                            ? "w-full lg:w-[450px] opacity-100 translate-x-0"
                            : "w-0 opacity-0 translate-x-20 pointer-events-none"
                    )}>
                        <div className="h-full glass-card rounded-[2rem] overflow-hidden shadow-2xl">
                            {isMessaging && <ChatArea channelId={channelId} dmId={dmId} />}

                            {!isMessaging && showChatPanel && (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                    <div className="mb-8 rounded-3xl bg-primary/10 p-6 ring-1 ring-primary/20">
                                        <MessageSquare className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Neural Channel</h3>
                                    <p className="mt-4 text-gray-500 font-medium leading-relaxed">
                                        Activate a stream from the nexus to begin real-time communication.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
