"use strict";

const express = require("express");
const routes = express.Router();

const cartItems = [
   {id: 1, product: "drill", price: 99, quantity: 1},
   {id: 2, product: "hammer", price: 25, quantity: 1},
   {id: 3, product: "nails", price: 20, quantity: 750},
   {id: 4, product: "plywood", price: 15, quantity: 35},
   {id: 5, product: "screws", price: 30, quantity: 350},
];
let nextId = 6;

routes.get("/cart-items", (req, res)=>{
   let maxPrice = req.query.maxPrice;
   let prefix = req.query.prefix;
   let pageSize = req.query.pageSize;
   let filteredItems = cartItems;
   if (maxPrice) {
      filteredItems = filteredItems.filter((item)=>{
         return item.price <= parseInt(maxPrice);
      });
   };
   if (prefix) {
      filteredItems = filteredItems.filter((item)=>{
         return item.product.toLowerCase().startsWith(prefix.toLowerCase().trim());
      });
   };
   if (pageSize) {
      filteredItems = filteredItems.slice(0, pageSize);
   };
   res.json(filteredItems);
});

// DOES NOT WORK
routes.get("/cart-items/:id", (req, res)=>{
   let id = req.params.id;
   let foundItem = cartItems.find((item)=>{
      return item.id === parseInt(id);
   });
   if (foundItem) {
      res.json(foundItem);
   } else {
      res.send(`ID ${id} Not Found`);
   };
});

routes.post("/cart-items", (req, res)=>{
   let item = req.body;
   item.id = nextId++;
   cartItems.push(item);
   res.status(201);
   res.json(item);
});

routes.put("/cart-items/:id", (req, res)=>{
   let newItem = req.body;
   let id = parseInt(req.params.id);
   newItem.id = id;
   let index = cartItems.findIndex((item)=>{
      return item.id === id;
   });
   if (index === -1) {
      res.status(404);
      res.send(`No item found with id: ${id}`)
   } else {
      cartItems[index] = newItem;
      res.json(newItem);
   };
});

routes.delete("/cart-items/:id", (req, res)=>{
   let id = parseInt(req.params.id);
   let index = cartItems.findIndex((item)=>{
      return item.id === id;
   });
   if (index === -1) {
      res.status(404);
      res.send(`No item found at ${id}`);
   } else {
      cartItems.splice(index, 1);
      res.sendStatus(204);
   }
})

module.exports = routes;