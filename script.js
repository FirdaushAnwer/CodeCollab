document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect & Scroll Progress Bar
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress Bar
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });

    // Intersection Observer for fade-up animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Simple logic for the demo visual interaction
        if (mobileMenuBtn.classList.contains('active')) {
            mobileMenuBtn.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            mobileMenuBtn.children[1].style.opacity = '0';
            mobileMenuBtn.children[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu open
        } else {
            mobileMenuBtn.children[0].style.transform = 'none';
            mobileMenuBtn.children[1].style.opacity = '1';
            mobileMenuBtn.children[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link, .btn-cert-nav').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
});
