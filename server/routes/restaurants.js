// Restaurant routes
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/restaurants/me - Get current user's restaurant(s)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only restaurant owners have associated restaurants
    if (userRole !== 'restaurant_owner') {
      return res.status(403).json({
        error: 'Only restaurant owners can access this endpoint'
      });
    }

    // Get user's restaurant ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('restaurant_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.restaurant_id) {
      return res.status(404).json({ error: 'No restaurant associated with this user' });
    }

    // Get restaurant details
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', user.restaurant_id)
      .single();

    if (restaurantError) {
      console.error('Restaurant query error:', restaurantError);
      return res.status(500).json({ error: 'Failed to fetch restaurant' });
    }

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({
      success: true,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        postalCode: restaurant.postal_code,
        phone: restaurant.phone,
        email: restaurant.email,
        status: restaurant.status,
        categories: {
          kitchen: restaurant.kitchen_enabled,
          bar: restaurant.bar_enabled,
          mainHall: restaurant.main_hall_enabled
        },
        createdAt: restaurant.created_at
      }
    });

  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching restaurant'
    });
  }
});

// GET /api/restaurants - Get all restaurants (admin/manager only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userRole = req.user.role;

    // Only admins and managers can view all restaurants
    if (!['admin', 'manager'].includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }

    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (error) {
      console.error('Restaurants query error:', error);
      return res.status(500).json({ error: 'Failed to fetch restaurants' });
    }

    res.json({
      success: true,
      restaurants: restaurants.map(r => ({
        id: r.id,
        name: r.name,
        address: r.address,
        city: r.city,
        postalCode: r.postal_code,
        phone: r.phone,
        email: r.email,
        status: r.status,
        categories: {
          kitchen: r.kitchen_enabled,
          bar: r.bar_enabled,
          mainHall: r.main_hall_enabled
        }
      }))
    });

  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching restaurants'
    });
  }
});

module.exports = router;
