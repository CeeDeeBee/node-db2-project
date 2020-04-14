const express = require("express");
const knex = require("knex");

const knexfile = require("../knexfile");

const db = knex(knexfile.development);

const router = express.Router();

router.get("/", (req, res) => {
	db("cars")
		.then((cars) => res.status(200).json(cars))
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
});

router.get("/:id", (req, res) => {
	const { id } = req.params;

	db("cars")
		.where({ id })
		.first()
		.then((car) => res.status(200).json(car))
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
});

router.post("/", (req, res) => {
	if (req.body.vin && req.body.make && req.body.model && req.body.mileage) {
		db("cars")
			.insert(req.body)
			.then((ids) => {
				db("cars")
					.where({ id: ids[0] })
					.first()
					.then((car) => res.status(201).json(car));
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: err.message });
			});
	} else {
		res
			.status(400)
			.json({ message: "Car must have VIN, make, model, and mileage." });
	}
});

module.exports = router;
