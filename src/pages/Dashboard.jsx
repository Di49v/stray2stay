import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Heart, 
  PlusCircle, 
  BarChart3, 
  Calendar, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      rescues: 0,
      adoptions: 0,
      pending: 0
    },
    recentActivity: {
      rescues: [],
      adoptions: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnimal = async (animalId) => {
    if (window.confirm('Are you sure you want to delete this animal listing?')) {
      try {
        await axios.delete(`/api/animals/${animalId}`);
        toast.success('Animal listing deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Error deleting animal listing');
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
        return 'Available';
      case 'under_consideration':
        return 'Under Review';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Here's your impact summary and recent activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Animals Rescued</p>
                <p className="text-3xl font-bold text-orange-500">{dashboardData.stats.rescues}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Heart className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Adoptions</p>
                <p className="text-3xl font-bold text-green-500">{dashboardData.stats.adoptions}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Adoptions</p>
                <p className="text-3xl font-bold text-blue-500">{dashboardData.stats.pending}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/add-animal"
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <PlusCircle className="h-6 w-6 text-orange-500" />
              <span className="font-medium text-gray-900">Report a Stray</span>
            </Link>
            <Link
              to="/animals"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Heart className="h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-900">Browse Animals</span>
            </Link>
            <Link
              to="/impact"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-blue-500" />
              <span className="font-medium text-gray-900">View Impact</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('rescues')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'rescues' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                My Rescues
              </button>
              <button
                onClick={() => setActiveTab('adoptions')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'adoptions' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                My Adoptions
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Rescues */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Rescues</h3>
                {dashboardData.recentActivity.rescues.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentActivity.rescues.map((animal) => (
                      <div key={animal._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={animal.photos[0]}
                          alt={animal.name || animal.type}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(animal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                          {getStatusText(animal.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent rescues</p>
                )}
              </div>

              {/* Recent Adoptions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Adoptions</h3>
                {dashboardData.recentActivity.adoptions.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.recentActivity.adoptions.map((animal) => (
                      <div key={animal._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={animal.photos[0]}
                          alt={animal.name || animal.type}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Adopted {new Date(animal.adoptionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Heart className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent adoptions</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rescues' && (
            <div className="space-y-4">
              {dashboardData.recentActivity.rescues.length > 0 ? (
                dashboardData.recentActivity.rescues.map((animal) => (
                  <div key={animal._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={animal.photos[0]}
                      alt={animal.name || animal.type}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.status)}`}>
                          {getStatusText(animal.status)}
                        </span>
                        {animal.urgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Posted {new Date(animal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/animals/${animal._id}`}
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteAnimal(animal._id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't rescued any animals yet</p>
                  <Link
                    to="/add-animal"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Report Your First Rescue
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'adoptions' && (
            <div className="space-y-4">
              {dashboardData.recentActivity.adoptions.length > 0 ? (
                dashboardData.recentActivity.adoptions.map((animal) => (
                  <div key={animal._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={animal.photos[0]}
                      alt={animal.name || animal.type}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {animal.name || `${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}`}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Adopted {new Date(animal.adoptionDate).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>From {animal.posterId.name} in {animal.posterId.location}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Heart className="h-6 w-6 text-green-500 mx-auto mb-1" />
                      <span className="text-xs text-green-600 font-medium">Adopted</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't adopted any animals yet</p>
                  <Link
                    to="/animals"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Browse Available Animals
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;