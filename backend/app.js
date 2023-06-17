const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const api = process.env.API_URL;
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);


const productRoutes = require('./routes/products');
app.use(`${api}/products`,productRoutes);

const categoriesRoutes = require("./routes/categories");
app.use(`${api}/categories`, categoriesRoutes);

const ordersRoutes = require("./routes/orders");
app.use(`${api}/orders`, ordersRoutes);

const usersRoutes = require("./routes/users");
app.use(`${api}/users`, usersRoutes);


mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "buyinvestment-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, '0.0.0.0');
