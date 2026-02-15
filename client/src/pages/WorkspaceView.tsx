import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import Sidebar from "../components/Sidebar";
import RichEditor from "../components/RichEditor";
import ChatArea from "../components/ChatArea";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, MessageSquare, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

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
    const isEditingDoc = !!docId;
    const isMessaging = !!channelId || !!dmId;

    const currentChannel = isMessaging ? channels.find(c => c._id === channelId) : null;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50/50 transition-colors duration-500">
            <Sidebar />

            <main className="flex flex-1 flex-col relative z-10 overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200/60 bg-white/80 px-4 md:px-6 backdrop-blur-xl transition-all">
                    <div className="flex items-center gap-4 text-gray-800">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                            title="Back to Dashboard"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>

                        <div className="h-6 w-px bg-gray-200 ml-1 mr-2 hidden md:block"></div>

                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="hidden sm:inline text-sm font-medium text-gray-400">Workspaces</span>
                            <span className="hidden sm:inline text-gray-300">/</span>
                            <span className="text-sm font-bold text-gray-900 truncate">{currentWorkspace.name}</span>
                            {isMessaging && (
                                <>
                                    <span className="text-gray-300">/</span>
                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 truncate">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        {currentChannel ? `#${currentChannel.name}` : "Direct Message"}
                                    </span>
                                </>
                            )}
                            {isEditingDoc && (
                                <>
                                    <span className="text-gray-300">/</span>
                                    <span className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 truncate">
                                        <FileText className="h-3.5 w-3.5" />
                                        Canvas
                                    </span>
                                </>
                            )}
                        </div>

                        {typingUsers.length > 0 && (
                            <span className="ml-4 hidden lg:flex items-center text-xs font-medium text-blue-600 animate-in fade-in slide-in-from-left-4 duration-300">
                                <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"></span>
                                {typingUsers[0]} is typing...
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2 overflow-hidden p-1 mr-2 hidden sm:flex">
                            {onlineUsers.slice(0, 3).map((u) => (
                                <img
                                    key={u._id}
                                    className="h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm transition-transform hover:z-10 hover:scale-110"
                                    src={u.avatar || "https://via.placeholder.com/32"}
                                    alt={u.username}
                                    title={u.username}
                                />
                            ))}
                            {onlineUsers.length > 3 && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-[10px] font-bold text-gray-500 shadow-sm">
                                    +{onlineUsers.length - 3}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowChatPanel(!showChatPanel)}
                            className={cn(
                                "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all border",
                                showChatPanel
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
                            )}
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            {showChatPanel ? "Hide Chat" : "Show Chat"}
                        </button>
                    </div>
                </header>

                {/* Content Area - Split Layout */}
                <div className="flex flex-1 overflow-hidden p-0 relative bg-gray-50/30">
                    {/* Main Workspace (Canvas) */}
                    <div className={cn(
                        "flex-1 h-full flex flex-col transition-all duration-300 ease-in-out",
                        showChatPanel && isMessaging ? "hidden lg:flex" : "flex"
                    )}>
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                            <div className="mx-auto max-w-5xl h-full">
                                <RichEditor
                                    content={content}
                                    onChange={handleContentChange}
                                    userColor={userColor}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chat Side Panel */}
                    <div className={cn(
                        "h-full border-l border-gray-200 bg-white transition-all duration-300 ease-in-out z-20 shadow-xl lg:shadow-none",
                        showChatPanel && isMessaging ? "w-full lg:w-[400px]" : "w-0 opacity-0 overflow-hidden border-none"
                    )}>
                        {isMessaging && <ChatArea channelId={channelId} dmId={dmId} />}

                        {!isMessaging && showChatPanel && (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                                <div className="mb-4 rounded-full bg-blue-100/50 p-4">
                                    <MessageSquare className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Workspace Chat</h3>
                                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                                    Select a channel or direct message from the sidebar to chat with your team while you edit.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
