// Inspection Form - Mobile-first with offline sync
const API_BASE_URL = '/api';
let authToken = null;
let inspectionId = null;
let restaurantData = null;
let checklistItems = [];
let scores = {};
let isOnline = navigator.onLine;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    window.location.href = '/client/login.html';
    return;
  }

  // Get inspection ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  inspectionId = urlParams.get('id');

  if (!inspectionId) {
    alert('No inspection ID provided');
    window.location.href = '/client/dashboard.html';
    return;
  }

  // Load offline data first (instant display)
  loadOfflineData();

  // Update online status
  updateOnlineStatus();

  // Try to load fresh data from server
  await loadInspectionData();
  await loadChecklistItems();

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

// Load inspection data
async function loadInspectionData() {
  try {
    const data = await apiCall(`/inspections/${inspectionId}`);

    if (data && data.success) {
      restaurantData = data.inspection;

      // Update header
      document.getElementById('restaurantName').textContent = restaurantData.restaurant.name;
      document.getElementById('inspectionDate').textContent =
        new Date(restaurantData.inspectionDate).toLocaleDateString();

      // Load existing scores if any
      if (restaurantData.scores && restaurantData.scores.length > 0) {
        restaurantData.scores.forEach(score => {
          scores[score.checklist_item_id] = {
            score: score.score,
            notes: score.notes || ''
          };
        });
        updateProgress();
        calculateOverallScore();
      }

      // Save to localStorage
      saveToLocalStorage();
    }
  } catch (error) {
    console.error('Failed to load inspection data:', error);
    // Continue with offline data
  }
}

// Load checklist items
async function loadChecklistItems() {
  try {
    const data = await apiCall('/checklist-items');

    if (data && data.success) {
      checklistItems = data.items;
      renderChecklist();

      // Save to localStorage
      localStorage.setItem(`checklist_items`, JSON.stringify(checklistItems));
    }
  } catch (error) {
    console.error('Failed to load checklist items:', error);
    // Try to load from localStorage
    const cachedItems = localStorage.getItem('checklist_items');
    if (cachedItems) {
      checklistItems = JSON.parse(cachedItems);
      renderChecklist();
    }
  }
}

// Render checklist
function renderChecklist() {
  const container = document.getElementById('checklistContainer');

  if (checklistItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6b7280;">No checklist items available</p>';
    return;
  }

  // Group items by category
  const categories = {};
  checklistItems.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // Render each category
  let html = '';
  Object.keys(categories).sort().forEach(category => {
    html += `
      <div class="category-section">
        <h2 class="category-title">${category.replace('_', ' ')}</h2>
        ${renderCategoryItems(categories[category])}
      </div>
    `;
  });

  container.innerHTML = html;
}

// Render items for a category
function renderCategoryItems(items) {
  return items.map(item => `
    <div class="checklist-item">
      <div class="item-header">
        <div class="item-name">${item.itemName}</div>
        <div class="item-description">${item.description || ''}</div>
      </div>

      <div class="score-buttons">
        ${renderScoreButtons(item.id)}
      </div>

      <div class="score-labels">
        <span>Poor</span>
        <span>Excellent</span>
      </div>

      <textarea
        class="item-notes"
        placeholder="Add notes (optional)..."
        onchange="updateNotes('${item.id}', this.value)"
      >${scores[item.id]?.notes || ''}</textarea>
    </div>
  `).join('');
}

// Render score buttons (1-10)
function renderScoreButtons(itemId) {
  let buttons = '';
  for (let i = 1; i <= 10; i++) {
    const isSelected = scores[itemId]?.score === i;
    buttons += `
      <button
        class="score-btn ${isSelected ? 'selected' : ''}"
        onclick="setScore('${itemId}', ${i})"
      >
        ${i}
      </button>
    `;
  }
  return buttons;
}

// Set score for an item
function setScore(itemId, score) {
  if (!scores[itemId]) {
    scores[itemId] = { score: score, notes: '' };
  } else {
    scores[itemId].score = score;
  }

  // Update UI
  renderChecklist();
  updateProgress();
  calculateOverallScore();

  // Save to localStorage
  saveToLocalStorage();

  // Check if all items scored
  checkSubmitReady();
}

// Update notes for an item
function updateNotes(itemId, notes) {
  if (!scores[itemId]) {
    scores[itemId] = { score: null, notes: notes };
  } else {
    scores[itemId].notes = notes;
  }

  saveToLocalStorage();
}

// Update progress bar
function updateProgress() {
  const totalItems = checklistItems.length;
  const scoredItems = Object.keys(scores).filter(id => scores[id].score !== null).length;
  const percentage = totalItems > 0 ? Math.round((scoredItems / totalItems) * 100) : 0;

  document.getElementById('progressText').textContent = `${scoredItems} / ${totalItems}`;
  document.getElementById('progressFill').style.width = `${percentage}%`;
}

// Calculate overall score
function calculateOverallScore() {
  const scoredItems = Object.values(scores).filter(s => s.score !== null);

  if (scoredItems.length === 0) {
    document.getElementById('overallScore').textContent = '0.00';
    return;
  }

  const total = scoredItems.reduce((sum, s) => sum + s.score, 0);
  const average = total / scoredItems.length;

  document.getElementById('overallScore').textContent = average.toFixed(2);
}

// Check if submit button should be enabled
function checkSubmitReady() {
  const allScored = checklistItems.every(item =>
    scores[item.id] && scores[item.id].score !== null
  );

  document.getElementById('submitBtn').disabled = !allScored;
}

// Save to localStorage
function saveToLocalStorage() {
  const offlineData = {
    inspectionId,
    restaurantData,
    scores,
    lastModified: new Date().toISOString()
  };

  localStorage.setItem(`inspection_${inspectionId}`, JSON.stringify(offlineData));
}

// Load from localStorage
function loadOfflineData() {
  const cached = localStorage.getItem(`inspection_${inspectionId}`);
  if (cached) {
    const data = JSON.parse(cached);
    scores = data.scores || {};

    if (data.restaurantData) {
      restaurantData = data.restaurantData;
      document.getElementById('restaurantName').textContent = restaurantData.restaurant.name;
      document.getElementById('inspectionDate').textContent =
        new Date(restaurantData.inspectionDate).toLocaleDateString();
    }

    updateProgress();
    calculateOverallScore();
  }

  // Load cached checklist items
  const cachedItems = localStorage.getItem('checklist_items');
  if (cachedItems) {
    checklistItems = JSON.parse(cachedItems);
    renderChecklist();
  }
}

// Save draft
function saveDraft() {
  saveToLocalStorage();

  // Visual feedback
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '✓ Saved';
  btn.style.background = '#10b981';
  btn.style.color = 'white';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.color = '';
  }, 2000);
}

// Submit inspection
async function submitInspection() {
  // Check if all items are scored
  const allScored = checklistItems.every(item =>
    scores[item.id] && scores[item.id].score !== null
  );

  if (!allScored) {
    alert('Please score all checklist items before submitting');
    return;
  }

  // Calculate overall score
  const scoredItems = Object.values(scores).filter(s => s.score !== null);
  const total = scoredItems.reduce((sum, s) => sum + s.score, 0);
  const overallScore = total / scoredItems.length;

  // Prepare scores data
  const scoresArray = checklistItems.map(item => {
    const itemScore = scores[item.id];
    return {
      checklistItemId: item.id,
      category: item.category,
      score: itemScore.score,
      notes: itemScore.notes || null
    };
  });

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const data = await apiCall(`/inspections/${inspectionId}/scores`, {
      method: 'POST',
      body: JSON.stringify({
        scores: scoresArray,
        overallScore: parseFloat(overallScore.toFixed(2)),
        status: 'completed',
        notes: null
      })
    });

    if (data && data.success) {
      // Clear localStorage
      localStorage.removeItem(`inspection_${inspectionId}`);

      // Show success and redirect
      alert('Inspection submitted successfully!');
      window.location.href = '/client/dashboard.html';
    }
  } catch (error) {
    console.error('Submit failed:', error);
    alert('Failed to submit inspection. Your data is saved locally. Please try syncing when online.');
    submitBtn.disabled = false;
    submitBtn.textContent = '✓ Complete';
  }
}

// Manual sync
async function manualSync() {
  if (!isOnline) {
    alert('You are offline. Please check your internet connection.');
    return;
  }

  const syncBtn = event.target;
  syncBtn.disabled = true;
  syncBtn.textContent = '🔄 Syncing...';

  try {
    // Try to sync scores (as draft)
    const scoredItems = Object.values(scores).filter(s => s.score !== null);

    if (scoredItems.length > 0) {
      const total = scoredItems.reduce((sum, s) => sum + s.score, 0);
      const overallScore = total / scoredItems.length;

      const scoresArray = checklistItems
        .filter(item => scores[item.id] && scores[item.id].score !== null)
        .map(item => {
          const itemScore = scores[item.id];
          return {
            checklistItemId: item.id,
            category: item.category,
            score: itemScore.score,
            notes: itemScore.notes || null
          };
        });

      await apiCall(`/inspections/${inspectionId}/scores`, {
        method: 'POST',
        body: JSON.stringify({
          scores: scoresArray,
          overallScore: parseFloat(overallScore.toFixed(2)),
          status: 'in_progress',
          notes: null
        })
      });
    }

    // Update sync status
    await apiCall(`/inspections/${inspectionId}/sync`, {
      method: 'PUT',
      body: JSON.stringify({ syncData: scores })
    });

    // Visual feedback
    syncBtn.textContent = '✓ Synced';
    setTimeout(() => {
      syncBtn.textContent = '🔄 Sync Now';
      syncBtn.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Sync failed:', error);
    alert('Sync failed. Your data is saved locally and will sync when connection is restored.');
    syncBtn.textContent = '🔄 Sync Now';
    syncBtn.disabled = false;
  }
}

// Update online status
function updateOnlineStatus() {
  const banner = document.getElementById('syncBanner');
  const status = document.getElementById('syncStatus');

  if (isOnline) {
    banner.classList.remove('offline');
    status.textContent = 'Online - All synced';
  } else {
    banner.classList.add('offline');
    status.textContent = 'Offline - Changes saved locally';
  }
}

// Handle online event
function handleOnline() {
  isOnline = true;
  updateOnlineStatus();

  // Auto-reload fresh data
  loadInspectionData();
  loadChecklistItems();
}

// Handle offline event
function handleOffline() {
  isOnline = false;
  updateOnlineStatus();
}

// Go back
function goBack() {
  window.location.href = '/client/dashboard.html';
}
