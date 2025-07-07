import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ServiceCard } from "@/components/ServiceCard";
import { BarberCard } from "@/components/BarberCard";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon } from "lucide-react";
import { getServices, Service } from "@/api/services";
import { getBarbers, getBarberAvailability, Barber } from "@/api/barbers";
import { createBooking, CreateBookingRequest } from "@/api/bookings";
import { useToast } from "@/hooks/useToast";
import { format } from "date-fns";

type BookingStep = 'service' | 'barber' | 'datetime' | 'confirm';

export function Booking() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const state = location.state as any;
    if (state?.selectedService) {
      setSelectedService(state.selectedService);
      setCurrentStep('barber');
    }
    if (state?.selectedBarber) {
      setSelectedBarber(state.selectedBarber);
      if (selectedService) {
        setCurrentStep('datetime');
      }
    }
  }, [location.state, selectedService]);

  useEffect(() => {
    if (currentStep === 'service') {
      fetchServices();
    } else if (currentStep === 'barber') {
      fetchBarbers();
    }
  }, [currentStep]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchAvailability();
    }
  }, [selectedBarber, selectedDate]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices();
      setServices(data.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      setIsLoading(true);
      const data = await getBarbers();
      setBarbers(data.data.barbers);
    } catch (error) {
      console.error('Error fetching barbers:', error);
      toast({
        title: "Error",
        description: "Failed to load barbers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedBarber || !selectedDate) return;

    try {
      setIsLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const data = await getBarberAvailability(selectedBarber._id, dateString);
      setAvailableSlots(data.data.availableSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('barber');
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setCurrentStep('datetime');
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please complete all booking details",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const bookingData: CreateBookingRequest = {
        serviceId: selectedService._id,
        barberId: selectedBarber._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        specialRequests: specialRequests || undefined,
      };

      console.log('Creating booking:', bookingData);
      const result = await createBooking(bookingData);

      // Check if the response indicates success
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Booking created successfully!",
        });

        navigate('/app/bookings', { state: { refresh: true } });
      } else {
        // This shouldn't happen due to error handling in the API function,
        // but just in case the API returns a success: false response
        toast({
          title: "Error",
          description: result.error?.message || "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);

      // Extract error message from the error object
      let errorMessage = "Failed to create booking. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      // Show a more detailed error message to the user
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });

      // If the error is related to database connection, show a more helpful message
      if (errorMessage.includes('database') || errorMessage.includes('MongoDB')) {
        toast({
          title: "Database Error",
          description: "There seems to be an issue with our database. Please try again later or contact support.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'service': return selectedService !== null;
      case 'barber': return selectedBarber !== null;
      case 'datetime': return selectedDate !== undefined && selectedTime !== null;
      case 'confirm': return true;
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'service': return t('booking.selectService');
      case 'barber': return t('booking.selectBarber');
      case 'datetime': return t('booking.selectTime');
      case 'confirm': return t('booking.confirmBooking');
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'service':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onSelect={handleServiceSelect}
              />
            ))}
          </div>
        );

      case 'barber':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Selected Service:</h3>
              <p className="text-sm text-muted-foreground">
                {selectedService?.nameEn} - ${selectedService?.price} ({selectedService?.duration} min)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber._id}
                  barber={barber}
                  onSelect={handleBarberSelect}
                />
              ))}
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Service: {selectedService?.nameEn}</p>
                  <p>Barber: {selectedBarber?.name}</p>
                  <p>Duration: {selectedService?.duration} minutes</p>
                  <p>Price: ${selectedService?.price}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Times</CardTitle>
                    <CardDescription>
                      {format(selectedDate, 'PPPP')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimeSlotGrid
                      availableSlots={availableSlots}
                      selectedSlot={selectedTime}
                      onSelectSlot={handleTimeSelect}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  {t('booking.confirmBooking')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Service</h4>
                      <p className="text-muted-foreground">{selectedService?.nameEn}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Barber</h4>
                      <p className="text-muted-foreground">{selectedBarber?.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Date & Time</h4>
                      <p className="text-muted-foreground">
                        {selectedDate && format(selectedDate, 'PPP')} at {selectedTime}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Duration</h4>
                      <p className="text-muted-foreground">{selectedService?.duration} minutes</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Price</h4>
                      <p className="text-2xl font-bold text-primary">${selectedService?.price}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('booking.specialRequests')}</h4>
                  <Textarea
                    placeholder="Any special requests or notes..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">{getStepTitle()}</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 py-4">
        {(['service', 'barber', 'datetime', 'confirm'] as BookingStep[]).map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep === step
                  ? 'bg-primary text-primary-foreground'
                  : index < (['service', 'barber', 'datetime', 'confirm'] as BookingStep[]).indexOf(currentStep)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${
                  index < (['service', 'barber', 'datetime', 'confirm'] as BookingStep[]).indexOf(currentStep)
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {isLoading && currentStep !== 'datetime' ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            const steps: BookingStep[] = ['service', 'barber', 'datetime', 'confirm'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex > 0) {
              setCurrentStep(steps[currentIndex - 1]);
            }
          }}
          disabled={currentStep === 'service'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        {currentStep === 'confirm' ? (
          <Button
            onClick={handleSubmitBooking}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {t('booking.confirmBooking')}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const steps: BookingStep[] = ['service', 'barber', 'datetime', 'confirm'];
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1]);
              }
            }}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {t('common.next')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
