// Inspection routes
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/inspections - Get inspections with optional filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, inspectorId, status } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    let query = supabase
      .from('inspections')
      .select(`
        *,
        restaurant:restaurants(id, name, address, city),
        inspector:users!inspector_id(id, email, full_name)
      `)
      .order('inspection_date', { ascending: false });

    // Apply filters
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    if (inspectorId) {
      query = query.eq('inspector_id', inspectorId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Role-based filtering
    if (userRole === 'restaurant_owner') {
      // Owners can only see inspections for their restaurant
      const { data: user } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', userId)
        .single();

      query = query.eq('restaurant_id', user.restaurant_id);
    } else if (userRole === 'inspector') {
      // Inspectors can only see their own inspections
      query = query.eq('inspector_id', userId);
    }

    const { data: inspections, error } = await query;

    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ error: 'Failed to fetch inspections' });
    }

    res.json({
      success: true,
      inspections: inspections.map(i => ({
        id: i.id,
        restaurant: i.restaurant,
        inspector: i.inspector,
        inspectionDate: i.inspection_date,
        overallScore: i.overall_score,
        status: i.status,
        syncStatus: i.sync_status,
        lastSyncedAt: i.last_synced_at,
        notes: i.notes,
        createdAt: i.created_at
      }))
    });

  } catch (error) {
    console.error('Get inspections error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching inspections'
    });
  }
});

// GET /api/inspections/:id - Get single inspection with detailed scores
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Get inspection with related data
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select(`
        *,
        restaurant:restaurants(*),
        inspector:users!inspector_id(id, email, full_name)
      `)
      .eq('id', id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    // Check permissions
    if (userRole === 'restaurant_owner') {
      const { data: user } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', userId)
        .single();

      if (inspection.restaurant_id !== user.restaurant_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (userRole === 'inspector' && inspection.inspector_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get checklist scores
    const { data: scores, error: scoresError } = await supabase
      .from('checklist_scores')
      .select(`
        *,
        checklist_item:checklist_items(*)
      `)
      .eq('inspection_id', id)
      .order('category');

    if (scoresError) {
      console.error('Scores query error:', scoresError);
    }

    res.json({
      success: true,
      inspection: {
        id: inspection.id,
        restaurant: inspection.restaurant,
        inspector: inspection.inspector,
        inspectionDate: inspection.inspection_date,
        overallScore: inspection.overall_score,
        status: inspection.status,
        syncStatus: inspection.sync_status,
        notes: inspection.notes,
        scores: scores || []
      }
    });

  } catch (error) {
    console.error('Get inspection error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching inspection'
    });
  }
});

// POST /api/inspections/:id/scores - Submit checklist scores for inspection
router.post('/:id/scores', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { scores, overallScore, status, notes } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!scores || !Array.isArray(scores)) {
      return res.status(400).json({
        error: 'Scores array is required'
      });
    }

    // Verify inspection exists and belongs to this inspector
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', id)
      .single();

    if (inspectionError || !inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    if (inspection.inspector_id !== userId && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete existing scores for this inspection (in case of re-submission)
    await supabase
      .from('checklist_scores')
      .delete()
      .eq('inspection_id', id);

    // Insert new scores
    const scoresData = scores.map(score => ({
      inspection_id: id,
      checklist_item_id: score.checklistItemId,
      category: score.category,
      score: score.score,
      notes: score.notes || null
    }));

    const { error: scoresError } = await supabase
      .from('checklist_scores')
      .insert(scoresData);

    if (scoresError) {
      console.error('Insert scores error:', scoresError);
      return res.status(500).json({ error: 'Failed to save checklist scores' });
    }

    // Update inspection record
    const updateData = {
      overall_score: overallScore,
      status: status || 'completed',
      notes: notes || null,
      sync_status: 'synced',
      last_synced_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('inspections')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Update inspection error:', updateError);
      return res.status(500).json({ error: 'Failed to update inspection' });
    }

    res.json({
      success: true,
      message: 'Inspection scores saved successfully',
      inspection: {
        id,
        overallScore,
        status: status || 'completed',
        scoresCount: scores.length
      }
    });

  } catch (error) {
    console.error('Submit scores error:', error);
    res.status(500).json({
      error: 'An error occurred while submitting scores'
    });
  }
});

// PUT /api/inspections/:id/sync - Manual sync endpoint
router.put('/:id/sync', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { syncData } = req.body;

    // Update sync status
    const { error } = await supabase
      .from('inspections')
      .update({
        sync_status: 'synced',
        last_synced_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Sync error:', error);
      return res.status(500).json({ error: 'Failed to sync inspection' });
    }

    res.json({
      success: true,
      message: 'Inspection synced successfully'
    });

  } catch (error) {
    console.error('Sync inspection error:', error);
    res.status(500).json({
      error: 'An error occurred while syncing inspection'
    });
  }
});

module.exports = router;
