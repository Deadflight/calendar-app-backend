const { response, request } = require("express");

const Event = require("../models/Event");

//Get all the events
const getEvents = async (req = request, res = response) => {
	const events = await Event.find().populate("user", "name");

	return res.json({
		ok: true,
		events,
	});
};

//Create a new event
const createEvent = async (req = request, res = response) => {
	const event = new Event(req.body);

	try {
		//We set the user uid in the validateJWT middleware
		event.user = req.uid;
		const eventDB = await event.save();
		return res.json({
			ok: true,
			event: eventDB,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Contact with support",
		});
	}
};

//Update an event
const updateEvent = async (req = request, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event doesn't exist with that id",
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "The user doesn't have access to this event",
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
			// Return the new upated envent
			new: true,
		});

		return res.json({
			ok: true,
			msg: "Updated Event",
			eventUpdated,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Contact with support",
		});
	}
};

//Delete an event
const deleteEvent = async (req = request, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event doesn't exist with that id",
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "The user doesn't have access to this event",
			});
		}

		await Event.findByIdAndDelete(eventId);

		return res.json({
			ok: true,
			deletedEvent: eventId,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Contact with support",
		});
	}
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
