import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import Sidebar from "../components/Sidebar";
import RichEditor from "../components/RichEditor";
import ChatArea from "../components/ChatArea";
import { useAuth } from "../context/AuthContext";

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
        channels
    } = useWorkspace();

    const [content, setContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            selectWorkspace(slug);
            // Clear content when switching workspaces to prevent old content from showing
            setContent("");
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

    // Sync content from socket (Only for Canvas/Doc mode, not for Chat)
    useEffect(() => {
        if (!socket) return;
        // Only listen when viewing Canvas (no channelId/dmId) or a specific doc
        if (channelId || dmId) return;

        socket.on("workspace:connected", (data: any) => {
            setContent(data.content || "");
        });

        socket.on("workspace:update", (data: any) => {
            setContent(data.content);
        });

        return () => {
            socket.off("workspace:connected");
            socket.off("workspace:update");
        };
    }, [socket, docId, slug, channelId, dmId]); // Added channelId, dmId to dependencies

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

    const showChat = !!channelId || !!dmId;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white/80 backdrop-blur-3xl transition-colors duration-500">
            <Sidebar />

            <main className="flex flex-1 flex-col relative z-10">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200/40 bg-white/60 px-8 backdrop-blur-xl transition-all">
                    <div className="flex items-center text-gray-800">
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">#{currentWorkspace.slug}</span>
                        {typingUsers.length > 0 && (
                            <span className="ml-4 flex items-center text-xs font-medium text-blue-600 animate-in fade-in slide-in-from-left-4 duration-300">
                                <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"></span>
                                {typingUsers.join(", ")} is typing...
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-3 overflow-hidden p-1">
                            {onlineUsers.slice(0, 5).map((u) => (
                                <div key={u._id} className="relative transition-transform hover:z-10 hover:scale-110">
                                    <img
                                        className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                                        src={u.avatar || "https://via.placeholder.com/32"}
                                        alt={u.username}
                                        title={u.username}
                                    />
                                </div>
                            ))}
                            {onlineUsers.length > 5 && (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-bold text-gray-500">
                                    +{onlineUsers.length - 5}
                                </div>
                            )}
                        </div>
                        <div className="h-8 w-px bg-gray-200/50 mx-2"></div>
                        <span className="text-xs font-semibold text-green-700 px-3 py-1 bg-green-100/50 border border-green-200/50 rounded-full flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {onlineUsers.length} Online
                        </span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden p-0 relative">
                    {showChat ? (
                        <ChatArea channelId={channelId} dmId={dmId} />
                    ) : (
                        <div className="h-full p-6 md:p-8 lg:p-10 overflow-y-auto">
                            <div className="h-full mx-auto max-w-5xl shadow-2xl shadow-blue-900/5 rounded-2xl border border-white/50 bg-white/80 backdrop-blur-sm ring-1 ring-black/5 transition-all duration-500 hover:shadow-blue-900/10">
                                <RichEditor
                                    content={content}
                                    onChange={handleContentChange}
                                    userColor={userColor}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
