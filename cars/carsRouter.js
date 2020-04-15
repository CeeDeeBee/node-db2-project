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

router.get("/:id", validateCarID, (req, res) => {
	res.status(200).json(req.car);
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

router.put("/:id", validateCarID, (req, res) => {
	const { id } = req.params;

	db("cars")
		.where({ id })
		.update(req.body)
		.then(() => {
			db("cars")
				.where({ id })
				.first()
				.then((car) => res.status(201).json(car))
				.catch((err) => {
					console.log(err);
					res.status(500).json({ error: err.message });
				});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
});

router.delete("/:id", validateCarID, (req, res) => {
	const { id } = req.params;

	db("cars")
		.where({ id })
		.del()
		.then((count) =>
			res.status(200).json({ message: `${count} record(s) deleted` })
		)
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
});

function validateCarID(req, res, next) {
	const { id } = req.params;

	db("cars")
		.where({ id })
		.first()
		.then((car) => {
			if (car) {
				req.car = car;
				next();
			} else {
				res.status(404).json({ message: "Car Not Found" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
}

module.exports = router;
