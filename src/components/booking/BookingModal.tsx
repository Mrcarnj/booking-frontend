import { useEffect, useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import BookingConfirmation from './BookingConfirmation';
import { GolfCartIcon } from '@/components/icons/GolfCartIcon';
import { FaPersonWalking } from 'react-icons/fa6';

function formatTime12Hour(time: string) {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BookingModal() {
  const {
    selectedTeeTime,
    setSelectedTeeTime,
    numberOfPlayers,
    setNumberOfPlayers,
    holeCount,
    setHoleCount,
    cartRequired,
    setCartRequired,
    setError,
    setLoading,
    setBooking,
    booking,
    setBooking: setBookingContext,
    refreshTeeTimes,
    error
  } = useBooking();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const [showErrorModal, setShowErrorModal] = useState(false);

  // Always default to Riding when modal opens
  useEffect(() => {
    if (!selectedTeeTime) {
      setFormData({ email: '', firstName: '', lastName: '', phoneNumber: '' });
      setBookingContext(null);
    } else {
      setCartRequired(true);
    }
  }, [selectedTeeTime, setBookingContext, setCartRequired]);

  if (!selectedTeeTime) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setSelectedTeeTime(null);
    setBookingContext(null);
    if (booking) {
      refreshTeeTimes();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !numberOfPlayers || !holeCount) {
      setError('All fields except cart are required.');
      setShowErrorModal(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const booking = await import('@/services/api').then(({ api }) =>
        api.createBooking({
          teeTimeId: selectedTeeTime._id,
          numberOfPlayers,
          holeCount,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          cartRequired: cartRequired
        }, 'example.golfshopapp.com')
      );
      setBooking(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 sm:p-0">
      {/* Error Modal Overlay */}
      {showErrorModal && error && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full text-center relative">
            <button
              onClick={() => {
                setShowErrorModal(false);
                setSelectedTeeTime(null);
                refreshTeeTimes();
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close error dialog"
            >
              &times;
            </button>
            <div className="text-xl font-semibold text-red-600 mb-2">Booking Error</div>
            <div className="text-base text-gray-800 mb-4">{error}</div>
            <button
              onClick={() => {
                setShowErrorModal(false);
                setSelectedTeeTime(null);
                refreshTeeTimes();
              }}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-black">Book Tee Time:</div>
          <div className="text-base font-normal text-black mt-1">{formatDate(selectedTeeTime.date)} at {formatTime12Hour(selectedTeeTime.time)}</div>
        </div>
        {booking ? (
          <BookingConfirmation />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Players
              </label>
              <select
                value={numberOfPlayers}
                onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black px-3"
              >
                {Array.from({ length: selectedTeeTime.availableSpots }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num} className="text-black">
                    {num} {num === 1 ? 'Player' : 'Players'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Holes
              </label>
              <select
                value={holeCount}
                onChange={(e) => setHoleCount(e.target.value as '9' | '18')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black px-3"
              >
                <option value="9" className="text-black">9 Holes</option>
                <option value="18" className="text-black">18 Holes</option>
              </select>
            </div>

            {/* Cart or Walking Selection */}
            <div>

              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className={`group flex flex-col items-center border rounded-xl p-3 w-24 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
                    ${cartRequired ? 'border-green-600 ring-2 ring-green-500 scale-105 shadow-xl bg-green-50' : 'border-green-200 bg-white'}`}
                  onClick={() => setCartRequired(true)}
                  aria-pressed={cartRequired}
                >
                  <GolfCartIcon className="text-2xl mb-1 text-green-700 group-aria-pressed:text-green-900" />
                  <span className="text-sm font-semibold text-green-900">Riding</span>
                </button>
                <button
                  type="button"
                  className={`group flex flex-col items-center border rounded-xl p-3 w-24 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
                    ${!cartRequired ? 'border-green-600 ring-2 ring-green-500 scale-105 shadow-xl bg-green-50' : 'border-green-200 bg-white'}`}
                  onClick={() => setCartRequired(false)}
                  aria-pressed={!cartRequired}
                >
                  <FaPersonWalking className="text-2xl mb-1 text-green-700 group-aria-pressed:text-green-900" />
                  <span className="text-sm font-semibold text-green-900">Walking</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black placeholder-gray-400 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black placeholder-gray-400 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black placeholder-gray-400 px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 text-base text-black placeholder-gray-400 px-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedTeeTime}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              Book Tee Time
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 