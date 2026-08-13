import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Sparkles } from "lucide-react";

const AICursor = () => {
    const aiRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!aiRef.current) return;

            const x = e.clientX;
            const y = e.clientY;

            aiRef.current.style.transform = `
                translate3d(${x + 18}px, ${y + 18}px, 0)
            `;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleClick = () => {
        navigate("/ai-chat");
    };

    return (
        <div
            ref={aiRef}
            onClick={handleClick}
            className="
                fixed
                top-0
                left-0
                z-[9999]
                pointer-events-auto
                hidden
                md:block
                cursor-pointer
                transition-transform
                duration-150
                ease-out
            "
            title="Open AI Shopping Assistant"
        >
            {/* AI Button */}
            <div
                className="
                    group
                    relative
                    w-12
                    h-12
                    rounded-full
                    bg-gradient-to-br
                    from-blue-500
                    via-purple-500
                    to-fuchsia-500
                    shadow-[0_0_30px_rgba(139,92,246,0.8)]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-200
                    hover:scale-125
                    hover:shadow-[0_0_45px_rgba(139,92,246,1)]
                "
            >
                {/* Outer Glow */}
                <div
                    className="
                        absolute
                        inset-[-5px]
                        rounded-full
                        border
                        border-purple-400/40
                        animate-ping
                    "
                />

                {/* Inner Glow */}
                <div
                    className="
                        absolute
                        inset-0
                        rounded-full
                        bg-white/10
                        blur-sm
                    "
                />

                {/* AI Icon */}
                <Bot
                    size={23}
                    className="
                        relative
                        z-10
                        text-white
                        transition-transform
                        duration-200
                        group-hover:scale-110
                    "
                />

                {/* Sparkle */}
                <Sparkles
                    size={14}
                    className="
                        absolute
                        -top-2
                        -right-2
                        text-purple-300
                        animate-spin
                    "
                />

                {/* AI Label */}
                <div
                    className="
                        absolute
                        left-14
                        top-1/2
                        -translate-y-1/2
                        whitespace-nowrap
                        rounded-lg
                        bg-gray-900
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-white
                        opacity-0
                        translate-x-[-5px]
                        group-hover:opacity-100
                        group-hover:translate-x-0
                        transition-all
                        duration-200
                        shadow-lg
                        pointer-events-none
                    "
                >
                    Open AI Assistant
                </div>
            </div>
        </div>
    );
};

export default AICursor;
