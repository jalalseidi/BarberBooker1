import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookingCard } from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import { getBookings, cancelBooking, Booking } from "@/api/bookings";
import { useToast } from "@/hooks/useToast";
import { useNavigate, useLocation } from "react-router-dom";

export function Bookings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      console.log('Fetching bookings...');
      const data = await getBookings();
      setBookings(data.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [toast]);

  useEffect(() => {
    // Refetch bookings when navigated with refresh state
    if (location.state?.refresh) {
      fetchBookings();
    }
  }, [location.state]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      console.log('Cancelling booking:', bookingId);
      await cancelBooking(bookingId);
      
      // Refetch bookings to ensure consistency with server state
      await fetchBookings();
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingBookings = bookings.filter(booking =>
    booking.status === 'confirmed' || booking.status === 'pending'
  );
  const pastBookings = bookings.filter(booking =>
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted/50 rounded animate-pulse w-48" />
          <div className="h-10 bg-muted/50 rounded animate-pulse w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('nav.bookings')}</h1>
        <Button onClick={() => navigate('/app/booking')} className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4 mr-2" />
          {t('home.bookNow')}
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            History ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">No upcoming bookings</p>
              <Button onClick={() => navigate('/app/booking')}>
                {t('home.bookNow')}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No past bookings</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}