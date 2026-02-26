document.addEventListener('DOMContentLoaded', () => {
    
    // Registo do Plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. PRELOADER & ANIMAÇÃO INICIAL (HERO)
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        gsap.to(preloader, { opacity: 0, duration: 0.5, onComplete: () => {
            preloader.style.display = 'none';
            
            // Hero Animations
            gsap.from(".gsap-hero", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
            gsap.from(".gsap-visual", {
                x: 50,
                opacity: 0,
                duration: 1.2,
                delay: 0.5,
                ease: "power3.out"
            });
        }});
    }, 1500);

    // 2. TYPING EFFECT
    const typingText = document.querySelector('.typing-text');
    const words = ["Soluções com Firebase", "Interfaces com GSAP", "Automação em Python", "Sistemas Escaláveis"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if(!typingText) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 3. MENU MOBILE RESPONSIVO
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // 4. GSAP SCROLL ANIMATIONS (Revelação das Secções)
    const revealElements = gsap.utils.toArray('.gs-reveal');
    revealElements.forEach((el) => {
        let delayAmount = el.classList.contains('gs-delay-1') ? 0.2 : el.classList.contains('gs-delay-2') ? 0.4 : 0;
        gsap.fromTo(el, 
            { autoAlpha: 0, y: 50 }, 
            {
                duration: 1, 
                autoAlpha: 1, 
                y: 0, 
                ease: "power3.out",
                delay: delayAmount,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Efeito 3D (Stagger) nos Cartões de Projeto ao fazer Scroll
    gsap.from(".gs-project", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 80%"
        },
        y: 80,
        opacity: 0,
        rotationX: 15,
        transformPerspective: 1000,
        transformOrigin: "center bottom",
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)"
    });

    // 5. FILTRAGEM DE PROJETOS
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    gsap.to(card, { scale: 1, opacity: 1, display: "flex", duration: 0.3 });
                } else {
                    gsap.to(card, { scale: 0.8, opacity: 0, display: "none", duration: 0.3 });
                }
            });
            
            // Refresh ScrollTrigger depois de filtrar para recalcular as alturas
            setTimeout(() => { ScrollTrigger.refresh(); }, 400);
        });
    });

    // 6. 3D TILT EFFECT INTERATIVO (Para Desktop)
    if (window.matchMedia("(min-width: 992px)").matches) {
        document.querySelectorAll('[data-tilt]').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xMid = rect.width / 2;
                const yMid = rect.height / 2;
                
                const rotateX = ((y - yMid) / yMid) * -12;
                const rotateY = ((x - xMid) / xMid) * 12;

                gsap.to(el, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    scale: 1.02,
                    transformPerspective: 1000,
                    ease: "power1.out",
                    duration: 0.3
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    ease: "power1.out",
                    duration: 0.5
                });
            });
        });
    }

    // 7. PARTICLES INIT
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#64ffda" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": false },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#64ffda", "opacity": 0.15, "width": 1 },
                "move": { "enable": true, "speed": 1.5 }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
            },
            "retina_detect": true
        });
    }
});
