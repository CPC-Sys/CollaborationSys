import express from "express";
//import dbPool from "../db.js";
//import fs from "fs/promises";
import axios from "axios";
import { parseString } from "xml2js";
import util from "util";
import { stripPrefix } from "xml2js/lib/processors.js";

//const parser = new xml2js.Parser();

const router = express.Router();

//&&&&&&&&&&&MBARRCOIN STORE BEGINS &&&&&&&&&&&&&&&&&&&&&

router.post("/mbarrcoinsGetSellersList", async (req, res) => {
  var options = {
    method: "POST",
    url: "https://api.ebay.com/ws/api.dll",
    headers: {
      "X-EBAY-API-SITEID": "0",
      "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
      "X-EBAY-API-CALL-NAME": "GetSellerList",
      Authorization:
        "Bearer v^1.1#i^1#f^0#I^3#p^3#r^1#t^Ul4xMF84OkIxNTkwQTQzNzE0MTMxRjUwOThENURBNEJDMTdGOTk0XzNfMSNFXjI2MA==",
      "Content-Type": "application/xml",
    },
    data: '<?xml version="1.0" encoding="utf-8"?>\n<GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">\n  <RequesterCredentials>\n    <eBayAuthToken>v^1.1#i^1#f^0#I^3#p^3#r^1#t^Ul4xMF84OkIxNTkwQTQzNzE0MTMxRjUwOThENURBNEJDMTdGOTk0XzNfMSNFXjI2MA==</eBayAuthToken>\n  </RequesterCredentials>\n	<ErrorLanguage>en_US</ErrorLanguage>\n	<WarningLevel>High</WarningLevel>\n     <!--You can use DetailLevel or GranularityLevel in a request, but not both-->\n  <GranularityLevel>Coarse</GranularityLevel> \n     <!-- Enter a valid Time range to get the Items listed using this format\n          2013-03-21T06:38:48.420Z -->\n  <StartTimeFrom>2023-11-13T06:38:48.420Z</StartTimeFrom> \n  <StartTimeTo>2023-11-20T20:38:48.420Z</StartTimeTo> \n  <IncludeWatchCount>true</IncludeWatchCount>\n    <Pagination> \n    <EntriesPerPage>200</EntriesPerPage>\n    <PageNumber>1</PageNumber>\n  </Pagination> \n</GetSellerListRequest>',
  };

  axios
    .request(options)
    .then(function (response) {
      //console.log(response.data);

      // parser.parseString(response.data, (err, result) => {
      //   if (err) {
      //     throw err;
      //   }
      //   const dataJson = JSON.stringify(result, null, 2);

      //   // Use the function with your JSON data

      //   const filteredResults = filterJsonData(dataJson);
      //   //console.log(result);
      //   res.send(filteredResults);
      // });

      try {
        parseString(response.data, (err, resultXml) => {
          if (err) {
            console.error("Error:", err);
          } else {
            // Accessing the items in ItemArray
            const itemArray = resultXml.GetSellerListResponse.ItemArray[0].Item;
            // const itemIDs = itemArray.map(
            //   (item) => item.ListingDetails[0].StartTime
            // );

            const listedItems =
              resultXml.GetSellerListResponse.PaginationResult[0]
                .TotalNumberOfEntries;
            console.log("Total Listed Items: ", listedItems);
            for (let i = 0; i < 200; i++) {
              const startTime = itemArray[i].ListingDetails[0].StartTime;
              //resultXml.GetSellerListResponse.ItemArray[0].Item[0]

              console.log(
                "startTime ",
                i,
                ": ",
                util.inspect(startTime, false, null)
              ); // This will display an array of ItemIDs
            }
            // const startTime2 =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[1]
            //     .ListingDetails[0].StartTime;
            // console.log("startTime 2: ", startTime2);

            // const title =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[0].Title;
            // console.log("Title: ", title);
            // const title2 =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[1].Title;
            // console.log("Title2: ", title2);

            //the following code extracts ItemArray
            // console.log(
            //   "resultXml.GetSellerListResponse.ItemArray: ",
            //   util.inspect(
            //     resultXml.GetSellerListResponse.ItemArray.Item,
            //     false,
            //     null
            //   )
            // );

            // if (jsonData.ItemArray && Array.isArray(jsonData.ItemArray)) {
            //   // Create an array of arrays from ItemArray
            //   res.send(jsonData.ItemArray.map((item) => Object.values(item)));
            //   console.log(
            //     "jsonData: ",
            //     jsonData.ItemArray.map((item) => Object.values(item))
            //   );
            //   res.send(jsonData);
            // } else {
            //   throw new Error("ItemArray not found or is not an array");
            // }
          }
        });

        // const itemArray = itemArrayRes.GetSellerListResponse.ItemArray[0].Item;
      } catch (err) {
        console.error("Error parsing XML:", err);
      }

      //const ebayXml2Json = convertXmlToJson(response.data);
      //res.send(ebayXml2Json);
    })
    .catch(function (error) {
      console.error(error);
    });
});

//&&&&&&&&&&& MBARRCOIN STORE ENDS &&&&&&&&&&&&&&&&&&&&&

//????????? MBARRJEWELRY STORE BEGINS ?????????????????

router.post("/mbarrjewelryGetSellersList", async (req, res) => {
  var options = {
    method: "POST",
    url: "https://api.ebay.com/ws/api.dll",
    headers: {
      "X-EBAY-API-SITEID": "0",
      "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
      "X-EBAY-API-CALL-NAME": "GetSellerList",
      Authorization:
        "Bearer v^1.1#i^1#p^3#r^1#I^3#f^0#t^Ul4xMF8xMDo1QjRDNzFBMERGNDUxQ0M4MThGQkZENjA2MEIxMjk0MF8zXzEjRV4yNjA=",
      "Content-Type": "application/xml",
    },
    data: '<?xml version="1.0" encoding="utf-8"?>\n<GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">\n  <RequesterCredentials>\n    <eBayAuthToken>v^1.1#i^1#p^3#r^1#I^3#f^0#t^Ul4xMF8xMDo1QjRDNzFBMERGNDUxQ0M4MThGQkZENjA2MEIxMjk0MF8zXzEjRV4yNjA=</eBayAuthToken>\n  </RequesterCredentials>\n	<ErrorLanguage>en_US</ErrorLanguage>\n	<WarningLevel>High</WarningLevel>\n     <GranularityLevel>Coarse</GranularityLevel> \n     <StartTimeFrom>2023-11-20T00:00:00.420Z</StartTimeFrom> \n  <StartTimeTo>2023-11-20T23:59:59.420Z</StartTimeTo> \n  <IncludeWatchCount>true</IncludeWatchCount>\n    <Pagination> \n    <EntriesPerPage>200</EntriesPerPage>\n    <PageNumber>1</PageNumber>\n  </Pagination> \n</GetSellerListRequest>',
  };

  axios
    .request(options)
    .then(function (response) {
      //console.log(response.data);

      // parser.parseString(response.data, (err, result) => {
      //   if (err) {
      //     throw err;
      //   }
      //   const dataJson = JSON.stringify(result, null, 2);

      //   // Use the function with your JSON data

      //   const filteredResults = filterJsonData(dataJson);
      //   //console.log(result);
      //   res.send(filteredResults);
      // });

      try {
        parseString(response.data, (err, resultXml) => {
          if (err) {
            console.error("Error:", err);
          } else {
            const items = resultXml.GetSellerListResponse.ItemArray[0].Item;
            //console.log(util.inspect(items, false, null));
            const really = flattenItems(items);
            res.send(really);
            // Accessing the items in ItemArray
            // goodone now const itemArray = resultXml.GetSellerListResponse.ItemArray[0].Item;
            // const itemIDs = itemArray.map(
            //   (item) => item.ListingDetails[0].StartTime
            // );

            //good one now

            // const listedItems =
            //   resultXml.GetSellerListResponse.PaginationResult[0]
            //     .TotalNumberOfEntries;
            // console.log("Total Listed Items: ", listedItems);
            // let startTime;
            // for (let i = 0; i < 200; i++) {
            //   startTime = startTime + itemArray[i].ListingDetails[0].StartTime;
            // }
            // const data = {
            //   Entries: listedItems,
            //   "Start Time": startTime,
            // };
            // res.send(data);
            //end good one now

            //resultXml.GetSellerListResponse.ItemArray[0].Item[0]
            // console.log(
            //   "startTime ",
            //   i,
            //   ": ",
            //   util.inspect(startTime, false, null)
            // );

            // const startTime2 =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[1]
            //     .ListingDetails[0].StartTime;
            // console.log("startTime 2: ", startTime2);

            // const title =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[0].Title;
            // console.log("Title: ", title);
            // const title2 =
            //   resultXml.GetSellerListResponse.ItemArray[0].Item[1].Title;
            // console.log("Title2: ", title2);

            //the following code extracts ItemArray
            // console.log(
            //   "resultXml.GetSellerListResponse.ItemArray: ",
            //   util.inspect(
            //     resultXml.GetSellerListResponse.ItemArray.Item,
            //     false,
            //     null
            //   )
            // );

            // if (jsonData.ItemArray && Array.isArray(jsonData.ItemArray)) {
            //   // Create an array of arrays from ItemArray
            //   res.send(jsonData.ItemArray.map((item) => Object.values(item)));
            //   console.log(
            //     "jsonData: ",
            //     jsonData.ItemArray.map((item) => Object.values(item))
            //   );
            //   res.send(jsonData);
            // } else {
            //   throw new Error("ItemArray not found or is not an array");
            // }
          }
        });

        // const itemArray = itemArrayRes.GetSellerListResponse.ItemArray[0].Item;
      } catch (err) {
        console.error("Error parsing XML:", err);
      }

      //const ebayXml2Json = convertXmlToJson(response.data);
      //res.send(ebayXml2Json);
    })
    .catch(function (error) {
      console.error(error);
    });
});

//????????? MBARRJEWELRY STORE ENDS ?????????????????

//@@@@@@@@@ UTILITY FUNCTIONS BEGIN @@@@@@@@@@@@@@@@@

function flattenItems(items) {
  return items.map((item) => selectivelyFlattenItem(item));
}

function selectivelyFlattenItem(item) {
  return {
    ItemID: item.ItemID,
    ViewItemURL: item.ListingDetails[0].ViewItemURL,
    ItemRevised: item.ReviseStatus[0].ItemRevised,
    BidCount: item.SellingStatus[0].BidCount,
    CurrentPrice: item.SellingStatus[0].CurrentPrice[0]._,
    MinimumToBid: item.SellingStatus[0].MinimumToBid[0]._,
    ListingStatus: item.SellingStatus[0].ListingStatus,
    OriginalPrice: item.SellingStatus[0].PromotionalSaleDetails
      ? item.SellingStatus[0].PromotionalSaleDetails[0].OriginalPrice[0]._
      : null,
    Title: item.Title,
    WatchCount: item.WatchCount,
    BestOfferCount: item.BestOfferDetails[0].BestOfferCount,
    NewBestOffer: item.BestOfferDetails[0].NewBestOffer,
    SKU: item.SKU,
    PictureURL: item.PictureDetails[0].PictureURL,
    StartTime: item.ListingDetails[0].StartTime,
    EndTime: item.ListingDetails[0].EndTime,
  };
}

const convertXmlToJson = async (xml) => {
  try {
    const result = await parseStringPromise(xml);
    return result;
  } catch (err) {
    console.error("Error parsing XML:", err);
  }
};

function filterJsonData(jsonData) {
  const filteredData = [];

  for (let key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const item = jsonData[key];
      // Extract data from 'item'

      const itemData = [];

      // Extract each field if it exists
      if (item.Timestamp) itemData.push(item.Timestamp);
      if (item.TotalNumberOfPages) itemData.push(item.TotalNumberOfPages);
      if (item.TotalNumberOfEntries) itemData.push(item.TotalNumberOfEntries);
      if (item.ItemID) itemData.push(item.ItemID);
      if (item.ListingDetails) {
        if (item.ListingDetails.StartTime)
          itemData.push(item.ListingDetails.StartTime);
        if (item.ListingDetails.EndTime)
          itemData.push(item.ListingDetails.EndTime);
        if (item.ListingDetails.ViewItemURL)
          itemData.push(item.ListingDetails.ViewItemURL);
        if (item.ListingDetails.HasUnansweredQuestions === "true")
          itemData.push(item.ListingDetails.HasUnansweredQuestions);
      }
      if (item.PrimaryCategory) {
        if (item.PrimaryCategory.CategoryID)
          itemData.push(item.PrimaryCategory.CategoryID);
        if (item.PrimaryCategory.CategoryName)
          itemData.push(item.PrimaryCategory.CategoryName);
      }
      if (item.ReviseStatus && item.ReviseStatus.ItemRevised === "true")
        itemData.push(item.ReviseStatus.ItemRevised);
      if (item.SellingStatus && item.SellingStatus.BidCount)
        itemData.push(item.SellingStatus.BidCount);
      if (item.SellingStatus && item.SellingStatus.QuantitySold)
        itemData.push(item.SellingStatus.QuantitySold);
      if (item.SellingStatus && item.SellingStatus.ListingStatus)
        itemData.push(item.SellingStatus.ListingStatus);
      if (item.Storefront) {
        if (item.Storefront.StoreCategoryID)
          itemData.push(item.Storefront.StoreCategoryID);
        if (item.Storefront.StoreURL) itemData.push(item.Storefront.StoreURL);
      }
      if (item.TimeLeft) itemData.push(item.TimeLeft);
      if (item.WatchCount) itemData.push(item.WatchCount);
      if (item.SKU) itemData.push(item.SKU);
      if (item.PictureDetails && item.PictureDetails.PictureURL)
        itemData.push(item.PictureDetails.PictureURL);

      filteredData.push(itemData);
    }
  }

  return filteredData;
}

function filterJsonDatabad2(jsonData) {
  const filteredData = [];
  let dataArray;

  // Check if jsonData is an array or an object with an array property
  if (Array.isArray(jsonData)) {
    dataArray = jsonData;
  } else if (
    jsonData.someArrayProperty &&
    Array.isArray(jsonData.someArrayProperty)
  ) {
    // Replace 'someArrayProperty' with the actual property name
    dataArray = jsonData.someArrayProperty;
  } else {
    console.error("Invalid JSON data format");
    return;
  }

  dataArray.forEach((item) => {
    const itemData = [];

    // Extract each field if it exists
    if (item.Timestamp) itemData.push(item.Timestamp);
    if (item.TotalNumberOfPages) itemData.push(item.TotalNumberOfPages);
    if (item.TotalNumberOfEntries) itemData.push(item.TotalNumberOfEntries);
    if (item.ItemID) itemData.push(item.ItemID);
    if (item.ListingDetails) {
      if (item.ListingDetails.StartTime)
        itemData.push(item.ListingDetails.StartTime);
      if (item.ListingDetails.EndTime)
        itemData.push(item.ListingDetails.EndTime);
      if (item.ListingDetails.ViewItemURL)
        itemData.push(item.ListingDetails.ViewItemURL);
      if (item.ListingDetails.HasUnansweredQuestions === "true")
        itemData.push(item.ListingDetails.HasUnansweredQuestions);
    }
    if (item.PrimaryCategory) {
      if (item.PrimaryCategory.CategoryID)
        itemData.push(item.PrimaryCategory.CategoryID);
      if (item.PrimaryCategory.CategoryName)
        itemData.push(item.PrimaryCategory.CategoryName);
    }
    if (item.ReviseStatus && item.ReviseStatus.ItemRevised === "true")
      itemData.push(item.ReviseStatus.ItemRevised);
    if (item.SellingStatus && item.SellingStatus.BidCount)
      itemData.push(item.SellingStatus.BidCount);
    if (item.SellingStatus && item.SellingStatus.QuantitySold)
      itemData.push(item.SellingStatus.QuantitySold);
    if (item.SellingStatus && item.SellingStatus.ListingStatus)
      itemData.push(item.SellingStatus.ListingStatus);
    if (item.Storefront) {
      if (item.Storefront.StoreCategoryID)
        itemData.push(item.Storefront.StoreCategoryID);
      if (item.Storefront.StoreURL) itemData.push(item.Storefront.StoreURL);
    }
    if (item.TimeLeft) itemData.push(item.TimeLeft);
    if (item.WatchCount) itemData.push(item.WatchCount);
    if (item.SKU) itemData.push(item.SKU);
    if (item.PictureDetails && item.PictureDetails.PictureURL)
      itemData.push(item.PictureDetails.PictureURL);

    filteredData.push(itemData);
  });

  return filteredData;
}

function filterJsonDatabad(jsonData) {
  const filteredData = [];
  // console.log("filteredJsonData -> jsonData: ", jsonData);
  // return;
  jsonData.forEach((item) => {
    const itemData = [];

    // Extract each field if it exists
    if (item.Timestamp) itemData.push(item.Timestamp);
    if (item.TotalNumberOfPages) itemData.push(item.TotalNumberOfPages);
    if (item.TotalNumberOfEntries) itemData.push(item.TotalNumberOfEntries);
    if (item.ItemID) itemData.push(item.ItemID);
    if (item.ListingDetails) {
      if (item.ListingDetails.StartTime)
        itemData.push(item.ListingDetails.StartTime);
      if (item.ListingDetails.EndTime)
        itemData.push(item.ListingDetails.EndTime);
      if (item.ListingDetails.ViewItemURL)
        itemData.push(item.ListingDetails.ViewItemURL);
      if (item.ListingDetails.HasUnansweredQuestions === "true")
        itemData.push(item.ListingDetails.HasUnansweredQuestions);
    }
    if (item.PrimaryCategory) {
      if (item.PrimaryCategory.CategoryID)
        itemData.push(item.PrimaryCategory.CategoryID);
      if (item.PrimaryCategory.CategoryName)
        itemData.push(item.PrimaryCategory.CategoryName);
    }
    if (item.ReviseStatus && item.ReviseStatus.ItemRevised === "true")
      itemData.push(item.ReviseStatus.ItemRevised);
    if (item.SellingStatus && item.SellingStatus.BidCount)
      itemData.push(item.SellingStatus.BidCount);
    if (item.SellingStatus && item.SellingStatus.QuantitySold)
      itemData.push(item.SellingStatus.QuantitySold);
    if (item.SellingStatus && item.SellingStatus.ListingStatus)
      itemData.push(item.SellingStatus.ListingStatus);
    if (item.Storefront) {
      if (item.Storefront.StoreCategoryID)
        itemData.push(item.Storefront.StoreCategoryID);
      if (item.Storefront.StoreURL) itemData.push(item.Storefront.StoreURL);
    }
    if (item.TimeLeft) itemData.push(item.TimeLeft);
    if (item.WatchCount) itemData.push(item.WatchCount);
    if (item.SKU) itemData.push(item.SKU);
    if (item.PictureDetails && item.PictureDetails.PictureURL)
      itemData.push(item.PictureDetails.PictureURL);

    filteredData.push(itemData);
  });

  return filteredData;
}

//@@@@@@@@@ UTILITY FUNCTIONS END @@@@@@@@@@@@@@@@@

// $$$$$$$$$$$$$$$ GOOD CODE ON HOLD WHILE I TEST BETTER CODE BEGINS $$$$$$$$$$$$$$

router.post("/getSellersList-hold", async (req, res) => {
  //var axios = require("axios").default;

  var options = {
    method: "POST",
    url: "https://api.ebay.com/ws/api.dll",
    headers: {
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Accept: '"/*"',
      "X-EBAY-API-SITEID": "0",
      "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
      "X-EBAY-API-CALL-NAME": "GetSellerList",
      Authorization:
        "Bearer v^1.1#i^1#f^0#I^3#p^3#r^1#t^Ul4xMF84OkIxNTkwQTQzNzE0MTMxRjUwOThENURBNEJDMTdGOTk0XzNfMSNFXjI2MA==",
      "Content-Type": "application/xml",
    },
    data: '<?xml version="1.0" encoding="utf-8"?>\n<GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">\n  <RequesterCredentials>\n    <eBayAuthToken>v^1.1#i^1#f^0#I^3#p^3#r^1#t^Ul4xMF84OkIxNTkwQTQzNzE0MTMxRjUwOThENURBNEJDMTdGOTk0XzNfMSNFXjI2MA==</eBayAuthToken>\n  </RequesterCredentials>\n	<ErrorLanguage>en_US</ErrorLanguage>\n	<WarningLevel>High</WarningLevel>\n     <!--You can use DetailLevel or GranularityLevel in a request, but not both-->\n  <GranularityLevel>Coarse</GranularityLevel> \n     <!-- Enter a valid Time range to get the Items listed using this format\n          2013-03-21T06:38:48.420Z -->\n  <StartTimeFrom>2023-11-13T06:38:48.420Z</StartTimeFrom> \n  <StartTimeTo>2023-11-20T20:38:48.420Z</StartTimeTo> \n  <IncludeWatchCount>true</IncludeWatchCount>\n    <Pagination> \n    <EntriesPerPage>200</EntriesPerPage>\n    <PageNumber>1</PageNumber>\n  </Pagination> \n</GetSellerListRequest>',
  };

  axios
    .request(options)
    .then(function (response) {
      //console.log(response.data);
      parser.parseString(response.data, (err, result) => {
        if (err) {
          throw err;
        }
        const dataJson = JSON.stringify(result, null, 2);
        // const data = JSON.parse(yourJsonString); // Replace with your JSON data

        res.send(dataJson);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
});

// $$$$$$$$$$$$$$$ GOOD CODE ON HOLD WHILE I TEST BETTER CODE ENDS $$$$$$$$$$$$$$

// //addProject Begins
// router.get("/ebaySuccess", async (req, res) => {
//   const ebayApi = require("ebay-api");

//   const ebay = ebayApi.fromEnv();

//   // 1. Create new eBayApi instance and set the scope.
//   ebay.OAuth2.setScope([
//     "https://api.ebay.com/oauth/api_scope",
//     "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
//     "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
//   ]);

//   // 2. Generate and open Url and Grant Access
//   const url = ebay.OAuth2.generateAuthUrl();
//   console.log("Open URL", url);

//   // 3. Get the parameter code that is placed as query parameter in redirected page
//   const code = req.query.code; // this is provided from eBay

//   try {
//     const token = await ebay.OAuth2.getToken(code);
//     ebay.OAuth2.setCredentials(token);
//     // store this token e.g. to a session
//     req.session.token = token;

//     // 5. Start using the API
//     const orders = await ebay.sell.fulfillment.getOrders();
//     res.send(orders);
//   } catch (e) {
//     console.error(e);
//     res.sendStatus(400);
//   }
// });

export default router;
