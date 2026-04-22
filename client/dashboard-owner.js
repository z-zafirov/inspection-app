// Restaurant Owner Dashboard Logic

const API_BASE = '/api';

// Load user data
const userData = JSON.parse(sessionStorage.getItem('user'));
const authToken = sessionStorage.getItem('authToken');

if (!userData || !authToken) {
    window.location.href = 'login.html';
} else if (userData.role !== 'restaurant_owner') {
    window.location.href = 'dashboard.html';
}

// API helper with authentication
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    if (response.status === 401) {
        // Token expired, redirect to login
        sessionStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// Load restaurant data
async function loadRestaurantData() {
    try {
        const data = await apiCall('/restaurants/me');
        const restaurant = data.restaurant;

        // Update restaurant info
        document.getElementById('restaurantName').textContent = restaurant.name;
        document.getElementById('restaurantAddress').textContent = restaurant.address;
        document.getElementById('restaurantCity').textContent = `${restaurant.city}, ${restaurant.postalCode}`;
        document.getElementById('restaurantPhone').textContent = restaurant.phone;
        document.getElementById('restaurantEmail').textContent = restaurant.email;

        // Update categories
        const categoriesContainer = document.getElementById('restaurantCategories');
        categoriesContainer.innerHTML = '';

        if (restaurant.categories.kitchen) {
            categoriesContainer.innerHTML += '<span class="badge badge-success">Kitchen</span>';
        }
        if (restaurant.categories.bar) {
            categoriesContainer.innerHTML += '<span class="badge badge-success">Bar</span>';
        }
        if (restaurant.categories.mainHall) {
            categoriesContainer.innerHTML += '<span class="badge badge-success">Main Hall</span>';
        }

        // Store restaurant ID for later use
        window.restaurantData = restaurant;

        // Load inspections for this restaurant
        loadInspections(restaurant.id);

    } catch (error) {
        console.error('Failed to load restaurant:', error);
        showError('Failed to load restaurant data');
    }
}

// Load inspection history
async function loadInspections(restaurantId) {
    try {
        const data = await apiCall(`/inspections?restaurantId=${restaurantId}&status=approved`);
        const inspections = data.inspections;

        // Update stats
        document.getElementById('totalInspections').textContent = inspections.length;

        if (inspections.length > 0) {
            // Calculate average score
            const avgScore = inspections.reduce((sum, i) => sum + (i.overallScore || 0), 0) / inspections.length;
            document.getElementById('averageScore').textContent = avgScore.toFixed(2);

            // Latest score
            const latest = inspections[0];
            document.getElementById('latestScore').textContent = latest.overallScore?.toFixed(2) || 'N/A';

            // Show improvement if there are at least 2 inspections
            if (inspections.length >= 2) {
                const previous = inspections[1];
                const improvement = latest.overallScore - previous.overallScore;
                const improvementEl = document.getElementById('scoreImprovement');

                if (improvement > 0) {
                    improvementEl.innerHTML = `<span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 12px;">
                        ↑ Improved from ${previous.overallScore.toFixed(2)}
                    </span>`;
                } else if (improvement < 0) {
                    improvementEl.innerHTML = `<span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 12px;">
                        ↓ Decreased from ${previous.overallScore.toFixed(2)}
                    </span>`;
                } else {
                    improvementEl.innerHTML = `<span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 12px;">
                        → Same as previous
                    </span>`;
                }
            }

            // Populate inspection history table
            const tbody = document.getElementById('inspectionHistoryBody');
            tbody.innerHTML = inspections.map(inspection => `
                <tr>
                    <td>${new Date(inspection.inspectionDate).toLocaleDateString()}</td>
                    <td>${inspection.inspector.full_name}</td>
                    <td><strong style="color: ${getScoreColor(inspection.overallScore)};">${inspection.overallScore?.toFixed(2) || 'N/A'} / 10</strong></td>
                    <td><span class="badge badge-success">${inspection.status}</span></td>
                    <td><button class="btn btn-secondary" onclick="viewInspectionReport('${inspection.id}')">View Report</button></td>
                </tr>
            `).join('');
        } else {
            // No inspections yet
            document.getElementById('latestScore').textContent = 'N/A';
            document.getElementById('averageScore').textContent = 'N/A';
            document.getElementById('scoreImprovement').innerHTML = '<span style="font-size: 0.875rem;">No inspections yet</span>';

            document.getElementById('inspectionHistoryBody').innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-gray);">
                        No inspection history yet. Request your first inspection!
                    </td>
                </tr>
            `;
        }

        // Check for pending requests
        loadPendingRequests(restaurantId);

    } catch (error) {
        console.error('Failed to load inspections:', error);
        showError('Failed to load inspection history');
    }
}

// Load pending requests
async function loadPendingRequests(restaurantId) {
    try {
        const data = await apiCall(`/inspection-requests?restaurantId=${restaurantId}&status=pending`);
        const pendingCount = data.requests.length;

        document.getElementById('pendingRequests').textContent = pendingCount;

        if (pendingCount > 0) {
            const latestRequest = data.requests[0];
            document.getElementById('nextInspection').innerHTML = `
                <div style="font-size: 1.25rem;">Pending</div>
                <div style="font-size: 0.75rem; margin-top: 0.25rem;">
                    Requested ${new Date(latestRequest.requestedDate).toLocaleDateString()}
                </div>
            `;
        } else {
            document.getElementById('nextInspection').innerHTML = '<div style="font-size: 1.25rem;">Not Scheduled</div>';
        }

    } catch (error) {
        console.error('Failed to load pending requests:', error);
    }
}

// Get color based on score
function getScoreColor(score) {
    if (score >= 7) return '#10b981';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
}

// Show inspection request modal
function showRequestInspectionModal() {
    document.getElementById('requestInspectionModal').style.display = 'flex';
}

// Hide inspection request modal
function hideRequestInspectionModal() {
    document.getElementById('requestInspectionModal').style.display = 'none';
    document.getElementById('requestInspectionForm').reset();
}

// Submit inspection request
async function submitInspectionRequest(event) {
    event.preventDefault();

    const preferredDate = document.getElementById('preferredDate').value;
    const notes = document.getElementById('requestNotes').value;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        await apiCall('/inspection-requests', {
            method: 'POST',
            body: JSON.stringify({
                restaurantId: window.restaurantData.id,
                preferredDate,
                notes
            })
        });

        hideRequestInspectionModal();
        showSuccess('Inspection request submitted successfully!');

        // Reload data
        loadRestaurantData();

    } catch (error) {
        console.error('Failed to submit request:', error);
        showError(error.message || 'Failed to submit inspection request');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Request';
    }
}

// View inspection report (placeholder)
function viewInspectionReport(inspectionId) {
    alert(`Viewing report for inspection ${inspectionId}\n\nDetailed inspection report view will be implemented in Phase 3.`);
}

// Show success message
function showSuccess(message) {
    // Simple alert for now - can be replaced with toast notification
    alert('✓ ' + message);
}

// Show error message
function showError(message) {
    alert('✗ ' + message);
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear();
    window.location.href = '/landing/index.html';
});

// Set user name
document.getElementById('userName').textContent = userData.name;

// Set minimum date for inspection request (tomorrow)
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById('preferredDate').min = tomorrow.toISOString().split('T')[0];

// Load initial data
loadRestaurantData();
