const express = require("express");

const carsRouter = require("../cars/carsRouter");

const server = express();

server.use(express.json());

server.use("/api/cars", carsRouter);

server.get("/", (req, res) => {
	res.send("Server Running");
});

module.exports = server;
