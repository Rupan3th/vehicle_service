import { postJSONReq, postImage, getReq } from './request';

export const login = (body) => postJSONReq('login', body, true);
export const uploadImage = (filePath) => postImage('uploadImage', filePath);

export const smsReq = (body) => postJSONReq('smsReq', body, true);
export const wxRegister = (body) => postJSONReq('wxRegister', body, true);
export const wxRefresh = (body) => postJSONReq('user/wxRefresh', body, true);
export const bind = (body) => postJSONReq('user/bankCard/bind', body, true);
export const createOrder = (body) => postJSONReq('order/create', body, true);

export const profile = (params) => getReq('user/profile', params, true);
export const announcement = (params) => getReq('announcement', params, false);
export const bankCardget = (params) => getReq('user/bankCard/get', params, true);
export const orderlist = (params) => getReq('order/list', params, false);
export const orderdetail = (params) => getReq('order/detail', params, false);
export const getGarages = (params) => getReq('garage/list', params, true);
export const getBrandList = (params) => getReq('brand/list', params, false);
export const getCitylist = (params) => getReq('city/list', params, false);
export const getInsuranceList = (params) => getReq('insurance/list', params, false);
export const garageShared = (body) => getReq('garage/shared', body, false);




