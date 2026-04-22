// Inspector Dashboard
const API_BASE_URL = '/api';
let authToken = null;
let inspections = [];
let isOnline = navigator.onLine;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  authToken = sessionStorage.getItem('authToken');
  const userData = JSON.parse(sessionStorage.getItem('user'));

  if (!authToken || !userData) {
    window.location.href = '/client/login.html';
    return;
  }

  if (userData.role !== 'inspector') {
    window.location.href = '/client/dashboard.html';
    return;
  }

  // Update user name
  document.getElementById('userName').textContent = userData.name;

  // Set up logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Update online status
  updateOnlineStatus();

  // Load inspections
  await loadInspections();

  // Set up online/offline listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

// API call helper
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      window.location.href = '/client/login.html';
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Load inspections
async function loadInspections() {
  try {
    const data = await apiCall('/inspections');

    if (data && data.success) {
      inspections = data.inspections;
      updateStats();
      renderInProgress();
      renderUpcoming();
      renderCompleted();
    }
  } catch (error) {
    console.error('Failed to load inspections:', error);
  }
}

// Update stats
function updateStats() {
  const scheduled = inspections.filter(i => i.status === 'scheduled').length;
  const inProgress = inspections.filter(i => i.status === 'in_progress').length;

  // Completed this month
  const now = new Date();
  const thisMonth = inspections.filter(i => {
    if (i.status !== 'completed') return false;
    const inspectionDate = new Date(i.inspectionDate);
    return inspectionDate.getMonth() === now.getMonth() &&
           inspectionDate.getFullYear() === now.getFullYear();
  }).length;

  // Update stat cards
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards[0]) {
    statCards[0].querySelector('.stat-value').textContent = scheduled;
    statCards[0].querySelector('.stat-change span').textContent =
      scheduled === 1 ? 'Scheduled inspection' : 'Scheduled inspections';
  }
  if (statCards[1]) {
    statCards[1].querySelector('.stat-value').textContent = inProgress;
    statCards[1].querySelector('.stat-change span').textContent =
      inProgress === 1 ? 'Being conducted' : 'Being conducted';
  }
  if (statCards[2]) {
    statCards[2].querySelector('.stat-value').textContent = thisMonth;
  }
}

// Render in-progress inspections
function renderInProgress() {
  const inProgressList = inspections.filter(i => i.status === 'in_progress');

  // Find the In Progress card
  const cards = document.querySelectorAll('.card');
  let inProgressCard = null;
  cards.forEach(card => {
    const title = card.querySelector('.card-title');
    if (title && title.textContent.includes('In Progress')) {
      inProgressCard = card;
    }
  });

  if (!inProgressCard) return;

  const container = inProgressCard.querySelector('.card-body');
  const badge = inProgressCard.querySelector('.badge');

  if (badge) {
    badge.textContent = `${inProgressList.length} Active`;
  }

  if (inProgressList.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-gray);">No inspections in progress</p>';
    return;
  }

  container.innerHTML = inProgressList.map(inspection => `
    <div class="inspection-card" style="border-left-color: #f59e0b; margin-bottom: 1rem;">
      <div class="inspection-header">
        <div>
          <div class="inspection-title">${inspection.restaurant.name}</div>
          <div class="inspection-subtitle">${inspection.restaurant.address}, ${inspection.restaurant.city}</div>
        </div>
        <span class="badge badge-warning">In Progress</span>
      </div>

      <div class="inspection-details">
        <div class="detail-item">
          <span class="detail-label">Inspection Date</span>
          <span class="detail-value">${formatDate(inspection.inspectionDate)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value">${inspection.syncStatus || 'synced'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Current Score</span>
          <span class="detail-value">${inspection.overallScore ? inspection.overallScore.toFixed(2) : 'Not scored'}</span>
        </div>
      </div>

      <div class="inspection-actions">
        <button class="btn btn-primary" onclick="continueInspection('${inspection.id}')">📝 Continue Inspection</button>
      </div>
    </div>
  `).join('');
}

// Render upcoming inspections
function renderUpcoming() {
  const upcomingList = inspections.filter(i => i.status === 'scheduled');

  // Find the Upcoming card
  const cards = document.querySelectorAll('.card');
  let upcomingCard = null;
  cards.forEach(card => {
    const title = card.querySelector('.card-title');
    if (title && title.textContent.includes('Upcoming')) {
      upcomingCard = card;
    }
  });

  if (!upcomingCard) return;

  const container = upcomingCard.querySelector('.card-body');
  const badge = upcomingCard.querySelector('.badge');

  if (badge) {
    badge.textContent = `${upcomingList.length} Scheduled`;
  }

  if (upcomingList.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-gray);">No upcoming inspections</p>';
    return;
  }

  container.innerHTML = upcomingList.map(inspection => `
    <div class="inspection-card" style="border-left-color: #3b82f6; margin-bottom: 1rem;">
      <div class="inspection-header">
        <div>
          <div class="inspection-title">${inspection.restaurant.name}</div>
          <div class="inspection-subtitle">${inspection.restaurant.address}, ${inspection.restaurant.city}</div>
        </div>
        <span class="badge badge-info">Scheduled</span>
      </div>

      <div class="inspection-details">
        <div class="detail-item">
          <span class="detail-label">Scheduled Date</span>
          <span class="detail-value">${formatDate(inspection.inspectionDate)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Restaurant Type</span>
          <span class="detail-value">${inspection.restaurant.cuisine || 'N/A'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Address</span>
          <span class="detail-value">${inspection.restaurant.city}</span>
        </div>
      </div>

      <div class="inspection-actions">
        <button class="btn btn-primary" onclick="startInspection('${inspection.id}')">📝 Start Inspection</button>
      </div>
    </div>
  `).join('');
}

// Render completed inspections
function renderCompleted() {
  const completedList = inspections
    .filter(i => i.status === 'completed')
    .sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate))
    .slice(0, 10); // Show last 10

  // Find the Recently Completed card
  const cards = document.querySelectorAll('.card');
  let completedCard = null;
  cards.forEach(card => {
    const title = card.querySelector('.card-title');
    if (title && title.textContent.includes('Recently Completed')) {
      completedCard = card;
    }
  });

  if (!completedCard) return;

  const tbody = completedCard.querySelector('tbody');

  if (!tbody) return;

  if (completedList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-gray);">No completed inspections</td></tr>';
    return;
  }

  tbody.innerHTML = completedList.map(inspection => `
    <tr style="cursor: pointer;" onclick="viewInspection('${inspection.id}')">
      <td><strong>${inspection.restaurant.name}</strong></td>
      <td>${formatDate(inspection.inspectionDate)}</td>
      <td><strong style="color: ${getScoreColor(inspection.overallScore)};">${inspection.overallScore ? inspection.overallScore.toFixed(2) : 'N/A'} / 10</strong></td>
      <td><span class="badge badge-success">Completed</span></td>
    </tr>
  `).join('');
}

// Start inspection
function startInspection(inspectionId) {
  window.location.href = `/client/inspection-form.html?id=${inspectionId}`;
}

// Continue inspection
function continueInspection(inspectionId) {
  window.location.href = `/client/inspection-form.html?id=${inspectionId}`;
}

// View inspection (read-only or details)
function viewInspection(inspectionId) {
  window.location.href = `/client/inspection-form.html?id=${inspectionId}`;
}

// Format date helper
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

// Get score color
function getScoreColor(score) {
  if (!score) return '#6b7280';
  if (score >= 8) return '#10b981'; // Green
  if (score >= 6) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
}

// Update online status
function updateOnlineStatus() {
  const syncStatus = document.querySelector('.sync-status span:last-child');

  if (syncStatus) {
    syncStatus.textContent = isOnline ? 'Online - All synced' : 'Offline - Local mode';
  }
}

// Handle online event
function handleOnline() {
  isOnline = true;
  updateOnlineStatus();
  loadInspections(); // Reload fresh data
}

// Handle offline event
function handleOffline() {
  isOnline = false;
  updateOnlineStatus();
}

// Logout
function logout() {
  sessionStorage.clear();
  window.location.href = '/landing/index.html';
}
