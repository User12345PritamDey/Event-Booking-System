const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controller/eventController.js');
const { protect, admin } = require('../middleware/auth.js');
//Get all the events
router.get('/', getEvents);
//Get events by id
router.get('/:id', getEventById);
//Admin will add any new  event
router.post('/', protect, admin, createEvent);
//Admin will update event,suppose change any event name by the event's particular id
router.put('/:id', protect, admin, updateEvent);
//Admin will delete any particular event by id
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
