/*
  Events Routes / Events
  host + /api/event
*/

//Dependencies
const { Router } = require("express");
const { check } = require("express-validator");

//Require Middlewares
const { validateFields } = require("../middlewares/fieldValidators");
const { validateJWT } = require("../middlewares/validateJWT");

//Require Helpers
const { isDate } = require("../helpers/isDate");

//Controllers
const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/events");

//Router
const router = Router();

//Global Middlewares
router.use(validateJWT);

/* Events Enpoints */

//Get all the events
router.get("/", getEvents);

//Create a new event
router.post(
	"/",
	[
		//Middlewares
		check("title", "Title is required").not().isEmpty(),
		check("start", "Start date is required").custom(isDate),
		check("end", "End date is required").custom(isDate),
		validateFields,
	],
	createEvent
);

//Update an event
router.put(
	"/:id",
	[
		//Middlewares
		check("title", "Title is required").not().isEmpty(),
		check("start", "Start date is required").custom(isDate),
		check("end", "End date is required").custom(isDate),
		validateFields,
	],
	updateEvent
);

//Delete an event
router.delete("/:id", deleteEvent);

module.exports = router;
