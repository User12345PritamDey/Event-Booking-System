const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBookings, cancelBooking, sendBookingOTP } = require('../controller/bookingController.js');
const { protect, admin } = require('../middleware/auth.js');

router.post('/send-otp', protect, sendBookingOTP);//only logged-in user will get otp by admin.
router.post('/', protect, bookEvent);//Only logged-in user will request to book their event.This is for user's side
router.put('/:id/confirm', protect, admin, confirmBooking);//Admin will confirm the particular event by event id but the admin must be authenticated 
router.get('/my', protect, getMyBookings);//User will get the booking details
router.delete('/:id', protect, cancelBooking);//Admin and user both can cancel booking but must be authenticated that will maintain protect function

module.exports = router;