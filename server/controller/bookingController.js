const Booking = require('../models/Booking.js');
const Event = require('../models/Event.js');
const OTP = require('../models/OTP.js');
const {
    sendBookingEmail,
    sendBookingCancelledEmail,
    sendOTPEmail
} = require('../utils/emails.js');

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP for Event Booking
exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOTP();

        await OTP.findOneAndDelete({
            email: req.user.email,
            action: 'event_booking'
        });

        await OTP.create({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        await sendOTPEmail(req.user.email, otp, 'event_booking');

        res.json({
            message: 'OTP sent successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error sending OTP',
            error: error.message
        });
    }
};

// Book Event
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp, paymentMethod } = req.body;

        // Verify OTP
        const validOTP = await OTP.findOne({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP for booking'
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                message: 'No seats available'
            });
        }

        const existingBooking = await Booking.findOne({
            userId: req.user.id,
            eventId
        });

        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({
                message: 'Already booked or pending'
            });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            paymentMethod,
            amount: event.ticketPrice
        });

        // Delete OTP after successful booking request
        await OTP.deleteOne({ _id: validOTP._id });

        res.status(201).json({
            message: 'Booking request submitted successfully',
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Admin Confirms Booking
exports.confirmBooking = async (req, res) => {
    try {

        const { paymentStatus } = req.body;

        const booking = await Booking.findById(req.params.id)
            .populate('userId')
            .populate('eventId');

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        if (booking.status === 'confirmed') {
            return res.status(400).json({
                message: 'Booking is already confirmed'
            });
        }

        const event = await Event.findById(booking.eventId._id);

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                message: 'No seats available to confirm this booking'
            });
        }

        booking.status = 'confirmed';

        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;

            if (paymentStatus === 'paid') {
                booking.paymentDate = new Date();
            }
        }

        await booking.save();

        // Reduce available seat
        event.availableSeats -= 1;
        await event.save();

        // Send confirmation email
        await sendBookingEmail(
            booking.userId.email,
            booking.userId.name,
            booking.eventId.title
        );

        res.json({
            message: 'Booking confirmed successfully',
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get My Bookings
exports.getMyBookings = async (req, res) => {
    try {

        const bookings =
            req.user.role === 'admin'
                ? await Booking.find()
                      .populate('eventId')
                      .populate('userId', 'name email')
                      .sort({ createdAt: -1 })
                : await Booking.find({ userId: req.user.id })
                      .populate('eventId')
                      .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id)
    .populate("userId")
    .populate("eventId");

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        if (
            booking.userId.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'Not authorized'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                message: 'Already cancelled'
            });
        }

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';

        await booking.save();

        // Restore seat if booking was confirmed
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);

            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }
        await sendBookingCancelledEmail(
    booking.userId.email,
    booking.userId.name,
    booking.eventId.title
);
        res.json({
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};