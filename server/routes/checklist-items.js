// Checklist items routes
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/checklist-items - Get all active checklist items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('checklist_items')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('display_order');

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Checklist items query error:', error);
      return res.status(500).json({ error: 'Failed to fetch checklist items' });
    }

    res.json({
      success: true,
      items: items.map(item => ({
        id: item.id,
        category: item.category,
        itemName: item.item_name,
        description: item.description,
        displayOrder: item.display_order
      }))
    });

  } catch (error) {
    console.error('Get checklist items error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching checklist items'
    });
  }
});

module.exports = router;
