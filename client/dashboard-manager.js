// Manager Dashboard Logic

const API_BASE = '/api';

// Load user data
const userData = JSON.parse(sessionStorage.getItem('user'));
const authToken = sessionStorage.getItem('authToken');

if (!userData || !authToken) {
    window.location.href = 'login.html';
} else if (userData.role !== 'manager') {
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

// Load dashboard data
async function loadDashboard() {
    try {
        // Load all data in parallel
        await Promise.all([
            loadPendingRequests(),
            loadScheduledInspections(),
            loadInspectorWorkload(),
            loadStats()
        ]);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Load statistics
async function loadStats() {
    try {
        const [pendingData, scheduledData, inProgressData, inspectorsData] = await Promise.all([
            apiCall('/inspection-requests?status=pending'),
            apiCall('/inspection-requests?status=scheduled'),
            apiCall('/inspections?status=in_progress'),
            apiCall('/users?role=inspector')
        ]);

        document.getElementById('pendingCount').textContent = pendingData.requests.length;
        document.getElementById('scheduledCount').textContent = scheduledData.requests.length;
        document.getElementById('inProgressCount').textContent = inProgressData.inspections.length;
        document.getElementById('availableInspectors').textContent = inspectorsData.users.length;

    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Load pending inspection requests
async function loadPendingRequests() {
    try {
        const data = await apiCall('/inspection-requests?status=pending');
        const requests = data.requests;

        const tbody = document.getElementById('pendingRequestsBody');

        if (requests.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-gray);">
                        No pending inspection requests
                    </td>
                </tr>
            `;
            document.getElementById('pendingBadge').textContent = '0 Awaiting Assignment';
            return;
        }

        document.getElementById('pendingBadge').textContent = `${requests.length} Awaiting Assignment`;

        tbody.innerHTML = requests.map(request => `
            <tr>
                <td><strong>${request.restaurant.name}</strong></td>
                <td>${request.requestedBy.full_name}</td>
                <td>${new Date(request.requestedDate).toLocaleDateString()}</td>
                <td>${new Date(request.preferredDate).toLocaleDateString()}</td>
                <td>${request.notes || '-'}</td>
                <td>
                    <button class="btn btn-success" onclick="showAssignModal('${request.id}', '${request.restaurant.name}', '${request.preferredDate}')">
                        Assign Inspector
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Failed to load pending requests:', error);
        showError('Failed to load pending requests');
    }
}

// Load scheduled inspections
async function loadScheduledInspections() {
    try {
        const data = await apiCall('/inspection-requests?status=scheduled');
        const requests = data.requests;

        const tbody = document.getElementById('scheduledInspectionsBody');

        if (requests.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-gray);">
                        No scheduled inspections
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = requests.map(request => `
            <tr>
                <td><strong>${request.restaurant.name}</strong></td>
                <td>${request.assignedInspector.full_name}</td>
                <td>${new Date(request.scheduledDate).toLocaleDateString()}</td>
                <td>${new Date(request.assignedAt).toLocaleDateString()}</td>
                <td><span class="badge badge-info">Scheduled</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="reassignInspection('${request.id}')">
                        Reassign
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Failed to load scheduled inspections:', error);
    }
}

// Load inspector workload
async function loadInspectorWorkload() {
    try {
        const [inspectorsData, scheduledData, inProgressData] = await Promise.all([
            apiCall('/users?role=inspector'),
            apiCall('/inspection-requests?status=scheduled'),
            apiCall('/inspections?status=in_progress')
        ]);

        const inspectors = inspectorsData.users;
        const scheduled = scheduledData.requests;
        const inProgress = inProgressData.inspections;

        const tbody = document.getElementById('inspectorWorkloadBody');

        tbody.innerHTML = inspectors.map(inspector => {
            const assignedCount = scheduled.filter(r => r.assignedInspector?.id === inspector.id).length;
            const inProgressCount = inProgress.filter(i => i.inspector.id === inspector.id).length;

            return `
                <tr>
                    <td><strong>${inspector.fullName}</strong></td>
                    <td>${assignedCount}</td>
                    <td>${inProgressCount}</td>
                    <td>-</td>
                    <td><span class="badge badge-success">Available</span></td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Failed to load inspector workload:', error);
    }
}

// Show assign inspector modal
let currentRequestId = null;

async function showAssignModal(requestId, restaurantName, preferredDate) {
    currentRequestId = requestId;

    document.getElementById('modalRestaurantName').textContent = restaurantName;
    document.getElementById('modalPreferredDate').textContent = new Date(preferredDate).toLocaleDateString();

    // Load inspectors
    try {
        const data = await apiCall('/users?role=inspector');
        const inspectors = data.users;

        const select = document.getElementById('inspectorSelect');
        select.innerHTML = '<option value="">Select an inspector...</option>' +
            inspectors.map(i => `<option value="${i.id}">${i.fullName}</option>`).join('');

        // Set default scheduled date to preferred date
        document.getElementById('scheduledDate').value = preferredDate.split('T')[0];

        document.getElementById('assignModal').style.display = 'flex';

    } catch (error) {
        console.error('Failed to load inspectors:', error);
        showError('Failed to load inspectors');
    }
}

// Hide assign modal
function hideAssignModal() {
    document.getElementById('assignModal').style.display = 'none';
    document.getElementById('assignForm').reset();
    currentRequestId = null;
}

// Submit inspector assignment
async function submitAssignment(event) {
    event.preventDefault();

    const inspectorId = document.getElementById('inspectorSelect').value;
    const scheduledDate = document.getElementById('scheduledDate').value;

    if (!inspectorId) {
        showError('Please select an inspector');
        return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Assigning...';

    try {
        await apiCall(`/inspection-requests/${currentRequestId}/assign`, {
            method: 'PUT',
            body: JSON.stringify({
                inspectorId,
                scheduledDate
            })
        });

        hideAssignModal();
        showSuccess('Inspector assigned successfully!');

        // Reload dashboard
        loadDashboard();

    } catch (error) {
        console.error('Failed to assign inspector:', error);
        showError(error.message || 'Failed to assign inspector');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Assign Inspector';
    }
}

// Reassign inspection (placeholder)
function reassignInspection(requestId) {
    alert('Reassign functionality will be implemented in a future update.');
}

// Show success message
function showSuccess(message) {
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

// Set minimum date for scheduled date (today)
const today = new Date().toISOString().split('T')[0];
document.getElementById('scheduledDate').min = today;

// Load initial data
loadDashboard();
