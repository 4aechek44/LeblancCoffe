(function () {
    const ACCOUNT_KEY = 'leblancAccount';

    function setupCoffeeParallax() {
        const decorItems = Array.from(document.querySelectorAll('.coffee-decor img'));
        if (!decorItems.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;
        let targetX = 0;
        let targetY = 0;

        function render() {
            frame = 0;

            decorItems.forEach((item, index) => {
                const depth = Number(item.dataset.depth || (index % 2 ? -12 : 12));
                const x = targetX * depth;
                const y = targetY * depth * 0.65;
                item.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        }

        function queueRender(event) {
            targetX = (event.clientX / window.innerWidth - 0.5) * 2;
            targetY = (event.clientY / window.innerHeight - 0.5) * 2;

            if (!frame) {
                frame = requestAnimationFrame(render);
            }
        }

        function reset() {
            targetX = 0;
            targetY = 0;
            if (!frame) {
                frame = requestAnimationFrame(render);
            }
        }

        window.addEventListener('pointermove', queueRender, { passive: true });
        window.addEventListener('pointerleave', reset);
    }

    function showStatus(form, message, type) {
        const status = form.querySelector('[data-auth-status]');
        if (!status) return;

        status.textContent = message;
        status.className = 'auth-status is-visible';
        if (type === 'error') {
            status.classList.add('is-error');
        }
    }

    function readAccount() {
        try {
            return JSON.parse(localStorage.getItem(ACCOUNT_KEY));
        } catch {
            return null;
        }
    }

    function setupRegisterForm() {
        const form = document.querySelector('[data-auth-form="register"]');
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = form.username.value.trim();
            const email = form.email.value.trim();
            const password = form.password.value;
            const confirm = form.confirm.value;

            if (!username || !email || !password || !confirm) {
                showStatus(form, 'Fill every field before becoming a regular.', 'error');
                return;
            }

            if (password.length < 8) {
                showStatus(form, 'Password should be at least 8 characters.', 'error');
                return;
            }

            if (password !== confirm) {
                showStatus(form, 'Passwords do not match yet.', 'error');
                return;
            }

            localStorage.setItem(ACCOUNT_KEY, JSON.stringify({ username, email, password }));
            showStatus(form, `Welcome to Leblanc, ${username}. Redirecting to sign in...`, 'success');

            window.setTimeout(() => {
                window.location.href = 'signin.html';
            }, 900);
        });
    }

    function setupSignInForm() {
        const form = document.querySelector('[data-auth-form="signin"]');
        if (!form) return;

        const account = readAccount();
        if (account && account.username) {
            form.username.value = account.username;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = form.username.value.trim();
            const password = form.password.value;
            const savedAccount = readAccount();

            if (!savedAccount) {
                showStatus(form, 'Create an account first. This demo keeps it in this browser.', 'error');
                return;
            }

            if (username !== savedAccount.username || password !== savedAccount.password) {
                showStatus(form, 'That regular is not in the notebook yet.', 'error');
                return;
            }

            localStorage.setItem('leblancSession', JSON.stringify({
                username: savedAccount.username,
                signedInAt: new Date().toISOString()
            }));

            showStatus(form, `Good to see you again, ${savedAccount.username}.`, 'success');

            window.setTimeout(() => {
                window.location.href = 'index.html';
            }, 900);
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        setupCoffeeParallax();
        setupRegisterForm();
        setupSignInForm();
    });
}());
