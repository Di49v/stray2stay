import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, MapPin, Users, Star } from 'lucide-react';
import axios from 'axios';
import AnimalCard from '../components/AnimalCard';

const Home = () => {
  const [featuredAnimals, setFeaturedAnimals] = useState([]);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    totalAdoptions: 0,
    totalUsers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    fetchFeaturedAnimals();
    fetchStats();
  }, []);

  const fetchFeaturedAnimals = async () => {
    try {
      const response = await axios.get('/api/animals?limit=6&status=available');
      setFeaturedAnimals(response.data.animals);
    } catch (error) {
      console.error('Error fetching featured animals:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data.overview);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (searchType) params.set('type', searchType);
    
    window.location.href = `/animals?${params.toString()}`;
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Thanks to Stray2Stay, I found my best friend Max! The process was so smooth and the team was incredibly helpful.",
      rating: 5
    },
    {
      name: "Michael Chen",
      text: "I've helped rescue 3 animals through this platform. It's amazing how easy it is to make a difference.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      text: "The community here is wonderful. Everyone is so passionate about helping animals find homes.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Helping Strays Find
              <span className="text-orange-500"> Forever Homes</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join our community of animal lovers making a difference. Report strays, connect with adopters, and help create safer communities for everyone.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                to="/add-animal" 
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Help a Stray</span>
              </Link>
              <Link 
                to="/animals" 
                className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Adopt a Friend</span>
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.form 
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <input
                type="text"
                placeholder="Search by location, breed, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 border-0 focus:outline-none focus:ring-0 bg-transparent"
              >
                <option value="">All Animals</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
              </select>
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalAnimals}</div>
              <div className="text-gray-600">Animals Rescued</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalAdoptions}</div>
              <div className="text-gray-600">Successful Adoptions</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="text-gray-600">Active Members</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Animals Looking for Homes
            </h2>
            <p className="text-xl text-gray-600">
              These beautiful animals are waiting for their forever families
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAnimals.map((animal) => (
              <motion.div
                key={animal._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <AnimalCard animal={animal} />
              </motion.div>
            ))}
          </div>
          
          {featuredAnimals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No animals available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/animals"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Animals</span>
              <Search className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our amazing community members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
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
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of animal lovers helping strays find their forever homes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Get Started Today
              </Link>
              <Link 
                to="/impact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                See Our Impact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;