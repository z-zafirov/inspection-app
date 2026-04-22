// Login Form Handler
// Real authentication with backend API

// API Configuration
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Clear previous error
        errorMessage.style.display = 'none';

        // Validate inputs
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Call backend authentication API
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Successful login
                handleSuccessfulLogin(data.token, data.user);
            } else {
                // Failed login
                showError(data.error || 'Invalid email or password. Please try again.');
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        } catch (error) {
            // Network or server error
            console.error('Login error:', error);
            showError('Unable to connect to server. Please ensure the backend is running.');
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    // Handle successful login
    function handleSuccessfulLogin(token, user) {
        // Store authentication token and user info
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            restaurantId: user.restaurantId,
            loginTime: new Date().toISOString()
        }));

        // Show success visual feedback
        submitButton.textContent = 'Success! Redirecting...';
        submitButton.style.backgroundColor = '#10b981';

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // Shake animation for error
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }

    // Quick fill for testing (click on credential items)
    document.querySelectorAll('.credential-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.title = 'Click to auto-fill';

        item.addEventListener('click', function() {
            const text = this.textContent;
            const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
            if (emailMatch) {
                emailInput.value = emailMatch[0];
                passwordInput.value = 'password123';
                emailInput.focus();
            }
        });
    });
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);

// Check if already logged in
if (sessionStorage.getItem('user')) {
    const remember = confirm('You are already logged in. Go to dashboard?');
    if (remember) {
        window.location.href = 'dashboard.html';
    }
}
