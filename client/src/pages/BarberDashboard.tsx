import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, User, Mail, Phone, Edit, Trash2, Plus, Save, X } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  id: number;
  customer: Customer;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

interface AvailabilitySlot {
  id?: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const BarberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'availability' | 'profile'>('appointments');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<AvailabilitySlot | null>(null);
  
  // Form states
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [newAvailability, setNewAvailability] = useState<AvailabilitySlot>({
    date: '',
    start_time: '',
    end_time: '',
    is_available: true
  });

  useEffect(() => {
    fetchBarberData();
  }, []);

  const fetchBarberData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch barber's bookings
      const bookingsResponse = await fetch('/api/barber/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
      
      // Fetch barber's availability
      const availabilityResponse = await fetch('/api/barber/availability', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setAvailability(availabilityData);
      }
      
    } catch (err) {
      setError('Failed to fetch barber data');
      console.error('Error fetching barber data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await fetchBarberData();
      } else {
        setError('Failed to update booking status');
      }
    } catch (err) {
      setError('Error updating booking status');
      console.error('Error updating booking status:', err);
    }
  };

  const handleContactCustomer = async () => {
    if (!selectedBooking || !contactSubject.trim() || !contactMessage.trim()) {
      setError('Please fill in all contact fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/barber/contact-customer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          customer_email: selectedBooking.customer.email,
          subject: contactSubject,
          message: contactMessage
        })
      });

      if (response.ok) {
        setShowContactModal(false);
        setContactSubject('');
        setContactMessage('');
        setSelectedBooking(null);
        // Show success message
        alert('Message sent successfully!');
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
      console.error('Error sending message:', err);
    }
  };

  const handleSaveAvailability = async () => {
    if (!newAvailability.date || !newAvailability.start_time || !newAvailability.end_time) {
      setError('Please fill in all availability fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingAvailability 
        ? `/api/barber/availability/${editingAvailability.id}` 
        : '/api/barber/availability';
      const method = editingAvailability ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAvailability)
      });

      if (response.ok) {
        await fetchBarberData();
        setShowAvailabilityModal(false);
        setEditingAvailability(null);
        setNewAvailability({
          date: '',
          start_time: '',
          end_time: '',
          is_available: true
        });
      } else {
        setError('Failed to save availability');
      }
    } catch (err) {
      setError('Error saving availability');
      console.error('Error saving availability:', err);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/barber/availability/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBarberData();
      } else {
        setError('Failed to delete availability');
      }
    } catch (err) {
      setError('Error deleting availability');
      console.error('Error deleting availability:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Barber Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'appointments', label: 'Appointments', icon: Calendar },
              { key: 'availability', label: 'Availability', icon: Clock },
              { key: 'profile', label: 'Profile', icon: User }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Appointments</h2>
              <div className="text-sm text-gray-500">
                Total appointments: {bookings.length}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any appointments yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{booking.customer.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {booking.customer.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {booking.customer.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Service</p>
                            <p className="text-gray-900">{booking.service.name}</p>
                            <p className="text-sm text-gray-500">${booking.service.price} • {booking.service.duration} min</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date & Time</p>
                            <p className="text-gray-900">{formatDate(booking.date)}</p>
                            <p className="text-sm text-gray-500">{formatTime(booking.time)}</p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700">Notes</p>
                            <p className="text-gray-900">{booking.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500">
                            Booked on {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowContactModal(true);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Availability</h2>
              <button
                onClick={() => {
                  setEditingAvailability(null);
                  setNewAvailability({
                    date: '',
                    start_time: '',
                    end_time: '',
                    is_available: true
                  });
                  setShowAvailabilityModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Availability</span>
              </button>
            </div>

            {availability.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No availability set</h3>
                <p className="mt-1 text-sm text-gray-500">Add your available time slots to start accepting bookings.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availability.map((slot) => (
                  <div key={slot.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{formatDate(slot.date)}</h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                          slot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {slot.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingAvailability(slot);
                            setNewAvailability(slot);
                            setShowAvailabilityModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => slot.id && handleDeleteAvailability(slot.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
                </div>
                {user?.specialties && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialties</label>
                    <p className="mt-1 text-gray-900">{user.specialties}</p>
                  </div>
                )}
                {user?.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <p className="mt-1 text-gray-900">{user.bio}</p>
                  </div>
                )}
                {user?.experience && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="mt-1 text-gray-900">{user.experience} years</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAvailability ? 'Edit Availability' : 'Add Availability'}
                </h3>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newAvailability.date}
                    onChange={(e) => setNewAvailability({...newAvailability, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newAvailability.start_time}
                    onChange={(e) => setNewAvailability({...newAvailability, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newAvailability.end_time}
                    onChange={(e) => setNewAvailability({...newAvailability, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={newAvailability.is_available}
                    onChange={(e) => setNewAvailability({...newAvailability, is_available: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                    Available for bookings
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvailability}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Customer Modal */}
      {showContactModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact {selectedBooking.customer.name}
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Enter subject..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactCustomer}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberDashboard;
