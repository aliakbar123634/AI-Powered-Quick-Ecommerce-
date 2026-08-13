import React, { useState } from "react";
import { sendMessageToAI } from "../api/aiApi";
import { Bot, Send, User } from "lucide-react";

const AIChat = () => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm your AI Shopping Assistant. What are you looking for?",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const message = input.trim();

        if (!message || loading) {
            return;
        }

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: message,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const data = await sendMessageToAI(message);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response,
                },
            ]);
        } catch (error) {
            console.error("AI chat error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Bot size={24} />
                </div>

                <div>
                    <h1 className="font-bold text-lg">
                        QuickAI Assistant
                    </h1>

                    <p className="text-xs text-gray-400">
                        AI Shopping Assistant
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-4 overflow-y-auto">

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >

                        <div
                            className={`flex gap-3 max-w-[80%] ${
                                message.role === "user"
                                    ? "flex-row-reverse"
                                    : ""
                            }`}
                        >

                            {/* Icon */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-purple-600 text-white"
                                }`}
                            >
                                {message.role === "user" ? (
                                    <User size={18} />
                                ) : (
                                    <Bot size={18} />
                                )}
                            </div>

                            {/* Message */}
                            <div
                                className={`px-4 py-3 rounded-2xl ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800 shadow"
                                }`}
                            >
                                {message.content}
                            </div>

                        </div>

                    </div>
                ))}

                {loading && (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center">
                            <Bot size={18} />
                        </div>

                        <div className="bg-white shadow px-4 py-3 rounded-2xl text-gray-500">
                            Thinking...
                        </div>
                    </div>
                )}

            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">

                <div className="max-w-4xl mx-auto flex gap-3">

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me about products..."
                        rows={1}
                        className="
                            flex-1
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            resize-none
                        "
                    />

                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            disabled:bg-gray-400
                            text-white
                            px-5
                            rounded-xl
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <Send size={20} />
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AIChat;