const express = require('express');
const router = express.Router();
const Showtime = require('../models/showtime');

// ✅ 1. GROUPED SHOWTIME FIRST
router.get('/grouped-showtimes', async (req, res) => {
  try {
      const showtimes = await Showtime.find()
          .populate('movie', 'Title Poster')
          .populate('threater', 'threater_name');

      const grouped = {};

      showtimes.forEach(show => {
          const movieId = show.movie._id.toString();

          if (!grouped[movieId]) {
              grouped[movieId] = {
                  movieId: movieId,
                  Title: show.movie.Title,
                  Poster: show.movie.Poster,
                  shows: []
              };
          }

          grouped[movieId].shows.push({
              theater: show.threater.threater_name,
              date: show.date,
              time: show.time,
              availableSeats: show.availableSeats,
              ticketPrice: show.ticketPrice
          });
      });

      const groupedArray = Object.values(grouped);
      res.json(groupedArray);
  } catch (error) {
      console.error('Error fetching grouped showtimes:', error);
      res.status(500).json({ error: 'Server Error' });
  }
});


router.get('/grouped-showtimes/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;

    const showtimes = await Showtime.find({ movie: movieId })
      .populate('movie', 'Title Poster') // adjust if your fields are Title and Poster
      .populate('threater', 'threater_name');

    if (showtimes.length === 0) {
      return res.status(404).json({ message: 'No showtimes found for this movie' });
    }

    const grouped = {
      movieId: movieId,
      Title: showtimes[0].movie.Title, // or showtimes[0].movie.Title
      Poster: showtimes[0].movie.Poster, // or showtimes[0].movie.Poster
      shows: showtimes.map(show => ({
        theater: show.threater.threater_name,
        date: show.date,
        time: show.time,
        availableSeats: show.availableSeats,
        ticketPrice: show.ticketPrice
      }))
    };

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching showtimes for movie:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});




// ✅ 2. Get all showtimes
router.get('/', async (req, res) => {
    try {
        const showtimes = await Showtime.find()
            .populate('movie')
            .populate('threater');
        res.json(showtimes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ 3. Filter showtimes by movie ID
// router.get('/movie/:movieId', async (req, res) => {
//     try {
//         const showtimes = await Showtime.find({ movie: req.params.movieId })
//             .populate('movie')
//             .populate('threater');

//         if (!showtimes.length) {
//             return res.status(404).json({ message: 'No showtimes found for this movie' });
//         }

//         const movieInfo = {
//             movie: showtimes[0].movie.title,
//             poster: showtimes[0].movie.poster,
//         };

//         const showtimesByTheater = showtimes.map(show => ({
//             threater: show.threater.threater_name,
//             time: show.time
//         }));

//         res.json({
//             movie: movieInfo,
//             showtimes: showtimesByTheater
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// ✅ 4. SINGLE SHOWTIME BY ID — last
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate('movie')
            .populate('threater');

        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        res.json(showtime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ 5. POST SHOWTIME
router.post('/show', async (req, res) => {
    try {
        const newShowtime = new Showtime({
            movie: req.body.movie,
            threater: req.body.threater,
            date: req.body.date,
            time: req.body.time,
            availableSeats: req.body.availableSeats,
            ticketPrice: req.body.ticketPrice
        });

        const savedShowtime = await newShowtime.save();
        res.status(201).json(savedShowtime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
