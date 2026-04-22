// Login Modal Handler
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLoginModal');
    const closeBtn = document.querySelector('.modal-close');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    // Open modal
    openBtn.addEventListener('click', function() {
        modal.classList.add('show');
        emailInput.focus();
    });

    // Close modal on X click
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        resetForm();
    });

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            resetForm();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            resetForm();
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorMessage.style.display = 'none';

        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                handleSuccessfulLogin(data.token, data.user);
            } else {
                showError(data.error || 'Invalid email or password. Please try again.');
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Unable to connect to server. Please check your connection.');
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    function handleSuccessfulLogin(token, user) {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            restaurantId: user.restaurantId,
            loginTime: new Date().toISOString()
        }));

        submitButton.textContent = 'Success! Redirecting...';
        submitButton.style.backgroundColor = '#10b981';

        setTimeout(() => {
            window.location.href = '/client/dashboard.html';
        }, 500);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }

    function resetForm() {
        loginForm.reset();
        errorMessage.style.display = 'none';
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.textContent = 'Sign In';
        submitButton.style.backgroundColor = '';
    }

    // Check if already logged in
    if (sessionStorage.getItem('user')) {
        const goToDashboard = confirm('You are already logged in. Go to dashboard?');
        if (goToDashboard) {
            window.location.href = '/client/dashboard.html';
        }
    }
});
