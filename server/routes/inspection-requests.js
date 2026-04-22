// Inspection request routes
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');

// POST /api/inspection-requests - Create new inspection request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, preferredDate, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate input
    if (!restaurantId || !preferredDate) {
      return res.status(400).json({
        error: 'Restaurant ID and preferred date are required'
      });
    }

    // Restaurant owners can only request for their own restaurant
    if (userRole === 'restaurant_owner') {
      const { data: user } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', userId)
        .single();

      if (user.restaurant_id !== restaurantId) {
        return res.status(403).json({
          error: 'You can only request inspections for your own restaurant'
        });
      }
    }

    // Create inspection request
    const { data: request, error: insertError } = await supabase
      .from('inspection_requests')
      .insert({
        restaurant_id: restaurantId,
        requested_by: userId,
        requested_date: new Date().toISOString(),
        preferred_date: preferredDate,
        status: 'pending',
        notes: notes || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create inspection request' });
    }

    res.status(201).json({
      success: true,
      message: 'Inspection request created successfully',
      request: {
        id: request.id,
        restaurantId: request.restaurant_id,
        requestedBy: request.requested_by,
        requestedDate: request.requested_date,
        preferredDate: request.preferred_date,
        status: request.status,
        notes: request.notes
      }
    });

  } catch (error) {
    console.error('Create inspection request error:', error);
    res.status(500).json({
      error: 'An error occurred while creating inspection request'
    });
  }
});

// GET /api/inspection-requests - Get inspection requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, restaurantId } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    let query = supabase
      .from('inspection_requests')
      .select(`
        *,
        restaurant:restaurants(id, name, address, city),
        requester:users!requested_by(id, email, full_name),
        inspector:users!assigned_inspector_id(id, email, full_name),
        manager:users!assigned_by(id, email, full_name)
      `)
      .order('requested_date', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by restaurant if provided
    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId);
    }

    // Restaurant owners can only see their own requests
    if (userRole === 'restaurant_owner') {
      const { data: user } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', userId)
        .single();

      query = query.eq('restaurant_id', user.restaurant_id);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ error: 'Failed to fetch inspection requests' });
    }

    res.json({
      success: true,
      requests: requests.map(r => ({
        id: r.id,
        restaurant: r.restaurant,
        requestedBy: r.requester,
        requestedDate: r.requested_date,
        preferredDate: r.preferred_date,
        status: r.status,
        notes: r.notes,
        assignedInspector: r.inspector,
        assignedBy: r.manager,
        scheduledDate: r.scheduled_date,
        assignedAt: r.assigned_at
      }))
    });

  } catch (error) {
    console.error('Get inspection requests error:', error);
    res.status(500).json({
      error: 'An error occurred while fetching inspection requests'
    });
  }
});

// PUT /api/inspection-requests/:id/assign - Assign inspector to request
router.put('/:id/assign', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { inspectorId, scheduledDate } = req.body;
    const managerId = req.user.id;
    const userRole = req.user.role;

    // Only managers can assign inspectors
    if (userRole !== 'manager') {
      return res.status(403).json({
        error: 'Only managers can assign inspectors'
      });
    }

    // Validate input
    if (!inspectorId || !scheduledDate) {
      return res.status(400).json({
        error: 'Inspector ID and scheduled date are required'
      });
    }

    // Verify inspector exists and has correct role
    const { data: inspector, error: inspectorError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', inspectorId)
      .single();

    if (inspectorError || !inspector || inspector.role !== 'inspector') {
      return res.status(400).json({
        error: 'Invalid inspector ID'
      });
    }

    // Update inspection request
    const { data: updated, error: updateError } = await supabase
      .from('inspection_requests')
      .update({
        assigned_inspector_id: inspectorId,
        assigned_by: managerId,
        scheduled_date: scheduledDate,
        assigned_at: new Date().toISOString(),
        status: 'scheduled'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Failed to assign inspector' });
    }

    if (!updated) {
      return res.status(404).json({ error: 'Inspection request not found' });
    }

    // Create corresponding inspection record
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .insert({
        restaurant_id: updated.restaurant_id,
        inspector_id: inspectorId,
        inspection_date: scheduledDate,
        status: 'in_progress',
        sync_status: 'synced'
      })
      .select()
      .single();

    if (inspectionError) {
      console.error('Inspection creation error:', inspectionError);
      // Don't fail the whole request, just log it
    }

    res.json({
      success: true,
      message: 'Inspector assigned successfully',
      request: {
        id: updated.id,
        assignedInspectorId: updated.assigned_inspector_id,
        assignedBy: updated.assigned_by,
        scheduledDate: updated.scheduled_date,
        status: updated.status
      },
      inspectionId: inspection?.id
    });

  } catch (error) {
    console.error('Assign inspector error:', error);
    res.status(500).json({
      error: 'An error occurred while assigning inspector'
    });
  }
});

module.exports = router;
