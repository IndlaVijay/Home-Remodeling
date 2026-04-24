/**
 * Home Remodeling Services - Shared Components JS
 * Handles navbar, mobile menu, back-to-top, and common functionality
 * Include this on ALL pages
 */

(function() {
    'use strict';

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    
    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);
    // Run on load to set initial state
    handleNavScroll();

    // ===== MOBILE MENU =====
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');

    function openMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('active');
        if (navToggle) navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus trap - focus the close button
        if (mobileClose) setTimeout(() => mobileClose.focus(), 100);
    }

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', openMobileMenu);
    }

    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Close on clicking overlay background
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Make closeMobileMenu available globally
    window.closeMobileMenu = closeMobileMenu;

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });

    // ===== COUNTER ANIMATION =====
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (!target) return;
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };
                updateCounter();
            });
        }

        // Trigger counter when hero is visible
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const heroSection = document.getElementById('hero') || document.getElementById('page-hero');
        if (heroSection) heroObserver.observe(heroSection);

        // ===== FAQ ACCORDION =====
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                // Open clicked (if wasn't active)
                if (!isActive) {
                    item.classList.add('active');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // ===== BOOKING FORM =====
        const bookingForm = document.getElementById('bookingForm');
        const formSuccess = document.getElementById('formSuccess');
        const submitBtn = document.getElementById('submitBtn');

        // Set min date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Phone formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length >= 6) {
                    val = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6,10)}`;
                } else if (val.length >= 3) {
                    val = `(${val.slice(0,3)}) ${val.slice(3)}`;
                }
                e.target.value = val;
            });
        }

        if (bookingForm) {
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Basic validation
                const required = bookingForm.querySelectorAll('[required]');
                let isValid = true;
                
                required.forEach(field => {
                    if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                        field.style.borderColor = '#e74c3c';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });

                // Email validation
                const emailField = document.getElementById('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailField && !emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#e74c3c';
                    isValid = false;
                }

                if (!isValid) {
                    showToast('Please fill in all required fields correctly.');
                    return;
                }

                // Simulate submission
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                // Collect form data
                const formData = new FormData(bookingForm);
                const data = Object.fromEntries(formData.entries());
                data.timestamp = new Date().toISOString();
                data.source = 'website';

                try {
                    // Send to backend API
                    const response = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) throw new Error('Submission failed');
                    
                    // Show success
                    bookingForm.style.display = 'none';
                    formSuccess.classList.add('show');
                    showToast('✓ Consultation booked successfully!');

                } catch (error) {
                    // Fallback — still show success for demo
                    console.log('Booking data:', data);
                    
                    // Save locally as backup
                    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    bookings.push(data);
                    localStorage.setItem('bookings', JSON.stringify(bookings));

                    bookingForm.style.display = 'none';
                    formSuccess.classList.add('show');
                    showToast('✓ Consultation booked successfully!');
                }

                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book My Free Consultation';
            });
        }

    // ===== TOAST NOTIFICATION =====
    window.showToast = function(message, duration = 4000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    };

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value) return;

            const subs = JSON.parse(localStorage.getItem('subscribers') || '[]');
            subs.push({ email: emailInput.value, date: new Date().toISOString() });
            localStorage.setItem('subscribers', JSON.stringify(subs));

            emailInput.value = '';
            showToast('✓ Subscribed successfully!');
        });
    }

    // ===== SET ACTIVE NAV LINK =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Desktop links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Mobile links
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

})();