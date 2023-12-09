import express from "express";
import { getOrders, getWebhooks } from "../routes/ssapi.route.js";

const router = express.Router();

router.get("/getSsapiOrders", async (req, res) => {
  let ssUrl =
    "https://ssapi.shipstation.com/orders?orderDateStart=2023-11-13&orderDateEnd=2023-11-13&pageSize=500";
  const ssData = await getOrders(ssUrl);

  if (ssData[0].length > 0) {
    const { orderId, orderNumber } = ssData.orders[0];
    const { total } = ssData;
    console.log("how many orders Do I have? ", total);

    console.log(
      "SSAPI.CONTROLER.js is this orderId and orderNumber: ",
      orderId,
      orderNumber
    );
    res.json(ssData);
  } else {
    console.log("No Orders Exists");
    res.json("No Orders Exist");
  }
  //console.log("SSAPI.CONTROLLER.js ssData", ssData);
});

// router.get("/getSSWebhooks", async (req, res) => {
//   let ssUrl = "https://ssapi.shipstation.com/webhooks";
//   const ssData = await getWebhooks(ssUrl);

//   // const { orderId, orderNumber } = ssData.orders[0];
//   // const { total } = ssData;
//   // console.log("how many orders Do I have? ", total);

//   // console.log(
//   //   "SSAPI.CONTROLER.js is this orderId and orderNumber: ",
//   //   orderId,
//   //   orderNumber
//   // );
//   res.json(ssData);
//   //console.log("SSAPI.CONTROLLER.js ssData", ssData);
// });

// const bodyParser = require('body-parser');
// const app = express();
// const port = 3000;

// app.use(bodyParser.json());

router.post("/ssorders", (req, res) => {
  const webhookData = req.body;
  // Handle the incoming webhook data here
  console.log("Received webhook:", webhookData);
  res.sendStatus(200); // Respond with a 200 OK status to acknowledge receipt
});

// app.listen(port, () => {
//   console.log(`Webhook listener is running on port ${port}`);
// });

export default router;
