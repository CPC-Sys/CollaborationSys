import "dotenv/config";
import axios from "axios";

const SS_KEY = process.env.SS_API_KEY;
const SS_SECRET = process.env.SS_API_SECRET;
const authorization =
  "Basic NzFmYjdiM2JjNjRhNGU2MGFiM2IzMDUyNTc0ZDk2ZmE6NzZhOTgyMDE4ODUxNDFlOWEzZjIyZTlhMDY4NTBkNmY=";

export const getOrders = async (ssUrl) => {
  let totalOrders = 0;

  try {
    const options = {
      url: ssUrl,
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    };

    const gotData = await axios.request(options);

    //console.log("SSAPI.ROUTE.js response.data: ", response.data);

    return gotData.data;
  } catch (err) {
    console.error(err);
  }
};

export const getWebhooks = async (ssUrl) => {
  //var axios = require("axios").default;

  let totalOrders = 0;

  try {
    const options = {
      url: ssUrl,
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    };

    const gotData = await axios.request(options);

    //console.log("SSAPI.ROUTE.js response.data: ", response.data);

    return gotData.data;
  } catch (err) {
    console.error(err);
  }
};
