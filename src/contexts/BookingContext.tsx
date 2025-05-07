import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TeeTime, BookingRequest, BookingResponse, api } from '../services/api';

interface BookingContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  numberOfPlayers: number;
  setNumberOfPlayers: (num: number) => void;
  holeCount: '9' | '18';
  setHoleCount: (count: '9' | '18') => void;
  cartRequired: boolean;
  setCartRequired: (required: boolean) => void;
  availableTeeTimes: TeeTime[];
  setAvailableTeeTimes: (times: TeeTime[]) => void;
  selectedTeeTime: TeeTime | null;
  setSelectedTeeTime: (time: TeeTime | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  booking: BookingResponse | null;
  setBooking: (booking: BookingResponse | null) => void;
  filterPlayers: number;
  setFilterPlayers: (num: number) => void;
  filterTimeOfDay: string;
  setFilterTimeOfDay: (val: string) => void;
  filterHoleCount: string;
  setFilterHoleCount: (holeCount: string) => void;
  refreshTeeTimes: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [holeCount, setHoleCount] = useState<'9' | '18'>('18');
  const [cartRequired, setCartRequired] = useState(false);
  const [availableTeeTimes, setAvailableTeeTimes] = useState<TeeTime[]>([]);
  const [selectedTeeTime, setSelectedTeeTime] = useState<TeeTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [filterPlayers, setFilterPlayers] = useState(1);
  const [filterTimeOfDay, setFilterTimeOfDay] = useState('all');
  const [filterHoleCount, setFilterHoleCount] = useState('all');

  useEffect(() => {
    const fetchTeeTimes = async () => {
      if (!selectedDate) {
        setAvailableTeeTimes([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const times = await api.getAvailableTeeTimes(selectedDate, 'example.golfshopapp.com');
        setAvailableTeeTimes(times);
      } catch (err) {
        setAvailableTeeTimes([]);
        setError(err instanceof Error ? err.message : 'Failed to fetch tee times');
      } finally {
        setLoading(false);
      }
    };
    fetchTeeTimes();
  }, [selectedDate]);

  const refreshTeeTimes = () => {
    setSelectedDate((prev) => (prev ? new Date(prev) : null));
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        numberOfPlayers,
        setNumberOfPlayers,
        holeCount,
        setHoleCount,
        cartRequired,
        setCartRequired,
        availableTeeTimes,
        setAvailableTeeTimes,
        selectedTeeTime,
        setSelectedTeeTime,
        loading,
        setLoading,
        error,
        setError,
        booking,
        setBooking,
        filterPlayers,
        setFilterPlayers,
        filterTimeOfDay,
        setFilterTimeOfDay,
        filterHoleCount,
        setFilterHoleCount,
        refreshTeeTimes
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
} 