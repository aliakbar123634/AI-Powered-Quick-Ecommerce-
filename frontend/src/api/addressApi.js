import API from "./api";
import axios from "axios";


// Get all user addresses

export const getAddresses = () => {
    return API.get( "accounts/addresses/" );

};

export const createAddress = (data) => {
    return API.post("accounts/addresses/",data);
};


// Get single address
export const getAddressById = (id) => {
    return API.get( `accounts/addresses/${id}/`);
};

// Update full address
export const updateAddress = ( id,data) => {
    return API.put( `accounts/addresses/${id}/`, data );
};

// Partial update address
export const patchAddress = ( id,data) => {
    return API.patch( `accounts/addresses/${id}/`, data );
};

// Delete address
export const deleteAddress = (id) => {
    return API.delete( `accounts/addresses/${id}/`);
};


// Set default address
export const setDefaultAddress = (id) => {
  return API.patch(`accounts/addresses/${id}/set-default/`);
};


// Check delivery availability
export const checkDelivery = (data) => {
    return API.post( "accounts/delivery/check/", data);
};