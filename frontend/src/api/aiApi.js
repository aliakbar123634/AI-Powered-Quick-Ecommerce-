import axios from "axios";

const AI_API_URL = "http://127.0.0.1:8001";

export const sendMessageToAI = async (message) => {
    const token = localStorage.getItem("access");

    if (!token) {
        throw new Error("Access token not found");
    }

    const response = await axios.post(
        `${AI_API_URL}/chat`,
        {
            message: message,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};
