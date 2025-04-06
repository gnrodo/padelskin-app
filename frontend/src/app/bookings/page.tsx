"use client"; // Convert to Client Component to use state

import * as React from "react"; // Import React for useState
import { DatePicker } from "@/components/date-picker"; // Import the DatePicker component
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import Card components

// Helper function to format date safely, handling undefined
const formatDate = (date: Date | undefined): string => {
  if (!date) {
    return "..."; // Return placeholder if date is undefined
  }
  try {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha inválida"; // Fallback for invalid dates
  }
};

// Define available time slots
const availableTimes = [
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "20:00",
  "21:30",
  // Note: 23:00 is the end time, not a start time for a 1.5hr slot starting before 23:00
];

export default function BookingsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date()); // Initialize date state
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null); // State for selected time

  // TODO: Fetch actual availability based on selected date from backend
  const isTimeAvailable = (time: string) => {
    // Placeholder logic: Assume all times are available for now
    return true;
  };

  const handleTimeSelect = (time: string) => {
    if (isTimeAvailable(time)) {
      setSelectedTime(time);
    }
    // Optionally handle unavailable time clicks (e.g., show a message)
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
                Selecciona un horario disponible para reservar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Availability Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {availableTimes.map((time) => {
                  const available = isTimeAvailable(time); // Check availability (placeholder)
                  return (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"} // Style based on selection
                      disabled={!available} // Disable if not available (using placeholder logic)
                      onClick={() => handleTimeSelect(time)}
                      className="w-full justify-center" // Ensure button text is centered
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
              {/* Display selected time */}
              {selectedTime && (
                 <p className="mt-4 text-sm text-muted-foreground">
                    Horario seleccionado: {selectedTime}
                 </p>
              )}
               {/* Placeholder for booking button */}
               {selectedTime && (
                  <Button className="mt-6 w-full">Confirmar Reserva para {selectedTime}</Button>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}