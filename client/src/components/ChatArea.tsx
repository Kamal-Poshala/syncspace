import { useState, useEffect, useRef } from "react";
import { Send, Hash, Lock, Users, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWorkspace } from "../context/WorkspaceContext";
import { apiRequest } from "../lib/api";
import type { Message, DM, User } from "../types";
import { format } from "date-fns";

interface ChatAreaProps {
    channelId?: string;
    dmId?: string;
}

export default function ChatArea({ channelId, dmId }: ChatAreaProps) {
    const { user, token } = useAuth();
    const { socket, currentWorkspace, channels, dms } = useWorkspace();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    // Determine context (Channel vs DM)
    const isChannel = !!channelId;
    const currentChannel = isChannel ? channels.find(c => c._id === channelId) : null;
    const currentDM = !isChannel ? dms.find(d => d._id === dmId) : null;

    // Helpers for DM display
    const getDMOtherUser = (dm: DM): User | undefined => {
        return dm.members.find(m => m._id !== user?._id); // Assuming user populated
    };
    const otherUser = currentDM && getDMOtherUser(currentDM);

    const contextName = isChannel ? currentChannel?.name : otherUser?.username;
    const contextId = isChannel ? channelId : dmId;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Initial fetch
    useEffect(() => {
        const fetchMessages = async () => {
            if (!contextId) return;

            setIsLoading(true);
            try {
                const endpoint = isChannel
                    ? `/channels/${contextId}/messages`
                    : `/dms/${contextId}/messages`;

                const data = await apiRequest<Message[]>(endpoint, {
                    token: token || ""
                });
                setMessages(data);
                scrollToBottom();
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [contextId, isChannel, token]);

    // Socket listeners
    useEffect(() => {
        if (!socket || !contextId) return;

        if (isChannel) {
            socket.emit("channel:join", { channelId: contextId });
        } else {
            socket.emit("dm:join", { dmId: contextId });
        }

        const handleMessage = (message: Message) => {
            if ((isChannel && message.channelId === contextId) || (!isChannel && message.dmId === contextId)) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        };

        const handleTypingStart = ({ username, channelId: cId, dmId: dId }: { username: string, channelId?: string, dmId?: string }) => {
            if (username === user?.username) return;
            if ((isChannel && cId === contextId) || (!isChannel && dId === contextId)) {
                setTypingUsers(prev => [...prev, username]);
            }
        };

        const handleTypingStop = ({ username, channelId: cId, dmId: dId }: { username: string, channelId?: string, dmId?: string }) => {
            if ((isChannel && cId === contextId) || (!isChannel && dId === contextId)) {
                setTypingUsers(prev => prev.filter(u => u !== username));
            }
        };

        // Determine events based on type
        // Use separate listeners or check payload? 
        // Backend emits "message:receive" for channels and "dm:message:receive" for DMs.
        const msgEvent = isChannel ? "message:receive" : "dm:message:receive";
        const typingStartEvent = isChannel ? "channel:typing:start" : "dm:typing:start";
        const typingStopEvent = isChannel ? "channel:typing:stop" : "dm:typing:stop";

        socket.on(msgEvent, handleMessage);
        socket.on(typingStartEvent, handleTypingStart);
        socket.on(typingStopEvent, handleTypingStop);

        return () => {
            socket.off(msgEvent, handleMessage);
            socket.off(typingStartEvent, handleTypingStart);
            socket.off(typingStopEvent, handleTypingStop);
        };
    }, [socket, contextId, isChannel, user]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !socket || !currentWorkspace || !contextId) return;

        if (isChannel) {
            socket.emit("message:send", {
                channelId: contextId,
                content: inputValue,
                workspaceId: currentWorkspace._id
            });
            socket.emit("channel:typing:stop", { channelId: contextId });
        } else {
            socket.emit("dm:message:send", {
                dmId: contextId,
                content: inputValue,
                workspaceId: currentWorkspace._id
            });
            socket.emit("dm:typing:stop", { dmId: contextId });
        }

        setInputValue("");
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (socket && contextId) {
            const event = isChannel ? "channel:typing:start" : "dm:typing:start";
            const payload = isChannel ? { channelId: contextId } : { dmId: contextId };
            const stopEvent = isChannel ? "channel:typing:stop" : "dm:typing:stop";

            socket.emit(event, payload);

            setTimeout(() => {
                socket.emit(stopEvent, payload);
            }, 2000);
        }
    };

    if (!contextId || (isChannel && !currentChannel) || (!isChannel && !currentDM)) {
        return <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>;
    }

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6 shadow-sm">
                <div className="flex items-center gap-2">
                    {isChannel ? (
                        currentChannel?.isPrivate ? <Lock className="h-5 w-5 text-gray-500" /> : <Hash className="h-5 w-5 text-gray-500" />
                    ) : (
                        <div className="relative">
                            <img src={otherUser?.avatar} className="h-6 w-6 rounded-full bg-gray-200" alt="" />
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-green-500"></span>
                        </div>
                    )}
                    <h2 className="text-lg font-bold text-gray-900">{contextName}</h2>
                </div>
                {isChannel && currentChannel?.topic && (
                    <span className="ml-4 text-sm text-gray-500 truncate border-l border-gray-300 pl-4">{currentChannel.topic}</span>
                )}
                {isChannel && (
                    <div className="ml-auto flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {currentChannel?.members.length}
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading messages...</div>
                ) : (
                    messages.map((msg, i) => {
                        const isSameUser = i > 0 && messages[i - 1].sender._id === msg.sender._id;
                        const isNearTime = i > 0 && (new Date(msg.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() < 300000); // 5 mins

                        return (
                            <div key={msg._id} className={`flex group ${isSameUser && isNearTime ? "mt-1" : "mt-4"}`}>
                                {!isSameUser || !isNearTime ? (
                                    <div className="flex-shrink-0 mr-3">
                                        <img
                                            src={msg.sender.avatar || "https://via.placeholder.com/32"}
                                            alt={msg.sender.username}
                                            className="h-9 w-9 rounded-md bg-gray-200 object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-9 mr-3 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 text-right self-center">
                                        {format(new Date(msg.createdAt), "h:mm a")}
                                    </div>
                                )}

                                <div className="flex-1 max-w-3xl">
                                    {(!isSameUser || !isNearTime) && (
                                        <div className="flex items-baseline mb-1">
                                            <span className="font-bold text-gray-900 mr-2 hover:underline cursor-pointer">
                                                {msg.sender.username}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(msg.createdAt), "h:mm a")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
                >
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600">
                        <Plus className="h-5 w-5" />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleTyping}
                        placeholder={`Message ${isChannel ? `#${contextName}` : contextName}`}
                        className="flex-1 bg-transparent px-2 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`rounded-lg p-2 transition-all ${inputValue.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400"}`}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
                {typingUsers.length > 0 && (
                    <div className="mt-1 ml-4 text-xs text-gray-500 italic">
                        {typingUsers.join(", ")} is typing...
                    </div>
                )}
            </div>
        </div>
    );
}
