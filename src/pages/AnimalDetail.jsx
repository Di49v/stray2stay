import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Heart, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    message: '',
    contactInfo: ''
  });

  useEffect(() => {
    fetchAnimalDetails();
  }, [id]);

  const fetchAnimalDetails = async () => {
    try {
      const response = await axios.get(`/api/animals/${id}`);
      setAnimal(response.data);
    } catch (error) {
      console.error('Error fetching animal details:', error);
      toast.error('Error loading animal details');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to express interest');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/animals/${id}/interest`, contactForm);
      toast.success('Interest expressed successfully!');
      setShowContactForm(false);
      setContactForm({ message: '', contactInfo: '' });
      fetchAnimalDetails(); // Refresh to show updated interested users
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error expressing interest');
    }
  };

  const handleMarkAsAdopted = async (adopterId) => {
    try {
      await axios.patch(`/api/animals/${id}/adopt`, { adopterId });
      toast.success('Animal marked as adopted!');
      fetchAnimalDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error marking as adopted');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`/api/animals/${id}`);
        toast.success('Animal listing deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error deleting listing');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'under_consideration':
        return 'bg-yellow-100 text-yellow-800';
      case 'adopted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available for Adoption';
      case 'under_consideration':
        return 'Under Consideration';
      case 'adopted':
        return 'Adopted';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Animal Not Found</h2>
          <button
            onClick={() => navigate('/animals')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Animals
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && animal.posterId._id === user.id;
  const canExpressInterest = user && !isOwner && animal.status === 'available';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={animal.photos[0]}
                  alt={animal.name || `${animal.type} looking for home`}
                  className="w-full h-96 object-cover"
                />
              </div>
              {animal.photos.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {animal.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${animal.name || animal.type} ${index + 2}`}
                        className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(animal.status)}`}>
                    {getStatusText(animal.status)}
                  </span>
                  {animal.urgent && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Urgent</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="text-lg font-medium text-gray-900 capitalize">{animal.type}</p>
                </div>
                {animal.breed && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Breed</label>
                    <p className="text-lg font-medium text-gray-900">{animal.breed}</p>
                  </div>
                )}
                {animal.age && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Age</label>
                    <p className="text-lg font-medium text-gray-900 capitalize">{animal.age}</p>
                  </div>
                )}
                {animal.gender && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-lg font-medium text-gray-900 capitalize">{animal.gender}</p>
                  </div>
                )}
                {animal.size && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Size</label>
                    <p className="text-lg font-medium text-gray-900 capitalize">{animal.size}</p>
                  </div>
                )}
                {animal.color && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Color</label>
                    <p className="text-lg font-medium text-gray-900">{animal.color}</p>
                  </div>
                )}
              </div>

              {animal.description && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{animal.description}</p>
                </div>
              )}

              {animal.specialNotes && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Special Notes</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{animal.specialNotes}</p>
                </div>
              )}

              {animal.medicalNeeds && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Medical Needs</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{animal.medicalNeeds}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6">
                {animal.needsFoster && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <Heart className="h-4 w-4 mr-1" />
                    Foster Needed
                  </span>
                )}
                {animal.urgent && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Urgent Care
                  </span>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <MapPin className="h-5 w-5" />
                  <span>Found at: {animal.location.address}</span>
                </div>
                {animal.currentLocation && (
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <MapPin className="h-5 w-5" />
                    <span>Currently at: {animal.currentLocation}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span>Posted {new Date(animal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted By</h3>
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{animal.posterId.name}</p>
                  <p className="text-sm text-gray-500">{animal.posterId.location}</p>
                </div>
              </div>
              
              {isOwner && (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/edit-animal/${animal._id}`)}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Listing</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Listing</span>
                  </button>
                </div>
              )}
            </div>

            {/* Adoption Action */}
            {canExpressInterest && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in Adopting?</h3>
                {!showContactForm ? (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Express Interest</span>
                  </button>
                ) : (
                  <form onSubmit={handleExpressInterest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell them why you'd be a great match..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Information
                      </label>
                      <input
                        type="text"
                        value={contactForm.contactInfo}
                        onChange={(e) => setContactForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                        placeholder="Phone number or email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Send Message
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Interested Users (for owner) */}
            {isOwner && animal.interestedUsers && animal.interestedUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Interested Adopters ({animal.interestedUsers.length})
                </h3>
                <div className="space-y-4">
                  {animal.interestedUsers.map((interest, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{interest.user.name}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(interest.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{interest.message}</p>
                      <p className="text-sm text-gray-500">Contact: {interest.contactInfo}</p>
                      {animal.status === 'available' && (
                        <button
                          onClick={() => handleMarkAsAdopted(interest.user._id)}
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Mark as Adopted
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adoption Info */}
            {animal.status === 'adopted' && animal.adopterId && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adoption Information</h3>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-gray-700 mb-2">This animal has found their forever home!</p>
                  <p className="text-sm text-gray-500">
                    Adopted on {new Date(animal.adoptionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;