// import axios from "axios";

// const AI_API_URL = "http://127.0.0.1:8001";

// export const sendMessageToAI = async (message) => {
//     const token = localStorage.getItem("access_token");

//     const response = await axios.post(
//         `${AI_API_URL}/chat`,
//         {
//             message: message,
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     return response.data;
// };









// import axios from "axios";

// const AI_API_URL = "http://127.0.0.1:8001";

// export const sendMessageToAI = async (message) => {

//     const token = localStorage.getItem("access_token");

//     console.log("========== AI REQUEST ==========");
//     console.log("Message:", message);
//     console.log("Token exists:", !!token);
//     console.log("Token length:", token ? token.length : 0);
//     console.log("Token:", token);
//     console.log("================================");

//     if (!token) {
//         throw new Error("Access token not found");
//     }

//     const response = await axios.post(
//         `${AI_API_URL}/chat`,
//         {
//             message: message,
//         },
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//         }
//     );

//     return response.data;
// };


import axios from "axios";

const AI_API_URL = "http://127.0.0.1:8001";

export const sendMessageToAI = async (message) => {
    const token = localStorage.getItem("access");

    console.log("========== AI REQUEST ==========");
    console.log("Message:", message);
    console.log("Token exists:", !!token);
    console.log("Token length:", token ? token.length : 0);
    console.log("Token:", token);
    console.log("================================");

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