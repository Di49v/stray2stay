import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart, AlertTriangle } from 'lucide-react';

const AnimalCard = ({ animal }) => {
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
        return 'Available';
      case 'under_consideration':
        return 'Under Review';
      case 'adopted':
        return 'Adopted';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={animal.photos[0]}
          alt={animal.name || `${animal.type} looking for home`}
          className="w-full h-48 object-cover"
        />
        {animal.urgent && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Urgent</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
            {getStatusText(animal.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
          </h3>
          <span className="text-sm text-gray-500 capitalize">{animal.type}</span>
        </div>
        
        {animal.breed && (
          <p className="text-sm text-gray-600 mb-2">{animal.breed}</p>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{animal.location.address}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>Posted {formatDate(animal.createdAt)}</span>
        </div>
        
        {animal.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {animal.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {animal.needsFoster && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Heart className="h-3 w-3 mr-1" />
                Foster Needed
              </span>
            )}
            {animal.medicalNeeds && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Medical Care
              </span>
            )}
          </div>
          
          <Link
            to={`/animals/${animal._id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;