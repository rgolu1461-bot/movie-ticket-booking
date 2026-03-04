import React, { useState, useEffect } from 'react';
import { Film, CheckCircle2, Info, MapPin, Ticket, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Simple data for movies
const MOVIES = [
  { id: 1, title: 'Inception', price: 250, image: 'https://picsum.photos/seed/inception/300/450', showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'] },
  { id: 2, title: 'The Dark Knight', price: 300, image: 'https://picsum.photos/seed/batman/300/450', showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'] },
  { id: 3, title: 'Interstellar', price: 200, image: 'https://picsum.photos/seed/space/300/450', showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'] },
  { id: 4, title: 'Avatar: Way of Water', price: 450, image: 'https://picsum.photos/seed/avatar/300/450', showtimes: ['9:00 AM', '1:00 PM', '5:00 PM', '9:00 PM'] },
];

const HALLS = [
  'Silver City Cinema Hall',
  'Clement Town Cinema Hall',
  'Pentaloon Cinema Hall'
];

// Generate a grid of seats (8 rows, 8 columns)
const ROWS = 8;
const COLS = 8;
const initialSeats = Array(ROWS * COLS).fill(false);

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [selectedHall, setSelectedHall] = useState(HALLS[0]);
  const [selectedShowtime, setSelectedShowtime] = useState(MOVIES[0].showtimes[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load booked tickets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ticketHub_bookings');
    if (saved) {
      try {
        setBookedTickets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved bookings", e);
      }
    }
  }, []);

  // Save booked tickets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ticketHub_bookings', JSON.stringify(bookedTickets));
  }, [bookedTickets]);

  // Toggle seat selection
  const toggleSeat = (index) => {
    if (selectedSeats.includes(index)) {
      setSelectedSeats(selectedSeats.filter(s => s !== index));
    } else {
      setSelectedSeats([...selectedSeats, index]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    
    const newBooking = {
      id: Date.now(),
      movie: selectedMovie.title,
      hall: selectedHall,
      showtime: selectedShowtime,
      seats: [...selectedSeats],
      total: selectedSeats.length * selectedMovie.price,
      date: new Date().toLocaleString()
    };

    setBookedTickets([newBooking, ...bookedTickets]);
    setIsBooked(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsBooked(false);
      setSelectedSeats([]);
    }, 3000);
  };

  const totalPrice = selectedSeats.length * selectedMovie.price;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 border-b border-zinc-800 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-2xl">
              <Film className="text-zinc-950 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter">TicketHub</h1>
            <div className="max-w-md mx-auto text-zinc-400 text-sm leading-relaxed">
              Your premium destination for seamless movie ticket bookings and cinematic experiences.
              Browse the latest blockbusters and reserve your favorite seats in just a few clicks.
            </div>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              {showHistory ? <Film className="w-3 h-3" /> : <History className="w-3 h-3" />}
              {showHistory ? "Back to Booking" : "View Booked Tickets"}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Ticket className="text-emerald-500" />
                  Booking History
                </h2>
                {bookedTickets.length > 0 && (
                  <button 
                    onClick={() => {
                      if(confirm("Clear all booking history?")) setBookedTickets([]);
                    }}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {bookedTickets.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <History className="text-zinc-600 w-8 h-8" />
                  </div>
                  <p className="text-zinc-400">No tickets booked yet.</p>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="px-6 py-2 bg-emerald-500 text-zinc-950 rounded-full font-bold text-sm"
                  >
                    Book Your First Ticket
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookedTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-emerald-400">{ticket.movie}</h3>
                          <p className="text-xs text-zinc-500">{ticket.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{ticket.total}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Paid</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/50">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {ticket.hall}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <Ticket className="w-3 h-3 text-zinc-500" />
                          Seats: {ticket.seats.map(s => s + 1).join(', ')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-400/80 font-medium">
                          <Film className="w-3 h-3" />
                          Showtime: {ticket.showtime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Left Column: Movie & Hall Selection */}
              <section className="lg:col-span-1 space-y-8">
                {/* Hall Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    Select Cinema Hall
                  </h2>
                  <div className="space-y-2">
                    {HALLS.map((hall) => (
                      <button
                        key={hall}
                        onClick={() => setSelectedHall(hall)}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-medium ${
                          selectedHall === hall
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {hall}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Movie Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Info className="w-5 h-5 text-emerald-500" />
                    Available Movies
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {MOVIES.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => {
                          setSelectedMovie(movie);
                          setSelectedSeats([]); // Reset seats when movie changes
                          setSelectedShowtime(movie.showtimes[0]); // Reset showtime when movie changes
                        }}
                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                          selectedMovie.id === movie.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="font-medium">{movie.title}</p>
                          <p className="text-sm opacity-60">₹{movie.price} per seat</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Showtime Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Film className="w-5 h-5 text-emerald-500" />
                    Select Showtime
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMovie.showtimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedShowtime(time)}
                        className={`p-3 rounded-xl border transition-all text-xs font-bold ${
                          selectedShowtime === time
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Middle Column: Seat Selection */}
              <section className="lg:col-span-2 space-y-8 bg-zinc-900/50 p-6 md:p-10 rounded-3xl border border-zinc-800">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Choose Your Seats</h2>
                  <p className="text-zinc-500 text-sm">Screen is this way</p>
                  {/* Screen visualization */}
                  <div className="w-full h-2 bg-zinc-700 rounded-full shadow-[0_10px_20px_rgba(255,255,255,0.1)] mt-4 mb-12"></div>
                </div>

                {/* Seat Grid */}
                <div className="grid grid-cols-8 gap-3 max-w-md mx-auto">
                  {initialSeats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => toggleSeat(index)}
                      className={`aspect-square rounded-md flex items-center justify-center transition-all ${
                        selectedSeats.includes(index)
                          ? 'bg-emerald-500 scale-110'
                          : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      {/* Icon removed as requested */}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 text-xs text-zinc-500 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-zinc-800 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-zinc-400 text-sm">
                      Selected: <span className="text-zinc-100 font-medium">{selectedSeats.length} seats</span>
                    </p>
                    <p className="text-2xl font-bold text-emerald-500">
                      Total: ₹{totalPrice}
                    </p>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || isBooked}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                      isBooked
                        ? 'bg-emerald-500 text-zinc-950'
                        : selectedSeats.length > 0
                        ? 'bg-zinc-100 text-zinc-950 hover:bg-emerald-400 active:scale-95'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Booking Confirmed!
                      </>
                    ) : (
                      'Book Tickets Now'
                    )}
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 text-center text-zinc-600 text-sm border-t border-zinc-900 pt-8 pb-12">
          <p>© 2026 TicketHub.</p>
        </footer>
      </div>

      {/* Success Overlay */}
      {isBooked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-zinc-900 p-8 rounded-3xl border border-emerald-500/30 text-center max-w-sm w-full space-y-4"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-zinc-950" />
            </div>
            <h3 className="text-2xl font-bold">Success!</h3>
            <div className="space-y-2">
              <p className="text-zinc-400">
                Your tickets for <span className="text-emerald-400 font-medium">{selectedMovie.title}</span> have been booked.
              </p>
              <p className="text-xs text-zinc-500 italic">
                Venue: {selectedHall} | Time: {selectedShowtime}
              </p>
            </div>
            <div className="text-xs text-zinc-600 pt-4">
              Redirecting to home...
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
