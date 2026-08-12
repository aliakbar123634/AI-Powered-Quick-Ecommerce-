import React, { useState } from "react";
import { sendMessageToAI } from "../api/aiApi";
import {
    Send,
    User,
    Sparkles,
    ShoppingBag,
    Search,
    Package,
    Brain,
    Zap,
} from "lucide-react";

import einsteinImage from "../assets/einstein-ali.jpg.jpg";

const AIChat = () => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi! I'm Einstein Ali, your AI Shopping Assistant. I can help you find products, check prices, recommend products, check stock, and manage your shopping.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const message = input.trim();

        if (!message || loading) {
            return;
        }

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

    const quickPrompts = [
        {
            icon: Search,
            text: "Find organic honey",
        },
        {
            icon: Sparkles,
            text: "Recommend me some products",
        },
        {
            icon: Package,
            text: "Check my product stock",
        },
        {
            icon: ShoppingBag,
            text: "What's in my cart?",
        },
    ];

    const handleQuickPrompt = (text) => {
        if (loading) {
            return;
        }

        setInput(text);
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-white flex flex-col overflow-hidden">

            {/* HEADER */}
            <header className="h-[72px] shrink-0 border-b border-white/10 bg-[#0b1020]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-10 z-20">
                <div className="flex items-center gap-3">

                    {/* Einstein avatar */}
                    <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-purple-400/50 shadow-[0_0_25px_rgba(139,92,246,0.35)]">
                        <img
                            src={einsteinImage}
                            alt="Einstein Ali"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-base sm:text-lg tracking-tight">
                                Einstein Ali
                            </h1>

                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-purple-300 text-[10px] font-semibold">
                                <Sparkles size={9} />
                                AI AGENT
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Online • Shopping Assistant
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <Brain size={16} className="text-purple-400" />
                    <span>Intelligent Shopping</span>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 overflow-y-auto relative">

                {/* Background glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* HERO */}
                    {messages.length === 1 && (
                        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#11172a] via-[#0d1324] to-[#120d20] overflow-hidden relative shadow-2xl">

                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-6 sm:p-8 lg:p-10">

                                {/* Hero text */}
                                <div className="flex-1 text-center md:text-left">

                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-medium mb-4">
                                        <Zap size={13} className="text-purple-400" />
                                        Your Personal AI Shopping Agent
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                                        Meet{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400">
                                            Einstein Ali
                                        </span>
                                        .
                                    </h2>

                                    <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
                                        Search products, discover intelligent recommendations,
                                        check prices and stock, and manage your shopping —
                                        all through one AI agent.
                                    </p>

                                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                            Product Search
                                        </span>

                                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                            Recommendations
                                        </span>

                                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                            Stock Check
                                        </span>

                                        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                            Cart Management
                                        </span>
                                    </div>
                                </div>

                                {/* Einstein image */}
                                <div className="relative shrink-0 flex flex-col items-center">

                                    <div className="absolute inset-0 bg-purple-500/25 blur-[50px] rounded-full scale-75" />

                                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white/15 shadow-[0_0_50px_rgba(139,92,246,0.35)]">
                                        <img
                                            src={einsteinImage}
                                            alt="Einstein Ali"
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>

                                    <div className="relative -mt-4 px-4 py-2 rounded-full bg-white text-gray-900 text-xs font-bold shadow-xl flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Einstein Ali • AI Agent
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* CHAT MESSAGES */}
                    <div className="space-y-5 pb-6">

                        {messages.map((message, index) => {
                            const isUser = message.role === "user";

                            return (
                                <div
                                    key={index}
                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex items-end gap-3 max-w-[92%] sm:max-w-[78%] ${
                                            isUser ? "flex-row-reverse" : ""
                                        }`}
                                    >

                                        {/* Avatar */}
                                        <div
                                            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden ${
                                                isUser
                                                    ? "bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                                                    : "border border-purple-400/40 shadow-lg shadow-purple-500/20"
                                            }`}
                                        >
                                            {isUser ? (
                                                <User size={19} />
                                            ) : (
                                                <img
                                                    src={einsteinImage}
                                                    alt="Einstein Ali"
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div>
                                            {!isUser && (
                                                <div className="flex items-center gap-2 mb-1.5 ml-1">
                                                    <span className="text-xs font-semibold text-purple-300">
                                                        Einstein Ali
                                                    </span>
                                                    <span className="text-[10px] text-gray-600">
                                                        AI Agent
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap ${
                                                    isUser
                                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg shadow-blue-500/10"
                                                        : "bg-[#111827] border border-white/10 text-gray-200 rounded-bl-md shadow-xl"
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* THINKING */}
                        {loading && (
                            <div className="flex items-end gap-3">

                                <div className="w-10 h-10 rounded-2xl overflow-hidden border border-purple-400/40 shadow-lg shadow-purple-500/20 shrink-0">
                                    <img
                                        src={einsteinImage}
                                        alt="Einstein Ali"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-purple-300 mb-1.5 ml-1">
                                        Einstein Ali
                                    </div>

                                    <div className="bg-[#111827] border border-white/10 rounded-2xl rounded-bl-md px-5 py-4 flex items-center gap-3">

                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                                        </div>

                                        <span className="text-xs text-gray-400">
                                            Einstein is thinking...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* INPUT AREA */}
            <div className="shrink-0 border-t border-white/10 bg-[#090e1a]/95 backdrop-blur-xl px-4 sm:px-6 py-4 z-20">
                <div className="max-w-4xl mx-auto">

                    {/* QUICK PROMPTS */}
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                        {quickPrompts.map((prompt, index) => {
                            const Icon = prompt.icon;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuickPrompt(prompt.text)}
                                    disabled={loading}
                                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-400/30 text-xs text-gray-300 hover:text-white transition disabled:opacity-40"
                                >
                                    <Icon size={14} className="text-purple-400" />
                                    {prompt.text}
                                </button>
                            );
                        })}
                    </div>

                    {/* INPUT */}
                    <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-[#111827] border border-white/10 focus-within:border-purple-500/50 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.12)] transition">

                        {/* Small Einstein */}
                        <div className="hidden sm:block w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-purple-400/30">
                            <img
                                src={einsteinImage}
                                alt="Einstein Ali"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Einstein Ali about products..."
                            rows={1}
                            disabled={loading}
                            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none resize-none px-2 py-2.5 text-sm max-h-32"
                        />

                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg shadow-purple-500/20 transition hover:scale-105"
                        >
                            <Send size={19} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2 text-[10px] sm:text-xs text-gray-600">
                        <Sparkles size={11} />
                        Einstein Ali can search products, recommend items and manage your shopping.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;