import { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { api } from '@/services/api';

export default function BookingForm() {
  const {
    selectedDate,
    numberOfPlayers,
    setNumberOfPlayers,
    holeCount,
    setHoleCount,
    cartRequired,
    setCartRequired,
    selectedTeeTime,
    setError,
    setLoading,
    setBooking
  } = useBooking();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeeTime) {
      setError('Please select a tee time');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const booking = await api.createBooking({
        teeTimeId: selectedTeeTime._id,
        numberOfPlayers,
        holeCount,
        cartRequired,
        ...formData
      }, 'example.golfshopapp.com');

      setBooking(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const isNineHoleTime = selectedTeeTime && Number(selectedTeeTime.time.split(":")[0]) >= 16;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Players
        </label>
        <select
          value={numberOfPlayers}
          onChange={(e) => setNumberOfPlayers(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          {[1, 2, 3, 4].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Player' : 'Players'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Holes
        </label>
        <select
          value={holeCount}
          onChange={(e) => setHoleCount(e.target.value as '9' | '18')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          disabled={isNineHoleTime}
        >
          <option value="9">9 Holes</option>
          <option value="18" disabled={isNineHoleTime}>18 Holes</option>
        </select>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={cartRequired}
            onChange={(e) => setCartRequired(e.target.checked)}
            className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          <span className="ml-2 text-sm text-gray-700">Rent a Golf Cart</span>
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedTeeTime}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
      >
        Book Tee Time
      </button>
    </form>
  );
} 