const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  if (typeof window === 'undefined') {
    // Server-side rendering
    return 'http://localhost:5001/api';
  }
  
  // Client-side rendering
  return window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : `http://${window.location.hostname}:5001/api`;
};

const API_URL = getApiUrl();

export interface TeeTime {
  _id: string;
  date: string;
  time: string;
  maxPlayers: number;
  availableSpots: number;
  status: string;
  courseId: string;
  price: number;
}

export interface BookingRequest {
  teeTimeId: string;
  numberOfPlayers: number;
  holeCount: '9' | '18';
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cartRequired?: boolean;
}

export interface BookingResponse {
  _id: string;
  teeTimeId: string;
  userId: string;
  numberOfPlayers: number;
  holeCount: '9' | '18';
  cartRequired: boolean;
  qrCodeUrl: string;
  status: string;
  paymentStatus: string;
  email: string;
  teeTime: {
    date: string;
    time: string;
  };
}

export const api = {
  getAvailableTeeTimes: async (date: Date, courseDomain: string): Promise<TeeTime[]> => {
    try {
      const response = await fetch(
        `${API_URL}/tee-times/available?date=${date.toISOString()}`,
        {
          headers: {
            'X-Course-Domain': courseDomain
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tee times');
      }
      
      const data = await response.json();
      return data.data.teeTimes;
    } catch (error) {
      console.error('Error fetching tee times:', error);
      throw error;
    }
  },

  createBooking: async (booking: BookingRequest, courseDomain: string): Promise<BookingResponse> => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Course-Domain': courseDomain
      },
      body: JSON.stringify(booking)
    });

    if (!response.ok) {
      // Try to extract detailed error from backend
      let errorMsg = 'Failed to create booking';
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData && errorData.error && errorData.error.message) {
          errorMsg = errorData.error.message;
        }
      } catch (e) {
        // fallback to default
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.data.booking;
  }
}; 