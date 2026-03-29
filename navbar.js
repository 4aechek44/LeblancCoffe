async function includeNavbar(containerId = 'navbar') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Navbar container not found: #${containerId}`);
        return;
    }

    try {
        const response = await fetch('navbar.html');
        if (!response.ok) {
            throw new Error(`Failed to load navbar.html: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
        console.error('Error including navbar:', error);
    }
}

window.addEventListener('DOMContentLoaded', () => includeNavbar('navbar'));
