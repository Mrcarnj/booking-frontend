const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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