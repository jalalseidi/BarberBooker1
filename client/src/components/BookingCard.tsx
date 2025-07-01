import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar, Clock, DollarSign, X } from "lucide-react";
import { Booking } from "@/api/bookings";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { enUS, tr } from "date-fns/locale";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { t, i18n } = useTranslation();

  const serviceName = i18n.language === 'tr' ? booking.service.nameTr : booking.service.nameEn;
  const locale = i18n.language === 'tr' ? tr : enUS;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={booking.barber.profilePhoto} alt={booking.barber.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {booking.barber.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {serviceName}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {t('common.with')} {booking.barber.name}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getStatusColor(booking.status)} className="text-xs">
            {t(`status.${booking.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{booking.time}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>${booking.totalPrice}</span>
          </div>
          {onCancel && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(booking._id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-1" />
              {t('common.cancel')}
            </Button>
          )}
        </div>
        {booking.specialRequests && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <strong>{t('booking.specialRequests')}:</strong> {booking.specialRequests}
          </div>
        )}
      </CardContent>
    </Card>
  );
}