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
import { fetchAvailability, AvailabilityResponse, CourtAvailability } from "@/lib/api"; // Import fetch function and types
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

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
const PLACEHOLDER_CLUB_ID = "67f31e8aff2d2580fbd780c3"; // Replaced with actual Club ID

export default function BookingsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedCourtId, setSelectedCourtId] = React.useState<string | null>(null); // State for selected court
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null); // State for selected time

  const [availabilityData, setAvailabilityData] = React.useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch availability when date changes
  React.useEffect(() => {
    if (!date || !PLACEHOLDER_CLUB_ID) {
      setAvailabilityData(null); // Clear data if date or clubId is missing
      return;
    }

    const loadAvailability = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedTime(null); // Reset selected time when date changes
      setSelectedCourtId(null); // Reset selected court
      setAvailabilityData(null); // Clear previous data

      try {
        // TODO: Pass access token when auth is implemented
        const data = await fetchAvailability(PLACEHOLDER_CLUB_ID, date);
        setAvailabilityData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error al cargar la disponibilidad.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAvailability();
  }, [date]); // Dependency array includes 'date'

  const handleTimeSelect = (courtId: string, time: string) => {
    setSelectedCourtId(courtId);
    setSelectedTime(time);
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
              {/* Placeholder for other filters */}
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
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                </div>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {!isLoading && !error && availabilityData && (
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
              )}
              {/* Display selected time and court */}
              {selectedCourtId && selectedTime && (
                 <p className="mt-4 text-sm text-muted-foreground">
                    Horario seleccionado: {selectedTime} en cancha {availabilityData?.courts.find(c => c.courtId === selectedCourtId)?.courtName}
                 </p>
              )}
               {/* Booking button */}
               {selectedCourtId && selectedTime && (
                  <Button className="mt-6 w-full">Confirmar Reserva</Button>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}