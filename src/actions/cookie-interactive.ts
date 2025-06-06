import Cookies from "js-cookie";

export const setCookie = (key: string, value: string, options = {}) => {
  Cookies.set(key, value, { ...options });
};

export const getCookie = (key: string) => {
  return Cookies.get(key);
};

export const removeCookie = (key: string, options = {}) => {
  Cookies.remove(key, { ...options });
};
