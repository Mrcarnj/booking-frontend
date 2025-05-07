import { useBooking } from '@/contexts/BookingContext';
import { TeeTime } from '@/services/api';
import { GolfCartIcon } from '@/components/icons/GolfCartIcon';
import { LiaGolfBallSolid } from "react-icons/lia";
import { PiNumberSquareNineLight, PiSunHorizonDuotone } from "react-icons/pi";
import { TbNumber18Small } from "react-icons/tb";

function filterByTimeOfDay(time: string, filter: string) {
  const [hour, minute] = time.split(':').map(Number);
  if (filter === 'morning') return hour >= 6 && hour < 12;
  if (filter === 'afternoon') return hour >= 12 && hour < 17;
  if (filter === 'evening') return hour >= 17 && hour < 20;
  return true;
}

function formatTime12Hour(time: string) {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute}\u00A0${ampm}`;
}

function getAvailableText(availableSpots: number, maxPlayers: number) {
  return `1-${availableSpots} Available`;
}

function isNineHoleTime(time: string) {
  const [hour] = time.split(":").map(Number);
  return hour >= 16;
}

function isTwilightTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour > 14 || (hour === 14 && minute >= 30);
}

interface AvailableTimesProps {
  filterHoleCount: string;
}

export default function AvailableTimes({ filterHoleCount }: AvailableTimesProps) {
  const {
    availableTeeTimes,
    selectedTeeTime,
    setSelectedTeeTime,
    loading,
    error,
    filterPlayers,
    filterTimeOfDay
  } = useBooking();

  const filteredTeeTimes = availableTeeTimes.filter(
    (teeTime: TeeTime) => {
      const isNineHole = isNineHoleTime(teeTime.time);
      return (
        teeTime.availableSpots >= filterPlayers &&
        filterByTimeOfDay(teeTime.time, filterTimeOfDay) &&
        (filterHoleCount === 'all' || 
         filterHoleCount === '9' ||
         (filterHoleCount === '18' && !isNineHole))
      );
    }
  );

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm mt-2">
        {error}
      </div>
    );
  }

  if (filteredTeeTimes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No tee times available for the selected date
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fade-in">
      <h2 className="text-xl font-bold text-green-800 mb-6 text-center tracking-tight">
        Available Tee Times
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredTeeTimes.map((teeTime: TeeTime) => (
          <button
            key={teeTime._id}
            onClick={() => setSelectedTeeTime(teeTime)}
            className={`group bg-white border rounded-xl p-5 flex flex-col items-center shadow transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
              selectedTeeTime?._id === teeTime._id
                ? 'border-green-600 ring-2 ring-green-500 scale-105 shadow-xl'
                : 'border-green-200'
            }`}
          >
            {isTwilightTime(teeTime.time) ? (
              <PiSunHorizonDuotone className="text-black text-2xl mb-2 group-hover:text-green-700 transition-colors" />
            ) : (
              <LiaGolfBallSolid className="text-black text-2xl mb-2 group-hover:text-green-700 transition-colors" />
            )}
            <div className="text-xl font-bold text-green-900 mb-1">
              {formatTime12Hour(teeTime.time)}
            </div>
            <div className="text-lg text-green-700 font-semibold mb-1">
              {isNineHoleTime(teeTime.time) ? "$25" : `$${teeTime.price}`}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {getAvailableText(teeTime.availableSpots, teeTime.maxPlayers)}
            </div>
            {teeTime.availableSpots > 0 && (
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <GolfCartIcon className="text-lg" />
                {isNineHoleTime(teeTime.time) ? (
                  <PiNumberSquareNineLight className="text-lg" />
                ) : (
                  <>
                    <TbNumber18Small className="text-2xl" />
                    <PiNumberSquareNineLight className="text-xl" />
                  </>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 
