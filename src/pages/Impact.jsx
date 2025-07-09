import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Users, BarChart3, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';

const Impact = () => {
  const [stats, setStats] = useState({
    overview: {
      totalAnimals: 0,
      totalAdoptions: 0,
      totalUsers: 0,
      availableAnimals: 0,
      urgentAnimals: 0,
      adoptionRate: 0
    },
    charts: {
      adoptionsByMonth: [],
      animalsByType: [],
      topCities: []
    }
  });
  const [mapAnimals, setMapAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapFilters, setMapFilters] = useState({
    status: '',
    type: ''
  });

  useEffect(() => {
    fetchStats();
    fetchMapAnimals();
  }, []);

  useEffect(() => {
    fetchMapAnimals();
  }, [mapFilters]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapAnimals = async () => {
    try {
      const params = new URLSearchParams(mapFilters);
      const response = await axios.get(`/api/stats/map?${params.toString()}`);
      setMapAnimals(response.data.animals);
    } catch (error) {
      console.error('Error fetching map animals:', error);
    }
  };

  const getMonthName = (monthData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthData._id.month - 1];
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Thanks to Stray2Stay, I found my best friend Max! The process was so smooth and the community is amazing.",
      image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Michael Chen",
      text: "I've helped rescue 3 animals through this platform. It's incredible how easy it is to make a difference.",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Emily Rodriguez",
      text: "The community here is wonderful. Everyone is passionate about helping animals find homes.",
      image: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "David Park",
      text: "I adopted Luna through Stray2Stay and she's brought so much joy to our family. Highly recommend!",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Impact Together
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              See how our community is making a difference in the lives of stray animals and creating safer communities everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.overview.totalAnimals}</div>
              <div className="text-gray-600">Animals Rescued</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.overview.totalAdoptions}</div>
              <div className="text-gray-600">Successful Adoptions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.overview.totalUsers}</div>
              <div className="text-gray-600">Active Heroes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.overview.adoptionRate}%</div>
              <div className="text-gray-600">Adoption Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Progress Over Time
            </h2>
            <p className="text-xl text-gray-600">
              Tracking our collective impact and growth
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Adoptions by Month */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Adoptions</h3>
              <div className="h-64 flex items-end space-x-2">
                {stats.charts.adoptionsByMonth.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-orange-500 rounded-t-lg mb-2"
                      style={{ height: `${(month.count / Math.max(...stats.charts.adoptionsByMonth.map(m => m.count))) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600">{getMonthName(month)}</span>
                    <span className="text-xs text-gray-900 font-medium">{month.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Animals by Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Animals by Type</h3>
              <div className="space-y-4">
                {stats.charts.animalsByType.map((type, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700 capitalize">
                      {type._id}s
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-orange-500 h-4 rounded-full"
                        style={{ width: `${(type.total / Math.max(...stats.charts.animalsByType.map(t => t.total))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {type.total} rescued, {type.adopted} adopted
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Reach Across Communities
            </h2>
            <p className="text-xl text-gray-600">
              See where our impact is making a difference
            </p>
          </div>

          {/* Map Filters */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <select
                value={mapFilters.status}
                onChange={(e) => setMapFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
              </select>
              <select
                value={mapFilters.type}
                onChange={(e) => setMapFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
              </select>
            </div>
          </div>

          {/* Mock Map */}
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-8">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map showing {mapAnimals.length} animals</p>
              <p className="text-sm text-gray-500">Google Maps integration would display animal locations here</p>
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Cities by Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.charts.topCities.map((city, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 rounded-full p-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{city._id || 'Unknown City'}</p>
                    <p className="text-sm text-gray-600">{city.count} animals rescued</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our amazing community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Heart key={i} className="h-4 w-4 text-orange-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of the Solution
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Every animal deserves a chance at a loving home. Join us in making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors">
                Start Helping Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Impact;