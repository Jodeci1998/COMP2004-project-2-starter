//imports and initializations
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/product");
require("dotenv").config();
const { DB_URI } = process.env;
//middleware to parse JSON and hadle cors (Cross-Origin Resource Sharing)
//cors allows client web applications to interact with  a different domain
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
//DB connect and server start
mongoose
  .connect(DB_URI)
  .then((res) => {
    server.listen(port, () => {
      console.log(`DB connected...\nServer is listening on ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// ---------Defining the routes -------
//Root route
// root to confirm that the server is up and running
server.get("/", (request, response) => {
  response.send("LIVE!");
});
//GET /products
// get all products
server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.status(200).send(result));
  } catch (error) {
    console.log(error.message);
  }
});
// ----CRUD(Create, Read, Update and Delete)-------

//POST route

//here i will be applaying CRUD by post, put, and delete
//Post  route will add new products to the database creating a new resource
//endpoint /products
server.post("/products", async (request, response) => {
  try {
    //extracting  product details from the request body JSON
    const { productName, brand, image, price } = request.body;
    //creating a new product instance using the product model
    const newProduct = new Product({
      //generating a uniqque id for the product with library from Mongo and Node.js
      //it generates a 12 byte hexa string to make each product unique
      //toString just converts the Object.Id to make it more readable
      //why to use it ? because it allows quick and efficient searches, updates and deletions in the database
      id: new mongoose.Types.ObjectId().toString(),
      productName, //assign name to product
      brand, //assign brand name
      image, // assign image url
      price, // assign price
    });
    //save the new product to store it in the database
    await newProduct.save().then((savedProduct) => {
      //and upon succesful saving it sends  the saved product with a 201 HTTP status code
      //that tells us the request has been succesful
      //and created a new resource, this is recommend it to use to post and put as in here
      //we are creating a new product, so thats why im not using 200 as this is only when we
      //are not creating a new resource
      response.status(201).send(savedProduct);
    });
  } catch (error) {
    //logs any error to the console
    console.log(error.message);
  }
});

//PUT route

//PUT route is used to update an existing resource
//endpoint /products/:id, id is a route parameter representing the unique ID of the
//product to be updated
server.put("/products/:id", async (request, response) => {
  try {
    //extract the product id from the URL parameters
    const productId = request.params.id;
    //extract updated fields from the request body
    const { productName, brand, image, price } = request.body;

    //find the product by id and update its details by using findOneAndUpdate() method from mongoose library
    //allows to find a single document in a MongoDB collection that matches the id and updates with new data
    //ensure data consistency
    await Product.findOneAndUpdate(
      //search condition: product that has a matching id
      { id: productId },
      //fields to be updated
      { productName, brand, image, price },
      //option that ensures the updated product is returned
      { new: true }
    )
      .then((updatedProduct) => {
        if (!updatedProduct) {
          //if no product is found with the id, send a 404 reponse
          return response.status(404).send("Product not found");
        }
        //send the updated product with a 200 http status code meaning its ok
        response.status(200).send(updatedProduct);
      })
      .catch((error) => {
        //log the error message
        console.log(error.message);
        //send a 500 server error response
        response.status(500).send("Server Error");
      });
  } catch (error) {
    //log error message
    console.log(error.message);
    //send a 500 response for unexpected errors
    response.status(500).send("Server Error");
  }
});

//DELETE route

//DELETE route is used to remove a resource
//endpoint /products/:id route paramter representing the unique id of the product being deleted
server.delete("/products/:id", async (request, response) => {
  try {
    //extract the product ID from the URL parameters
    const productId = request.params.id;
    //find the product by id and delete it, uses findOneAndDelete method to locate and remove the product
    //by its id
    await Product.findOneAndDelete({ id: productId })
      .then((deletedProduct) => {
        if (!deletedProduct) {
          //if no product is found with the given id, send 404 not response
          return response.status(404).send("Product not found");
        }
        //send a success message with an ok 200 status code
        response.status(200).send("Product deleted succesfully");
      })
      .catch((error) => {
        //log the error message
        console.log(error.message);
        //send a 500 server error response
        response.status(500).send("Server error");
      });
  } catch (error) {
    //log the error
    console.log(error.message);
    //send a 500 response for unexécted errors
    response.status(500).send("Server error");
  }
});
