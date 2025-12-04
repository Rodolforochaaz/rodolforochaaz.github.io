// ========================================
// PORTFOLIO JAVASCRIPT - APRIMORADO
// Advanced Interactions & Animations
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ========================================
    // VARIABLES & ELEMENTS
    // ========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');
    const skillBars = document.querySelectorAll('.skill-progress');
    const statNumbers = document.querySelectorAll('.stat-number');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const scrollArrow = document.querySelector('.scroll-arrow');
    const techItems = document.querySelectorAll('.tech-item');
    const highlightItems = document.querySelectorAll('.highlight');
    
    // State variables
    let isMenuOpen = false;
    let isScrolling = false;
    let currentSection = 'home';
    let animationsTriggered = new Set();
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Debounce function for performance
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Check if element is in viewport
    function isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -rect.height * threshold &&
            rect.left >= -rect.width * threshold &&
            rect.bottom <= windowHeight + rect.height * threshold &&
            rect.right <= windowWidth + rect.width * threshold
        );
    }
    
    // Smooth scroll to element
    function smoothScrollTo(element, offset = 70) {
        if (!element) return;
        
        const elementPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = elementPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // ========================================
    // NAVIGATION FUNCTIONALITY
    // ========================================
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Update active navigation link
    function updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }
    
    // Handle navbar scroll effect
    function handleNavbarScroll() {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(10, 22, 40, 0.98)';
            navbar.style.backdropFilter = 'blur(25px)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 22, 40, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // ========================================
    // ANIMATIONS & EFFECTS
    // ========================================
    
    // Initialize particles
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: window.innerWidth > 768 ? 100 : 50,
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: '#0066ff' },
                    shape: {
                        type: 'circle',
                        stroke: { width: 0, color: '#000000' }
                    },
                    opacity: {
                        value: 0.6,
                        random: true,
                        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: 4,
                        random: true,
                        anim: { enable: false }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#0066ff',
                        opacity: 0.4,
                        width: 1.5
                    },
                    move: {
                        enable: true,
                        speed: 2.5,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 400, line_linked: { opacity: 1 } },
                        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                        repulse: { distance: 200, duration: 0.4 },
                        push: { particles_nb: 5 },
                        remove: { particles_nb: 2 }
                    }
                },
                retina_detect: true
            });
        }
    }
    
    // Animate counter numbers
    function animateCounters() {
        statNumbers.forEach(counter => {
            if (animationsTriggered.has(counter)) return;
            
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
            animationsTriggered.add(counter);
        });
    }
    
    // Animate skill bars
    function animateSkillBars() {
        skillBars.forEach(bar => {
            if (animationsTriggered.has(bar)) return;
            
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
            
            animationsTriggered.add(bar);
        });
    }
    
    // Typing animation for hero text
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const texts = ['Olá, eu sou', 'Hello, I am', 'Hola, soy'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 80 : 120;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeText, typeSpeed);
        }
        
        typeText();
    }
    
    // Add parallax effect to tech items
    function initParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const techItems = document.querySelectorAll('.tech-icon');
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            
            techItems.forEach(item => {
                item.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }
    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    
    // Intersection Observer for animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('skills')) {
                        animateSkillBars();
                    }
                    
                    if (entry.target.classList.contains('hero')) {
                        animateCounters();
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Observe other elements
        const animatedElements = document.querySelectorAll('.project-card, .highlight, .contact-item, .timeline-item, .tech-item');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ========================================
    // PROJECT FILTERING
    // ========================================
    
    function initProjectFiltering() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ========================================
    // FORM HANDLING
    // ========================================
    
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Enviando...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066ff'};
            color: white;
            padding: 1.2rem 1.8rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    // ========================================
    // INTERACTIVE ELEMENTS
    // ========================================
    
    // Add hover effects to tech items
    function initTechItemInteractions() {
        techItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15) rotate(5deg)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    // Navigation events
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
                closeMobileMenu();
            }
        });
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(() => {
        handleNavbarScroll();
        updateActiveNavLink();
    }, 16));
    
    // Scroll arrow click
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                smoothScrollTo(aboutSection);
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Resize events
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
        
        // Reinitialize particles on resize
        if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
            pJSDom[0].pJS.fn.canvasSize();
            pJSDom[0].pJS.fn.canvasPaint();
            pJSDom[0].pJS.fn.particlesRefresh();
        }
    }, 250));
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    function init() {
        // Initialize all components
        initParticles();
        initTypingAnimation();
        initScrollAnimations();
        initProjectFiltering();
        initContactForm();
        initTechItemInteractions();
        initParallaxEffect();
        
        // Set initial states
        handleNavbarScroll();
        updateActiveNavLink();
        
        // Add loaded class to body
        document.body.classList.add('loaded');
        
        console.log('✨ Portfolio initialized successfully!');
    }
    
    // Initialize when DOM is ready
    init();
    
    // ========================================
    // PERFORMANCE OPTIMIZATIONS
    // ========================================
    
    // Preload critical images
    function preloadImages() {
        const criticalImages = [
            'rodolfo.jpg',
            'web_development.jpg',
            'ai_concept.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Initialize preloading
    preloadImages();
    
    // Service Worker registration (if available)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('✅ Service Worker registered');
            }).catch(function(registrationError) {
                console.log('⚠️ Service Worker registration failed');
            });
        });
    }
    
    // ========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================
    
    // Focus management
    function manageFocus() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="email"], input[type="radio"], input[type="checkbox"], select'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid #0066ff';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
    
    // Initialize accessibility features
    manageFocus();
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', 'none');
        document.documentElement.style.setProperty('--transition-normal', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
});

// ========================================
// GLOBAL ERROR HANDLING
// ========================================

window.addEventListener('error', function(e) {
    console.error('❌ Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
});

// ========================================
// EXPORT FOR TESTING
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export functions for testing if needed
    };
}
