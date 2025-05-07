import { useBooking } from '@/contexts/BookingContext';
import { QRCodeCanvas } from 'qrcode.react';

export default function BookingConfirmation() {
  const { booking } = useBooking();

  if (!booking) return null;

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your tee time has been successfully booked.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4 sm:pt-6">
        <dl className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
            <dd className="text-sm text-gray-900 break-all ml-4">{booking._id}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="text-sm text-gray-900">
              {new Date(booking.teeTimeId.date).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-500">Time</dt>
            <dd className="text-sm text-gray-900">
              {booking.teeTimeId.time}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-500">Players</dt>
            <dd className="text-sm text-gray-900">{booking.numberOfPlayers}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-sm font-medium text-gray-500">Holes</dt>
            <dd className="text-sm text-gray-900">{booking.holeCount}</dd>
          </div>
          {booking.cartRequired && (
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-500">Cart Rental</dt>
              <dd className="text-sm text-gray-900">Included</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <QRCodeCanvas
            value={`https://example.golfshopapp.com/booking/${booking._id}`}
            size={Math.min(200, window.innerWidth * 0.6)}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Show this QR code at check-in</p>
        <p className="mt-1 break-words">A confirmation email has been sent to {booking.email}</p>
      </div>
    </div>
  );
} 