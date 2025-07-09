import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import LocationInput from '../components/LocationInput';

const AddAnimal = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    if (!location) {
      toast.error('Please select a location');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      // Add location
      formData.append('location', JSON.stringify(location));

      // Add images
      images.forEach((image, index) => {
        formData.append('photos', image);
      });

      const response = await axios.post('/api/animals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Animal listing created successfully!');
      navigate(`/animals/${response.data.animal._id}`);
    } catch (error) {
      console.error('Error creating animal listing:', error);
      toast.error(error.response?.data?.error || 'Error creating listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Help a Stray Find Home
          </h1>
          <p className="text-xl text-gray-600">
            Report a stray animal and help them find their forever family
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Animal Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal Type *
              </label>
              <select
                {...register('type', { required: 'Please select animal type' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select animal type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (if known)
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter animal's name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breed (if known)
                </label>
                <input
                  type="text"
                  {...register('breed')}
                  placeholder="Enter breed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (estimate)
                </label>
                <select
                  {...register('age')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select age</option>
                  <option value="puppy/kitten">Puppy/Kitten</option>
                  <option value="young">Young</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  {...register('size')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  {...register('color')}
                  placeholder="Enter color/markings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Photos */}
            <ImageUpload onImagesChange={setImages} />

            {/* Location */}
            <LocationInput onLocationSelect={setLocation} />

            {/* Current Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location/Collection Point
              </label>
              <input
                type="text"
                {...register('currentLocation')}
                placeholder="Where can this animal be found now?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe the animal's appearance, temperament, and any other relevant details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Notes
              </label>
              <textarea
                {...register('specialNotes')}
                rows={3}
                placeholder="Any special circumstances, behavioral notes, or important information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Medical Needs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Needs
              </label>
              <textarea
                {...register('medicalNeeds')}
                rows={3}
                placeholder="Any visible injuries, medical conditions, or veterinary needs..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('urgent')}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    This is an urgent situation
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Check if the animal needs immediate help
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('needsFoster')}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Foster home needed
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Check if temporary foster care is needed
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddAnimal;