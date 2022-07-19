export const baseUrl =
  process.env.REACT_APP_ENV === "dev"
    ? process.env.REACT_APP_DEV_ENDPOINT_URL
    : process.env.REACT_APP_PROD_ENDPOINT_URL;
