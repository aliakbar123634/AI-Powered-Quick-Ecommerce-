import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function DealsCountdown() {

    // 2 Hours Sale
    const saleEnd = new Date().getTime() + 2 * 60 * 60 * 1000;

    const calculateTimeLeft = () => {

        const difference = saleEnd - new Date().getTime();

        if (difference <= 0) {
            return {
                hours: "00",
                minutes: "00",
                seconds: "00",
            };
        }

        return {
            hours: String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, "0"),
            minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0"),
            seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    return (

        <section className="mt-10">

            <div className="bg-[#1E293B] rounded-3xl p-8 text-white shadow-xl">

                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

                    <div>

                        <div className="flex items-center gap-3 mb-3">

                            <Clock3 className="text-yellow-400" size={30} />

                            <h2 className="text-3xl font-bold">

                                Flash Sale Ends In

                            </h2>

                        </div>

                        <p className="text-gray-300">

                            Hurry up! These exclusive deals will expire soon.

                        </p>

                    </div>

                    <div className="flex gap-4">

                        <TimeBox value={timeLeft.hours} label="Hours" />

                        <TimeBox value={timeLeft.minutes} label="Minutes" />

                        <TimeBox value={timeLeft.seconds} label="Seconds" />

                    </div>

                </div>

            </div>

        </section>

    );
}

function TimeBox({ value, label }) {

    return (

        <div className="bg-white text-gray-900 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shadow-lg">

            <span className="text-3xl font-extrabold">

                {value}

            </span>

            <span className="text-sm text-gray-500">

                {label}

            </span>

        </div>

    );

}