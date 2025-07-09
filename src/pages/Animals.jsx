import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Heart, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import AnimalCard from '../components/AnimalCard';

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    urgent: false,
    needsFoster: false,
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchAnimals();
  }, [filters, pagination.page]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.urgent) params.set('urgent', 'true');
      if (filters.needsFoster) params.set('needsFoster', 'true');
      params.set('page', pagination.page);
      params.set('limit', pagination.limit);
      
      const response = await axios.get(`/api/animals?${params.toString()}`);
      setAnimals(response.data.animals);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      urgent: false,
      needsFoster: false,
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-gray-600">
            Browse animals looking for loving homes in your area
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="under_consideration">Under Review</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>

            <div className="flex items-center space-x-4 pt-8">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.urgent}
                  onChange={(e) => handleFilterChange('urgent', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                  Urgent
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-4 pt-8">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.needsFoster}
                  onChange={(e) => handleFilterChange('needsFoster', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-purple-500" />
                  Foster Needed
                </span>
              </label>
            </div>

            <div className="flex items-center pt-8">
              <button
                onClick={clearFilters}
                className="text-orange-500 hover:text-orange-600 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {animals.length} of {pagination.total} animals
          </p>
        </div>

        {/* Animals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : animals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animals.map((animal) => (
              <AnimalCard key={animal._id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(pagination.pages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.page
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Animals;