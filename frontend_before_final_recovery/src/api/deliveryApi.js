
// import API from "./axios";
import API from "./api";
import axios from "axios";

export const getDeliveryTracking = (orderId) => {
  return API.get(`/delivery/tracking/?order=${orderId}`);
};