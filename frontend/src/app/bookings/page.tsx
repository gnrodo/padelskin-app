"use client";

import * as React from "react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAvailability, createBooking, AvailabilityResponse } from "@/lib/api"; // Import fetch and create functions
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // Import toast from sonner

// Helper function to format date safely, handling undefined
const formatDate = (date: Date | undefined): string => {
  if (!date) return "...";
  try {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida";
  }
};

// Placeholder Club ID - Replace with dynamic ID later
const PLACEHOLDER_CLUB_ID = "67f31e8aff2d2580fbd780c3"; // Actual Club ID

export default function BookingsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedCourtId, setSelectedCourtId] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const [availabilityData, setAvailabilityData] = React.useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);

  // Define loadAvailability inside component or memoize if needed outside
   const loadAvailability = React.useCallback(async (currentDate: Date | undefined) => {
      if (!currentDate || !PLACEHOLDER_CLUB_ID) {
        setAvailabilityData(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setSelectedTime(null);
      setSelectedCourtId(null);
      setAvailabilityData(null);

      try {
        const data = await fetchAvailability(PLACEHOLDER_CLUB_ID, currentDate);
        setAvailabilityData(data);
      } catch (err: Error | unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error al cargar la disponibilidad.");
      } finally {
        setIsLoading(false);
      }
   }, []); // Empty dependency array for useCallback, relies on currentDate argument

  // Fetch availability when date changes
  React.useEffect(() => {
    loadAvailability(date);
  }, [date, loadAvailability]); // Include loadAvailability in dependency array

  const handleTimeSelect = (courtId: string, time: string) => {
    setSelectedCourtId(courtId);
    setSelectedTime(time);
    setBookingError(null); // Clear previous booking errors
  };

  // Handler for booking confirmation - Defined INSIDE the component
  const handleBookingConfirm = async () => {
    if (!selectedCourtId || !selectedTime || !date) {
      toast.error("Por favor selecciona fecha, cancha y hora."); // Use sonner toast
      return;
    }

    setIsBookingLoading(true);
    setBookingError(null);

    try {
      const [hour, minute] = selectedTime.split(':');
      const startTime = new Date(date); // Use the state date
      startTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
      // It's often better to send UTC time to backend if backend expects UTC
      // const startTimeISO = startTime.toISOString();
      // Or send local time string if backend handles timezone conversion
      const startTimeLocalISO = new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000).toISOString().slice(0, -1);


      const bookingData = {
        club: PLACEHOLDER_CLUB_ID,
        court: selectedCourtId,
        startTime: startTimeLocalISO, // Send local time as ISO string (adjust if backend needs UTC)
      };

      // TODO: Pass access token when auth is implemented
      await createBooking(bookingData);

      toast.success(`¡Reserva Exitosa! Tu reserva para ${selectedTime} ha sido confirmada.`); // Use sonner toast
      setSelectedCourtId(null);
      setSelectedTime(null);
      // Reload availability after successful booking
      loadAvailability(date);

    } catch (err: Error | unknown) {
      console.error("Booking failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Error al crear la reserva.";
      setBookingError(errorMsg);
      toast.error(`Error en Reserva: ${errorMsg}`); // Use sonner toast
    } finally {
      setIsBookingLoading(false);
    }
  };


  return (
    <section className="container px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reservar Cancha</h1>
        <p className="text-muted-foreground">
          Selecciona una fecha y horario para ver la disponibilidad.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Left Column (Filters/Date) */}
        <div className="md:col-span-1 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Fecha</CardTitle>
            </CardHeader>
            <CardContent>
              <DatePicker date={date} setDate={setDate} className="w-full" />
              <div className="mt-4 space-y-2">
                 <p className="text-sm text-muted-foreground">(Filtros adicionales aquí...)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Availability) */}
        <div className="md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Disponibilidad para {formatDate(date)}
              </CardTitle>
              <CardDescription>
                Selecciona una cancha y horario disponible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Removed invalid comment placeholders */}

              {/* Simplified rendering logic for brevity */}
              {isLoading ? (
                 <div className="space-y-4">
                   <Skeleton className="h-8 w-1/2" />
                   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                   </div>
                 </div>
              ) : error ? (
                 <p className="text-sm text-destructive">{error}</p>
              ) : availabilityData ? (
                 <div className="space-y-6">
                   {availabilityData.courts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay canchas disponibles para esta fecha.</p>
                   ) : (
                     availabilityData.courts.map((court) => (
                       <div key={court.courtId}>
                         <h3 className="mb-2 font-semibold">{court.courtName} ({court.courtType})</h3>
                         {court.availableSlots.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta cancha.</p>
                         ) : (
                           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                             {court.availableSlots.map((time) => (
                               <Button
                                 key={time}
                                 variant={selectedCourtId === court.courtId && selectedTime === time ? "default" : "outline"}
                                 onClick={() => handleTimeSelect(court.courtId, time)}
                                 className="w-full justify-center"
                               >
                                 {time}
                               </Button>
                             ))}
                           </div>
                         )}
                       </div>
                     ))
                   )}
                 </div>
              ) : null}


              {/* Display selected time and court */}
              {selectedCourtId && selectedTime && (
                 <p className="mt-4 text-sm text-muted-foreground">
                    Horario seleccionado: {selectedTime} en cancha {availabilityData?.courts.find(c => c.courtId === selectedCourtId)?.courtName}
                 </p>
              )}
               {/* Booking button */}
               {selectedCourtId && selectedTime && (
                  <Button
                    className="mt-6 w-full"
                    onClick={handleBookingConfirm}
                    disabled={isBookingLoading}
                  >
                    {isBookingLoading ? "Reservando..." : `Confirmar Reserva`}
                  </Button>
               )}
               {/* Display booking error */}
               {bookingError && (
                  <p className="mt-2 text-sm text-destructive">{bookingError}</p>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
