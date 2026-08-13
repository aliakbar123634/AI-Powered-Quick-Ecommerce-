// import API from "./axios";
import API from "./api";
import axios from "axios";


export const getNotifications = () => {

    return API.get(
        "notification/notification/"
    );

};


export const markNotificationRead = (id) => {

    return API.patch(
        `notification/notification/${id}/mark_read/`
    );

};