import API from "./api";


export const getCategories = async (page = 1) => {
    const response = await API.get(`/products/categories/?page=${page}`);
    return response.data;
}




export const getCategoryById = async (id) => {
  const response = await API.get(`/products/categories/${id}/`);
  return response.data;
};

export const getProducts = (  page = 1,search = "",ordering = "" ,  category = "", stockStatus = "" ,   minPrice = "", maxPrice = "" , rating = "" , discount = "") =>
    API.get(
    `/products/products/?page=${page}&search=${search}&ordering=${ordering}&category=${category}&stock_status=${stockStatus}&price__gte=${minPrice}&price__lte=${maxPrice}&rating_gte=${rating}&discount_gte=${discount}`
  );

export const getProductById = (id) =>
  API.get(`products/products/${id}/`);