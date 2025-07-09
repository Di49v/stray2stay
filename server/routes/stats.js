import express from 'express';
import Animal from '../models/Animal.js';
import User from '../models/User.js';

const router = express.Router();

// Get overall platform statistics
router.get('/', async (req, res) => {
  try {
    const totalAnimals = await Animal.countDocuments();
    const totalAdoptions = await Animal.countDocuments({ status: 'adopted' });
    const totalUsers = await User.countDocuments();
    const availableAnimals = await Animal.countDocuments({ status: 'available' });
    const urgentAnimals = await Animal.countDocuments({ urgent: true, status: 'available' });
    
    // Get adoption rate by month for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const adoptionsByMonth = await Animal.aggregate([
      {
        $match: {
          status: 'adopted',
          adoptionDate: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$adoptionDate' },
            month: { $month: '$adoptionDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get animals by type
    const animalsByType = await Animal.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          adopted: {
            $sum: { $cond: [{ $eq: ['$status', 'adopted'] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Get top cities by rescues
    const topCities = await Animal.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json({
      overview: {
        totalAnimals,
        totalAdoptions,
        totalUsers,
        availableAnimals,
        urgentAnimals,
        adoptionRate: totalAnimals > 0 ? ((totalAdoptions / totalAnimals) * 100).toFixed(1) : 0
      },
      charts: {
        adoptionsByMonth,
        animalsByType,
        topCities
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get animals for map display
router.get('/map', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    
    const animals = await Animal.find(filter)
      .select('type status location photos name urgent needsFoster')
      .limit(1000); // Limit for performance
    
    res.json({ animals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;