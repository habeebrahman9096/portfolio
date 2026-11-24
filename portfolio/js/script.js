/* 
   ==========================================================================
   Interactive Script: Habeeburahman VTM - Graphic Designer Portfolio
   Features: Custom Cursor, Particle System, Counter Stats, 3D Hover, Lightbox
   ========================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme immediately in DOMContentLoaded (as backup to inline script)
    if (localStorage.getItem('portfolio-theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // 1. Initialize Custom Cursor
    initCustomCursor();

    // 2. Mobile Menu Toggle
    initMobileMenu();

    // 3. Scroll Progress & Header Change
    initScrollEffects();

    // 4. Background Particles
    initBackgroundParticles();

    // 5. Card Mouse Follow Spotlight Effect
    initCardSpotlight();

    // 6. Magnetic Buttons
    initMagneticButtons();

    // 7. Project Gallery Filter & Lightbox
    initProjectGallery();

    // 8. Stats Counter Animation
    initStatsCounter();

    // 9. Initialize Theme Toggle Button
    initThemeToggle();
});

// Window Load Event: Hide Loader & Start GSAP Intro Animations
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    // Ensure loading progress reaches 100%
    if (loaderProgress) {
        loaderProgress.style.width = '100%';
    }

    setTimeout(() => {
        if (preloader) {
            // Fade out preloader
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Trigger Hero entry animations
                    startHeroAnimations();
                }
            });
        }
    }, 500);
});

/* ==========================================================================
   1. Custom Cursor
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor move
        gsap.set(cursor, { x: mouseX, y: mouseY });
    });

    // Lag/Follower smooth animation using GSAP ticker
    gsap.ticker.add(() => {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;
        gsap.set(follower, { x: posX, y: posY });
    });

    // Cursor Hover Effects on Interactive Elements
    const hoverables = document.querySelectorAll('a, button, .filter-btn, .project-card, .submit-btn, .whatsapp-float, .social-icon');
    
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
        });
    });
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !navLinks) return;

    // Toggle navigation visibility and hamburger animation
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active'); // triggers CSS animation for spans
    });

    // Close menu when a navigation link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

/* ==========================================================================
   3. Scroll Progress Bar & Sticky Header
   ========================================================================== */
function initScrollEffects() {
    const progressBar = document.getElementById('scroll-progress');
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Update Scroll Progress Bar
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Sticky Header shrink
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active Link Highlighting on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   4. Background Particles System
   ========================================================================== */
function initBackgroundParticles() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    // Create particles dynamically using JS canvas (failsafe if standard particles.js is not loaded)
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.6; // upward drift
            this.alpha = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 320; // Purple (260) or Pink (320)
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Re-spawn particle if it goes off screen or fades completely
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.reset();
                this.y = canvas.height;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            const isLightMode = document.body.classList.contains('light-mode');
            if (isLightMode) {
                ctx.fillStyle = `hsla(${this.hue}, 80%, 40%, ${this.alpha * 0.7})`;
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = `hsla(${this.hue}, 90%, 70%, ${this.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${this.hue}, 90%, 70%, 0.5)`;
            }
            
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0; // reset shadow before draw loop
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* ==========================================================================
   5. Card Mouse Follow Spotlight Effect
   ========================================================================== */
function initCardSpotlight() {
    const cards = document.querySelectorAll('.glass-card, .skill-card, .service-card, .project-card, .experience-hero');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            // Set custom property coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add Spotlight Highlight CSS dynamically to avoid code pollution
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .glass-card, .skill-card, .service-card, .project-card, .experience-hero {
            position: relative;
        }
        .glass-card::after, .skill-card::after, .service-card::after, .project-card::after, .experience-hero::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(138, 92, 255, 0.08), transparent 80%);
            z-index: 1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .glass-card:hover::after, .skill-card:hover::after, .service-card:hover::after, .project-card:hover::after, .experience-hero:hover::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(styleSheet);
}

/* ==========================================================================
   6. Magnetic Buttons Effect
   ========================================================================== */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-btn, .social-icon, .whatsapp-float');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Pull element towards cursor slightly
            gsap.to(btn, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            // Restore position on mouse leave
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

/* ==========================================================================
   7. Project Gallery Filter & Lightbox Modal
   ========================================================================== */
function initProjectGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Lightbox selectors
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxTitle = lightbox.querySelector('h3');
    const lightboxCat = lightbox.querySelector('p');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'flex';
                    // Fade in animations
                    gsap.fromTo(card, 
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                    );
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Logic
    projectCards.forEach(card => {
        const viewBtn = card.querySelector('.project-link');
        const img = card.querySelector('.project-img-wrapper img');
        const title = card.querySelector('.project-title').textContent;
        const cat = card.querySelector('.project-cat').textContent;

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop card click if clicked view button
                openLightbox(img.src, title, cat);
            });
        }

        // Open lightbox on card click as well
        card.addEventListener('click', () => {
            openLightbox(img.src, title, cat);
        });
    });

    function openLightbox(src, title, cat) {
        if (!lightbox) return;
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightboxCat.textContent = cat;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock scroll
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Escape Key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

/* ==========================================================================
   8. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
    const counterSection = document.querySelector('.stats-counter');
    const counters = document.querySelectorAll('.stat-num');
    
    if (!counterSection || counters.length === 0) return;

    let animated = false;

    // Scroll checker helper
    function checkScroll() {
        const rect = counterSection.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        
        // Trigger when the stats section enters screen
        if (rect.top < screenHeight && rect.bottom > 0 && !animated) {
            animated = true;
            animateCounters();
        }
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const dataObj = { value: 0 };
            
            // Animate object value using GSAP
            gsap.to(dataObj, {
                value: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    counter.textContent = Math.floor(dataObj.value) + suffix;
                }
            });
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // initial check in case page starts scrolled down
}

/* ==========================================================================
   GSAP Hero Entry Animations
   ========================================================================== */
function startHeroAnimations() {
    // 1. Initialize AOS (Animate on Scroll) after loader hides
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // 2. GSAP Timeline for Hero
    const tl = gsap.timeline();

    tl.from('header', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .from('.hero-welcome', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-name span', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-tagline', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-actions .btn', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-image-wrapper', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'elastic.out(1, 0.75)'
    }, '-=0.8');
}

/* ==========================================================================
   Theme Toggle System
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    
    // Set initial icon on load based on class
    if (icon) {
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
        
        if (icon) {
            if (isLight) {
                icon.className = 'fa-solid fa-sun';
                // Shrink/Grow cursor effect trigger on click
                const cursorFollower = document.querySelector('.cursor-follower');
                if (cursorFollower) {
                    gsap.fromTo(cursorFollower, { scale: 0.8 }, { scale: 1, duration: 0.3 });
                }
            } else {
                icon.className = 'fa-solid fa-moon';
                const cursorFollower = document.querySelector('.cursor-follower');
                if (cursorFollower) {
                    gsap.fromTo(cursorFollower, { scale: 0.8 }, { scale: 1, duration: 0.3 });
                }
            }
        }
    });
}
