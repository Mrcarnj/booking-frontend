'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
import AvailableTimes from '@/components/booking/AvailableTimes';
import BookingForm from '@/components/booking/BookingForm';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import BookingModal from '@/components/booking/BookingModal';
import { api } from '@/services/api';
import { FaGolfBall, FaCalendarAlt } from 'react-icons/fa';

function BookingPageContent() {
  const { selectedDate, setSelectedDate, loading, error, filterPlayers, setFilterPlayers, filterTimeOfDay, setFilterTimeOfDay } = useBooking();
  const [filterHoleCount, setFilterHoleCount] = useState('all');

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-0">
      {/* Hero Section */}
      <div className="relative flex justify-center items-center min-h-[160px] sm:min-h-[200px] bg-gradient-to-br from-green-700 to-green-600 shadow-lg mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/80 to-green-600/60 rounded-b-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center justify-center px-4 py-4 sm:py-6 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-green-900/10">
          <FaGolfBall className="text-3xl sm:text-4xl mb-2 drop-shadow-lg animate-bounce text-green-200" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 text-center text-white drop-shadow-lg">
            Book Your Tee Time
          </h1>
          <p className="hidden sm:block mt-1 text-lg sm:text-xl text-green-100 text-center max-w-xl font-medium drop-shadow">
            Reserve your spot for a perfect day on the course. Choose your date, filter by time and group size, and book in seconds!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Date Selection */}
        <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-green-100">
          {/* Date Selection */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
                Select Date
              </label>
              <div className="relative flex items-center w-full justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  className="mx-auto max-w-xs sm:max-w-full rounded-lg border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg pl-3 pr-10 py-2 text-gray-900 text-center"
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date"
                />
                <span className="absolute right-3 items-center pointer-events-none h-full hidden sm:flex">
                  <FaCalendarAlt className="text-gray-500 text-lg sm:text-xl" />
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
                Players
              </label>
              <select
                value={filterPlayers}
                onChange={e => setFilterPlayers(Number(e.target.value))}
                className="w-full rounded-lg border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg px-2 sm:px-3 py-1.5 sm:py-2 text-gray-900"
              >
                {[1,2,3,4].map(num => (
                  <option key={num} value={num}>{num} Player{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
                Time
              </label>
              <select
                value={filterTimeOfDay}
                onChange={e => setFilterTimeOfDay(e.target.value)}
                className="w-full rounded-lg border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg px-2 sm:px-3 py-1.5 sm:py-2 text-gray-900"
              >
                <option value="all">All</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div className="w-full col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2 text-center">
                Holes
              </label>
              <select
                value={filterHoleCount}
                onChange={e => setFilterHoleCount(e.target.value)}
                className="w-full rounded-lg border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base sm:text-lg px-2 sm:px-3 py-1.5 sm:py-2 text-gray-900"
              >
                <option value="all">All</option>
                <option value="9">9 Holes</option>
                <option value="18">18 Holes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/90 shadow-xl rounded-2xl p-4 sm:p-8 border border-green-100">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-base mt-2 text-center">
              {error}
            </div>
          )}

          {selectedDate && !loading && !error && (
            <div className="space-y-8">
              <AvailableTimes filterHoleCount={filterHoleCount} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function BookingPage() {
  return (
    <BookingProvider>
      <BookingModal />
      <BookingPageContent />
    </BookingProvider>
  );
}

export default BookingPage;
