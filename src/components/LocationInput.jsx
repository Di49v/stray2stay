import React, { useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';

const LocationInput = ({ onLocationSelect, initialLocation = '' }) => {
  const [address, setAddress] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (address.length > 3) {
      searchAddresses(address);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [address]);

  const searchAddresses = async (query) => {
    setLoading(true);
    try {
      // Mock geocoding - in production, use Google Places API
      const mockSuggestions = [
        {
          address: `${query}, New York, NY`,
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        {
          address: `${query}, Los Angeles, CA`,
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        {
          address: `${query}, Chicago, IL`,
          coordinates: { lat: 41.8781, lng: -87.6298 }
        }
      ];
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.address);
    setShowSuggestions(false);
    onLocationSelect(suggestion);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Mock reverse geocoding
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          const location = {
            address: mockAddress,
            coordinates: { lat: latitude, lng: longitude }
          };
          
          setAddress(mockAddress);
          onLocationSelect(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location Found *
      </label>
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address or location"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={loading}
          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-orange-500 transition-colors"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{suggestion.address}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;