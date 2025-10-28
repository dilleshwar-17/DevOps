// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// CTA button functionality
document.querySelector('.cta-btn').addEventListener('click', function() {
    document.querySelector('#cars').scrollIntoView({
        behavior: 'smooth'
    });
});

// Car detail buttons
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const carName = this.parentElement.querySelector('h3').textContent;
        alert(`Interested in ${carName}? Contact us at info@tevra.com for more details!`);
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
    } else {
        navbar.style.background = '#1a1a1a';
    }
});