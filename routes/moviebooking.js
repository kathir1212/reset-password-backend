const express = require('express');
const router = express.Router();
const Booking = require('../models/moviebooking');
router.get('/', async (req, res) => {
    try {
        const moviebooking = await Booking.find().populate({
            path: "showtime",
            populate: [{ path: "movie" }, { path: "threater" }]
          })
          .populate("user");
        res.json({message:"movies saved successfuly", data : moviebooking});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/ticket', async (req, res) => {
    console.log("showtime");
    
    try {
        const newShowtime = new Booking({
            showtime: req.body.showtime,
            user: req.body.user,
            seatsBooked: req.body.seatsBooked,
            seatNumbers:req.body.seatNumbers,
            bookingDate: req.body.bookingDate
        });

        

        const savedShowtime = await newShowtime.save();
        res.status(201).json(savedShowtime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
