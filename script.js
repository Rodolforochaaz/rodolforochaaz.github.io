document.addEventListener('DOMContentLoaded', () => {
    // Registar Plugins
    gsap.registerPlugin(ScrollTrigger);

    /* =========================================================
       1. CUSTOM CURSOR & MAGNETIC BUTTONS (Apenas Desktop)
    ========================================================= */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, .magnetic');
    
    let isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouch) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: () => {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;
                
                gsap.set(follower, {
                    css: { left: posX - 15, top: posY - 15 }
                });
                gsap.set(cursor, {
                    css: { left: mouseX, top: mouseY }
                });
            }
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            link.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
                gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            });

            // Efeito Magnético
            if (link.classList.contains('magnetic')) {
                link.addEventListener('mousemove', (e) => {
                    const rect = link.getBoundingClientRect();
                    const strength = link.dataset.strength || 20;
                    const x = ((e.clientX - rect.left) / link.offsetWidth) - 0.5;
                    const y = ((e.clientY - rect.top) / link.offsetHeight) - 0.5;
                    
                    gsap.to(link, {
                        x: x * strength,
                        y: y * strength,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    /* =========================================================
       2. THREE.JS WEBGL BACKGROUND (Partículas interativas)
    ========================================================= */
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Criar Partículas
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x64ffda,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    const animateWebGL = () => {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Efeito Parallax Mouse
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        renderer.render(scene, camera);
        window.requestAnimationFrame(animateWebGL);
    };
    animateWebGL();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* =========================================================
       3. GSAP PRELOADER & INTRO TIMELINE
    ========================================================= */
    const preloader = document.getElementById('preloader');
    const percentTxt = document.querySelector('.loader-progress');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            const tl = gsap.timeline();
            tl.to('.loader-bar', { width: '100%', duration: 0.5, ease: "power2.inOut" })
              .to('.loader-text, .loader-progress', { y: -50, opacity: 0, duration: 0.5, stagger: 0.1 })
              .to(preloader, { yPercent: -100, duration: 1, ease: "expo.inOut" })
              .from('.navbar', { y: -100, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
              .from('.gsap-fade-up', { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.8")
              .add(() => { document.body.classList.remove('loading'); });
        }
        percentTxt.innerText = progress + '%';
        document.querySelector('.loader-bar').style.width = progress + '%';
    }, 100);

    /* =========================================================
       4. HORIZONTAL SCROLL (Projetos)
    ========================================================= */
    const horizontalContainer = document.querySelector('.horizontal-scroll-container');
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');
    
    // Verifica se não é mobile para aplicar o scroll horizontal
    if (window.innerWidth > 768) {
        let scrollTween = gsap.to(horizontalContainer, {
            x: () => -(horizontalContainer.scrollWidth - window.innerWidth + 100) + "px",
            ease: "none",
            scrollTrigger: {
                trigger: wrapper,
                start: "top top",
                end: () => "+=" + horizontalContainer.scrollWidth,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Efeito 3D (Skew/Scale) enquanto rola a secção horizontal
        gsap.utils.toArray('.h-card').forEach((card) => {
            gsap.to(card.querySelector('.h-card-inner'), {
                scale: 0.95,
                opacity: 0.5,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: "left left",
                    end: "right right",
                    scrub: true,
                }
            });
        });
    }

    /* =========================================================
       5. REVEAL ANIMATIONS GENÉRICAS E COUNTERS
    ========================================================= */
    gsap.utils.toArray('.gsap-reveal').forEach(elem => {
        gsap.fromTo(elem, 
            { autoAlpha: 0, y: 50 },
            {
                duration: 1.2,
                autoAlpha: 1,
                y: 0,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Animação de Contadores (Stats)
    gsap.utils.toArray('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => { counter.innerText = Math.floor(obj.val); }
                });
            }
        });
    });

    /* =========================================================
       6. MOBILE MENU
    ========================================================= */
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobLinks = document.querySelectorAll('.mobile-links a');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });

        mobLinks.forEach(l => {
            l.addEventListener('click', () => {
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
