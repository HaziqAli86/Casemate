// app/chatbot/page.js
"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useRef, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

// A simple component for the conversation list item
function ConversationItem({ conversation, onClick, isActive }) {
    // Show a preview of the first user message or a default title
    const firstUserMessage = conversation.messages.find(m => m.role === 'user');
    const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) + '...' : 'New Conversation';

    return (
        <div
            onClick={onClick}
            className={`p-3 my-1 cursor-pointer rounded-md text-sm truncate ${
                isActive ? 'bg-[#444]' : 'hover:bg-[#333]'
            }`}
        >
            {title}
        </div>
    );
}


export default function ChatbotPage() {
    const [user] = useAuthState(auth);
    const router = useRouter();

    // --- STATE MANAGEMENT ---
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const chatBoxRef = useRef(null);

    // --- DATA FETCHING AND INITIALIZATION ---
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return;
            try {
                const { data } = await apiClient.get("/chats");
                setConversations(data.reverse()); // Show newest first
                if (data.length > 0) {
                    selectConversation(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };
        fetchConversations();
    }, [user]);

    // --- UI LOGIC ---
    const selectConversation = (conversation) => {
        setCurrentConversation(conversation);
        setMessages(conversation.messages);
    };
    
    const handleNewChat = async () => {
        try {
            const { data: newConvo } = await apiClient.post("/chats");
            setConversations(prev => [newConvo, ...prev]); // Add new chat to the top
            selectConversation(newConvo);
        } catch (error) {
            console.error("Failed to create new chat:", error);
        }
    };

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/login');
    };

    // --- SCROLL TO BOTTOM ---
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    // --- MESSAGE SENDING LOGIC ---
    const handleSend = async () => {
        if (input.trim() === "" || isSending || !currentConversation) return;

        setIsSending(true);
        const userMessageContent = input;
        
        // Optimistic UI update for user message
        const tempUserMessage = {
            _id: `temp-${Date.now()}`,
            role: 'user',
            content: userMessageContent,
        };
        setMessages(prev => [...prev, tempUserMessage]);
        setInput("");

        try {
            // FIXED: Use _id instead of id
            const { data: botMessageData } = await apiClient.post(
                `/chats/${currentConversation._id}/messages`,
                { message_content: userMessageContent }
            );
            
            // Update the UI with the real messages from the server response
            const updatedConvo = await apiClient.get(`/chats`);
            const current = updatedConvo.data.find(c => c._id === currentConversation._id);
            if(current) {
                setMessages(current.messages);
                setConversations(updatedConvo.data.reverse());
            }

        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => [...prev, { _id: 'error', role: 'assistant', content: 'Sorry, an error occurred.' }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-[#1a1a2e] text-white font-[Poppins]">
                {/* Sidebar */}
                <div className="w-1/5 bg-[#2a2a3b] p-4 flex flex-col">
                    <header className="flex items-center gap-3 pb-4 border-b border-gray-700">
                        <img src="/logo.png" alt="CaseMate Logo" className="h-10" />
                        <h2 className="text-xl font-semibold">CaseMate</h2>
                    </header>
                    <button 
                        onClick={handleNewChat}
                        className="my-4 w-full bg-[#e94560] text-white py-2 rounded-md hover:bg-[#d62848]">
                        + New Chat
                    </button>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <ConversationItem
                                key={convo._id}
                                conversation={convo}
                                onClick={() => selectConversation(convo)}
                                isActive={currentConversation?._id === convo._id}
                            />
                        ))}
                    </div>
                     <button 
                        onClick={handleSignOut}
                        className="mt-4 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-500">
                        Sign Out
                    </button>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4" ref={chatBoxRef}>
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 m-auto">
                                Select a conversation or start a new one.
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={msg._id || `msg-${index}`}
                                className={`max-w-[70%] p-3 rounded-lg leading-relaxed whitespace-pre-wrap ${
                                    msg.role === "user"
                                        ? "bg-[#e94560] self-end"
                                        : "bg-[#444] self-start"
                                }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                         {isSending && (
                            <div className="max-w-[70%] p-3 rounded-lg leading-relaxed bg-[#444] self-start animate-pulse">
                                ...
                            </div>
                        )}
                    </div>

                    {/* Input Box */}
                    <div className="flex items-center p-4 bg-[#1a1a2e] border-t border-gray-700">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 p-3 rounded-md bg-[#333] text-white focus:outline-none disabled:opacity-50"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={!currentConversation || isSending}
                        />
                        <button
                            onClick={handleSend}
                            className="ml-3 px-4 py-3 rounded-md bg-[#e94560] hover:bg-[#d62848] text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!currentConversation || isSending}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}