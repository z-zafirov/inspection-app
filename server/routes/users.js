// User routes
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/users - Get users (admin/manager only)
router.get('/', authMiddleware, requireRole('admin', 'manager'), async (req, res) => {
  try {
    const { role } = req.query;

    let query = supabase
      .from('users')
      .select('id, email, full_name, role, restaurant_id')
      .order('full_name');

    // Filter by role if provided
    if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Users query error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        role: u.role,
        restaurantId: u.restaurant_id
      }))
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching users'
    });
  }
});

module.exports = router;
