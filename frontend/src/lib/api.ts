// TODO: Define proper types for the availability response, matching backend structure
export interface CourtAvailability {
  courtId: string;
  courtName: string;
  courtType: string;
  availableSlots: string[]; // Array of "HH:MM" strings
}

export interface AvailabilityResponse {
  clubId: string;
  date: string;
  courts: CourtAvailability[];
}

// Function to format date to YYYY-MM-DD
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function fetchAvailability(
  clubId: string,
  date: Date,
  // TODO: Add accessToken parameter later
  // accessToken: string | undefined
): Promise<AvailabilityResponse> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }
  if (!clubId) {
    throw new Error("Club ID is required.");
  }
  if (!date) {
    // Or return a default empty state?
    throw new Error("Date is required.");
  }

  const dateString = formatDateForAPI(date);
  const url = `${apiBaseUrl}/clubs/${clubId}/availability?date=${dateString}`;

  // TODO: Add Authorization header when auth is implemented
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      // Attempt to read error details from backend response
      let errorDetails = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += ` - ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        // Ignore if response body is not JSON or empty
      }
      throw new Error(errorDetails);
    }

    const data: AvailabilityResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch availability:", error);
    // Re-throw or handle error appropriately for the UI
    throw error;
  }
}