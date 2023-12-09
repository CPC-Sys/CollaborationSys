import "dotenv/config";
import axios from "axios";

module.exports.getEbay = async () => {
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
