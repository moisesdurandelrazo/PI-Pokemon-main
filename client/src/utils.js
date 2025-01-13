export const baseUrl =
  import.meta.env.VITE_REACT_APP_ENV === "dev"
    ? import.meta.env.VITE_REACT_APP_DEV_ENDPOINT_URL
    : import.meta.env.VITE_REACT_APP_PROD_ENDPOINT_URL;
