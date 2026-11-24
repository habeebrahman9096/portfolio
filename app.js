document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       STICKY NAVBAR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                // Update Scroll Progress Bar if present
                if (scrollProgress) {
                    scrollProgress.style.width = scrollPercent + '%';
                }

                // Sticky Navbar
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active Link Highlighting on Scroll
                highlightNavLink();
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    /* ==========================================================================
       NAV LINK ACTIVE STATE HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let cachedSectionPositions = [];

    function cacheSectionPositions() {
        cachedSectionPositions = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            bottom: section.offsetTop + section.offsetHeight
        }));
    }
    
    cacheSectionPositions();
    window.addEventListener('resize', cacheSectionPositions);
    // Recalculate after images load
    window.addEventListener('load', cacheSectionPositions);

    function highlightNavLink() {
        if (!cachedSectionPositions.length) return;
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // offset for nav height

        for (let i = 0; i < cachedSectionPositions.length; i++) {
            const sec = cachedSectionPositions[i];
            if (scrollPosition >= sec.top && scrollPosition < sec.bottom) {
                currentSectionId = sec.id;
                break;
            }
        }

        navLinks.forEach(link => {
            const isMatch = link.getAttribute('href') === `#${currentSectionId}`;
            if (link.classList.contains('active') !== isMatch) {
                link.classList.toggle('active', isMatch);
            }
        });
    }

    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK)
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved preference
    const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolioTheme', newTheme);
        updateThemeIcon(newTheme);
        showToast(`Switched to ${newTheme} mode!`);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    /* ==========================================================================
       MOBILE MENU (HAMBURGER)
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent scrolling when mobile nav is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking backdrop overlay
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* ==========================================================================
       SCROLL REVEAL (.reveal-fade-up) - Set all visible by default
       ========================================================================== */
    document.querySelectorAll('.reveal-fade-up').forEach(el => el.classList.add('active'));

    /* ==========================================================================
       SMOOTH FADE & SLIDE TEXT ANIMATION
       ========================================================================== */
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
        const roles = ["Graphic Designer", "Brand Identity Designer", "Creative Visual Designer"];
        let roleIndex = 0;

        function changeRoleText() {
            // Slide up & fade out
            typedTextSpan.classList.add('fade-out');

            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                typedTextSpan.textContent = roles[roleIndex];
                
                // Prepare below
                typedTextSpan.classList.remove('fade-out');
                typedTextSpan.classList.add('fade-in');

                // Animate smoothly to center position
                setTimeout(() => {
                    typedTextSpan.classList.remove('fade-in');
                }, 40);
            }, 450); // Match CSS transition timing
        }

        // Cycle role text smoothly every 3 seconds
        setInterval(changeRoleText, 3200);
    }

    /* ==========================================================================
       SKILLS SECTION
       ========================================================================== */
    /* ==========================================================================
       PORTFOLIO MARQUEE — DUPLICATE ITEMS & FILTER SYSTEM
       ========================================================================== */
    const skillsPanel = document.querySelector('.skills-wrapper');
    const skillCounters = document.querySelectorAll('.skill-count[data-count]');

    function runSkillCounters() {
        if (!skillsPanel || skillsPanel.classList.contains('is-counted')) return;
        skillsPanel.classList.add('is-counted');

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        skillCounters.forEach(counter => {
            const target = Number(counter.dataset.count) || 0;
            if (reducedMotion) {
                counter.textContent = target;
                return;
            }

            const duration = 1100;
            const startTime = performance.now();
            const updateCounter = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(updateCounter);
            };
            requestAnimationFrame(updateCounter);
        });
    }

    if (skillsPanel) {
        new IntersectionObserver((entries, observer) => {
            if (!entries[0].isIntersecting) return;
            runSkillCounters();
            observer.unobserve(skillsPanel);
        }, { threshold: 0.3 }).observe(skillsPanel);
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const track1 = document.getElementById('marqueeTrack1');
    const track2 = document.getElementById('marqueeTrack2');
    function createCustomProjectCard(project) {
        const item = document.createElement('div');
        item.className = 'portfolio-item show';
        item.dataset.category = project.category || 'branding';

        const card = document.createElement('div');
        card.className = 'project-card';
        const imageBox = document.createElement('div');
        imageBox.className = 'project-img-box';
        const image = document.createElement('img');
        image.className = 'project-img';
        const firstImage = Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : (project.image || '');
        image.src = firstImage;
        image.alt = project.title || 'Portfolio project';
        image.onerror = () => { image.src = 'https://via.placeholder.com/800x600?text=Portfolio+Work'; };

        const overlay = document.createElement('div');
        overlay.className = 'project-overlay';
        const overlayContent = document.createElement('div');
        overlayContent.className = 'project-overlay-content';
        const category = document.createElement('span');
        category.className = 'project-cat';
        category.textContent = project.categoryLabel || project.category || 'Project';
        const title = document.createElement('h4');
        title.textContent = project.title || 'Untitled Project';
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-light view-project-btn';
        button.dataset.project = project.id;
        if (project.isAdmin) button.dataset.admin = 'true';
        button.textContent = 'View Details';

        overlayContent.append(category, title, button);
        overlay.appendChild(overlayContent);
        imageBox.append(image, overlay);
        card.appendChild(imageBox);
        item.appendChild(card);
        return item;
    }

    async function renderCustomProjects() {
        if (!track1 || !track2) return;
        
        // 1. Load from localStorage (Admin added projects) and Static Data (projects_data.js)
        try {
            const rawLocal = localStorage.getItem('hb_portfolio_projects');
            const localProjects = rawLocal ? JSON.parse(rawLocal) : null;
            const deletedIds = JSON.parse(localStorage.getItem('hb_portfolio_deleted_ids') || '[]');
            const staticProjects = window.PROJECTS_DATABASE || [];

            let allProjects = [];
            if (localProjects) {
                allProjects = [...localProjects];
                staticProjects.forEach(sp => {
                    if (!deletedIds.includes(sp.id) && !allProjects.find(p => p.id === sp.id)) {
                        allProjects.push(sp);
                    }
                });
            } else {
                allProjects = staticProjects.filter(sp => !deletedIds.includes(sp.id));
            }
            allProjects = allProjects.filter(p => !deletedIds.includes(p.id));

            allProjects.forEach((project, idx) => {
                const coverImage = (project.images && project.images.length > 0) ? project.images[0] : project.image;
                if (project && coverImage) {
                    const data = {
                        id: project.id,
                        title: project.title,
                        category: project.category,
                        categoryLabel: project.categoryLabel || project.category,
                        image: coverImage,
                        images: project.images || (project.image ? [project.image] : []),
                        isAdmin: true
                    };
                    
                    // Append all projects to the visible track1
                    track1.appendChild(createCustomProjectCard(data));
                }
            });
        } catch (e) {
            console.warn('Projects could not be loaded.', e);
        }

        // 2. Load from API (Legacy)
        if (window.portfolioApi && typeof window.portfolioApi.getProjects === 'function') {
            try {
                const projects = await window.portfolioApi.getProjects();
                if (Array.isArray(projects)) {
                    projects.map(window.portfolioApi.projectForPortfolio).forEach(project => {
                        if (project?.id && project.image) track1.appendChild(createCustomProjectCard(project));
                    });
                }
            } catch (error) {
                console.warn('API Projects could not be loaded.', error);
            }
        }
    }

    // Build two identical, viewport-filling groups so the marquee never
    // exposes an empty area when a filter has only one or two projects.
    function setupMarqueeTrack(track) {
        if (!track) return;
        const origItems = Array.from(track.querySelectorAll('.portfolio-item:not([data-clone])'));
        const visibleItems = origItems
            .filter(item => item.classList.contains('show'))
            .slice(0, 3);

        origItems.forEach(item => {
            item.classList.toggle('marquee-active', visibleItems.includes(item));
        });

        if (!visibleItems.length) return;

        // Only the All Projects view is an animated marquee. Categories stay
        // still, without duplicate cards.
        if (!track.closest('.portfolio-marquee-wrapper')?.classList.contains('is-scrolling')) return;

        const cardWidth = visibleItems[0].getBoundingClientRect().width || 320;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const wrapper = track.closest('.portfolio-marquee-wrapper');
        const minimumGroupWidth = (wrapper?.clientWidth || window.innerWidth) + cardWidth;
        const copiesNeeded = Math.max(0, Math.ceil(minimumGroupWidth / (cardWidth + gap)) - visibleItems.length);

        // Complete the first group until it is wider than the viewport.
        for (let index = 0; index < copiesNeeded; index += 1) {
            const clone = visibleItems[index % visibleItems.length].cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        }

        // Duplicate that full group. The CSS animation moves exactly half of
        // the track, landing on an identical sequence without a visible gap.
        Array.from(track.children).forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('data-clone', 'true');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    function setupAllTracks() {
        [track1, track2].forEach(track => {
            if (track) {
                // Remove old clones first
                track.querySelectorAll('[data-clone="true"]').forEach(c => c.remove());
                // Create clones again for currently shown items
                setupMarqueeTrack(track);
            }
        });
    }

    renderCustomProjects().finally(setupAllTracks);

    let marqueeResizeTimer;
    window.addEventListener('resize', () => {
        window.clearTimeout(marqueeResizeTimer);
        marqueeResizeTimer = window.setTimeout(setupAllTracks, 150);
    });

    // Filter: show/hide items in both tracks, then re-clone
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            document.getElementById('portfolioMarqueeWrapper')?.classList.toggle('is-scrolling', filterValue === 'all');

            [track1, track2].forEach(track => {
                if (!track) return;
                // First remove clones
                track.querySelectorAll('[data-clone="true"]').forEach(c => c.remove());
                // Show/hide originals
                track.querySelectorAll('.portfolio-item:not([data-clone])').forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.add('show');
                        item.style.display = 'block';
                    } else {
                        item.classList.remove('show');
                        item.style.display = 'none';
                    }
                });
                // Re-clone visible items
                setupMarqueeTrack(track);
            });
        });
    });

    /* ==========================================================================
       TESTIMONIALS SLIDER
       ========================================================================== */
    const slider = document.getElementById('testimonialSlider');
    const dots = document.querySelectorAll('.slider-dot');
    let sliderIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        sliderIndex = index;
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Update dots active status
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            showSlide(index);
            resetAutoSlide();
        });
    });

    function nextSlide() {
        let index = (sliderIndex + 1) % dots.length;
        showSlide(index);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide(); // initialize slide loop

    /* ==========================================================================
       PROJECT DETAIL MODAL DATA & CONTROLLER
       ========================================================================== */
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const viewButtons = document.querySelectorAll('.view-project-btn');

    // Portfolio Database
    const projectsData = {
        'luxury-perfume': {
            title: 'Luxury Perfume Branding',
            category: 'Branding / Identity',
            desc: 'Developed a comprehensive branding portfolio for a luxury boutique perfume line. This project involved custom typographical logomark designs, gold-foil packaging boxes, custom vector patterns, and complete visual guidelines containing font scaling schemes and elegant dark color mappings.',
            tags: ['Adobe Illustrator', 'Photoshop', 'Brand Guideline', 'Print Bleeds']
        },
        'restaurant-logo': {
            title: 'Restaurant Logo Concept',
            category: 'Logo Design',
            desc: 'Conceptualized a minimalist, high-end visual logo layout for "Saffron Kitchen", a premium dining establishment. The work explored custom calligraphy sketches translated into vector form, and set up secondary visual guidelines including business card templates, menus, and typography scales.',
            tags: ['Adobe Illustrator', 'CorelDRAW', 'Vector Branding', 'Calligraphy']
        },
        'corporate-identity': {
            title: 'Tech Firm Corporate Identity',
            category: 'Branding / Identity',
            desc: 'Designed a modern, futuristic corporate branding package for "Zenon Tech". The scope included corporate guidelines, business stationery sets (business cards, letterheads, invoice templates), presentation templates, and digital banners showcasing a sleek technology-focused identity.',
            tags: ['Figma', 'Adobe InDesign', 'Corporate Theme', 'Visual Guidelines']
        },
        'event-poster': {
            title: 'Music Event Poster',
            category: 'Poster Design',
            desc: 'Created an artistic, vibrant promotional poster for an open-air electronic music festival. The layout combined neon glowing lines, custom photos manipulation overlays, modern bold typography, and visual balances that capture immediate customer attention.',
            tags: ['Adobe Photoshop', 'Lightroom', 'Manipulations', 'Graphic Overlays']
        },
        'instagram-campaign': {
            title: 'Instagram Campaign Assets',
            category: 'Social Media Creatives',
            desc: 'Curated a set of 12 puzzle-layout social media templates for a fashion designer launch. The posts featured sleek typography alignment, elegant negative space grids, custom photo borders, and animated transitions optimized to maximize page engagement.',
            tags: ['Canva Pro', 'Figma', 'Social Layouts', 'Layout Grids']
        },
        'youtube-thumbnail': {
            title: 'Tech Review YouTube Thumbnail',
            category: 'YouTube Thumbnail',
            desc: 'Engineered high-click-through-rate (CTR) YouTube thumbnails for a leading technology reviewer. The design emphasizes expression highlights, bold gradient font styles, outline glows, and optimized contrast to maximize display visibility.',
            tags: ['Adobe Photoshop', 'After Effects', 'Thumbnails Layout', 'CTR Design']
        },
        'packaging-design': {
            title: 'Organic Tea Packaging Box',
            category: 'Packaging Design',
            desc: 'Created custom dielines and organic visual designs for a premium loose tea packaging box. The work incorporated botanical drawings, textured card surfaces, clear print indications, and barcode mappings matching retail distribution requirements.',
            tags: ['Adobe Illustrator', 'InDesign', 'Packaging Dielines', 'CMYK Print']
        },
        'school-brochure': {
            title: 'School Prospectus Brochure',
            category: 'Print Materials',
            desc: 'Designed a professional 16-page landscape prospectus catalogue booklet. Laid out custom multi-column grid grids, structured student success tables, color-coded sections, and aligned typography to ensure readability across all age groups.',
            tags: ['Adobe InDesign', 'Photoshop', 'Booklet Layout', 'Print Production']
        },
        'festival-poster': {
            title: 'Cultural Festival Poster',
            category: 'Poster Design',
            desc: 'Rendered a highly decorative poster layout highlighting the traditional heritage of local Kerala festivals. Built complex mandala vector elements, warm orange-gold gradients, and elegant bilingual typographic balances.',
            tags: ['CorelDRAW', 'Adobe Photoshop', 'Cultural Branding', 'Vector Mandalas']
        },
        'cafe-branding': {
            title: 'Cafe Visual Identity Layout',
            category: 'Branding / Identity',
            desc: 'Constructed the brand ecosystem for "Brew & Bites" coffeehouse. Designed a rustic cup logomark, custom craft-paper bag wraps, stamp designs, and interactive digital menus designed for modern tablet displays.',
            tags: ['Adobe Illustrator', 'Figma', 'Cafe Assets', 'Craft Packaging']
        }
    };

    // Event delegation: handle clicks on view buttons and cards inside marquee tracks
    function handleProjectClick(e) {
        const btn = e.target.closest('.view-project-btn');
        const card = e.target.closest('.project-card');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project') || 'luxury-perfume';
            const isAdmin = btn.getAttribute('data-admin') === 'true';
            window.location.href = isAdmin ? `project-details.html?adminId=${projectId}` : `project-details.html?id=${projectId}`;
            return;
        }
        if (card) {
            const innerBtn = card.querySelector('.view-project-btn');
            if (innerBtn) {
                const projectId = innerBtn.getAttribute('data-project') || 'luxury-perfume';
                const isAdmin = innerBtn.getAttribute('data-admin') === 'true';
                window.location.href = isAdmin ? `project-details.html?adminId=${projectId}` : `project-details.html?id=${projectId}`;
            }
        }
    }

    [track1, track2].forEach(track => {
        if (track) track.addEventListener('click', handleProjectClick);
    });

    modalClose.addEventListener('click', closeModalView);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalView();
        }
    });

    function closeModalView() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /* ==========================================================================
       CONTACT FORM CONTROLLER
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set Loading state
            const origContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Sending...';

            // Simulate form submission delay
            setTimeout(() => {
                // Get form values for verification
                const name = document.getElementById('formName').value;
                const email = document.getElementById('formEmail').value;
                const project = document.getElementById('formProjectType').value;

                console.log(`Contact Form Submission: Name: ${name}, Email: ${email}, Project: ${project}`);

                // Reset button and form
                submitBtn.disabled = false;
                submitBtn.innerHTML = origContent;
                contactForm.reset();

                // Success Toast
                showToast(`Thank you, ${name}! Your request has been sent successfully.`);
            }, 1800);
        });
    }

    /* ==========================================================================
       RESUME DOWNLOAD CONTROLLER
       ========================================================================== */
    const resumeBtn = document.getElementById('downloadResume');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const resumeUrl = 'https://cdn.phototourl.com/free/2026-07-21-328bf18e-8173-4526-a641-8eef4a644d8a.png';
            showToast("Downloading Resume...");

            fetch(resumeUrl)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Habeeburahman_Resume.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    showToast("Resume downloaded successfully!");
                })
                .catch(() => {
                    const link = document.createElement('a');
                    link.href = resumeUrl;
                    link.target = '_blank';
                    link.download = 'Habeeburahman_Resume.png';
                    link.click();
                    showToast("Resume opened!");
                });
        });
    }

    /* ==========================================================================
       TOAST NOTIFICATION CONTROLLER
       ========================================================================== */
    const toast = document.getElementById('toast');
    const toastMsg = toast.querySelector('.toast-msg');

    function showToast(message) {
        toastMsg.textContent = message;
        toast.classList.add('active');

        // Clear after duration
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    /* ==========================================================================
       DEEP SPACE STARFIELD & COSMIC NEBULAE ENGINE (MATCHING REFERENCE IMAGE 2)
       ========================================================================== */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let shootingStars = [];
        let mouse = { x: null, y: null, radius: 180 };

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.8 + 0.3; // tiny crisp stars
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = (Math.random() - 0.5) * 0.15;
                this.alpha = Math.random() * 0.8 + 0.2;
                this.maxAlpha = Math.random() * 0.7 + 0.3;
                this.twinkleSpeed = Math.random() * 0.03 + 0.008;
                this.colorType = Math.random(); // variation in star hue
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Star Twinkle Effect
                this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.01;
                if (this.alpha > 0.95) this.alpha = 0.95;
                if (this.alpha < 0.15) this.alpha = 0.15;

                // Subtle Mouse Gravity Displacement
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        let force = (mouse.radius - dist) / mouse.radius;
                        let angle = Math.atan2(dy, dx);
                        this.x -= Math.cos(angle) * force * 1.2;
                        this.y -= Math.sin(angle) * force * 1.2;
                    }
                }
            }

            draw(isDark) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                if (isDark) {
                    if (this.colorType > 0.8) {
                        ctx.fillStyle = `rgba(192, 132, 252, ${this.alpha})`; // Purple star
                    } else if (this.colorType > 0.6) {
                        ctx.fillStyle = `rgba(96, 165, 250, ${this.alpha})`; // Cyan/Blue star
                    } else {
                        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; // White star
                    }
                    if (this.size > 1.4) {
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
                    }
                } else {
                    ctx.fillStyle = `rgba(108, 99, 255, ${this.alpha * 0.7})`;
                    if (this.size > 1.4) {
                        ctx.shadowBlur = 3;
                        ctx.shadowColor = "rgba(108, 99, 255, 0.4)";
                    }
                }

                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width * 0.8;
                this.y = Math.random() * height * 0.4;
                this.len = Math.random() * 80 + 40;
                this.speed = Math.random() * 8 + 4;
                this.size = Math.random() * 1.5 + 0.8;
                this.waitTime = Date.now() + Math.random() * 8000 + 4000;
                this.active = false;
            }

            update() {
                if (!this.active) {
                    if (Date.now() > this.waitTime) {
                        this.active = true;
                    }
                    return;
                }

                this.x += this.speed;
                this.y += this.speed * 0.5;

                if (this.x > width || this.y > height) {
                    this.reset();
                }
            }

            draw(isDark) {
                if (!this.active) return;
                let grad = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len * 0.5);
                if (isDark) {
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                    grad.addColorStop(0.4, 'rgba(168, 85, 247, 0.6)');
                    grad.addColorStop(1, 'rgba(124, 58, 237, 0)');
                } else {
                    grad.addColorStop(0, 'rgba(108, 99, 255, 0.8)');
                    grad.addColorStop(1, 'rgba(108, 99, 255, 0)');
                }

                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.len, this.y - this.len * 0.5);
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.stroke();
            }
        }

        function initStars() {
            stars = [];
            shootingStars = [];
            const count = Math.min(Math.floor((width * height) / 4500), 220); // dense starfield
            for (let i = 0; i < count; i++) {
                stars.push(new Star());
            }
            for (let s = 0; s < 3; s++) {
                shootingStars.push(new ShootingStar());
            }
        }

        function drawBackgroundNebulae(isDark) {
            if (!isDark) return;
            const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.15, 50, width * 0.5, height * 0.5, width * 0.8);
            bgGrad.addColorStop(0, 'rgba(42, 14, 97, 0.35)');
            bgGrad.addColorStop(0.5, 'rgba(15, 10, 35, 0.2)');
            bgGrad.addColorStop(1, 'rgba(3, 0, 20, 0)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);
        }

        let blackHoleTime = 0;
        function drawBlackHoleVortex(isDark) {
            if (!isDark) return;
            blackHoleTime += 0.012;

            const cx = width * 0.5;
            const cy = -20;

            ctx.save();

            // 1. Soft Ambient Downward Light Beam
            const lightGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy + 180, Math.min(width * 0.5, 600));
            lightGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
            lightGrad.addColorStop(0.35, 'rgba(124, 58, 237, 0.2)');
            lightGrad.addColorStop(0.7, 'rgba(42, 14, 97, 0.08)');
            lightGrad.addColorStop(1, 'rgba(3, 0, 20, 0)');
            
            ctx.fillStyle = lightGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, Math.min(width * 0.55, 650), 0, Math.PI);
            ctx.fill();

            // 2. Swirling Accretion Disk Rings
            const ringCount = 5;
            for (let i = 0; i < ringCount; i++) {
                const rx = Math.min(width * 0.3, 380) + i * 35 + Math.sin(blackHoleTime + i) * 6;
                const ry = 80 + i * 14 + Math.cos(blackHoleTime + i) * 4;
                const opacity = (1 - i / ringCount) * 0.65 + 0.15;

                ctx.beginPath();
                ctx.ellipse(cx, cy + 25 + i * 5, rx, ry, 0, 0, Math.PI);
                ctx.strokeStyle = i === 0 ? 'rgba(255, 255, 255, 0.95)' : `rgba(168, 85, 247, ${opacity})`;
                ctx.lineWidth = i === 0 ? 3.5 : 2 - i * 0.3;
                ctx.shadowColor = i === 0 ? '#ffffff' : '#a855f7';
                ctx.shadowBlur = i === 0 ? 25 : 15;
                ctx.stroke();
            }

            // 3. Bright Event Horizon Arc
            const mainRx = Math.min(width * 0.28, 330);
            ctx.beginPath();
            ctx.ellipse(cx, cy + 28, mainRx, 75, 0, Math.PI * 0.08, Math.PI * 0.92);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#e9d5ff';
            ctx.shadowBlur = 30;
            ctx.stroke();

            // 4. Orbiting Vortex Swirl Particles
            for (let p = 0; p < 28; p++) {
                const angle = blackHoleTime * (1 + (p % 3) * 0.4) + (p * Math.PI * 2) / 28;
                const radiusX = mainRx * 0.7 + (p * 8) % (mainRx * 0.7);
                const radiusY = 45 + (p * 3) % 35;
                const px = cx + Math.cos(angle) * radiusX;
                const py = cy + 28 + Math.sin(angle) * radiusY;

                if (py > cy) {
                    ctx.beginPath();
                    ctx.arc(px, py, 1.2 + (p % 2) * 0.8, 0, Math.PI * 2);
                    ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(192, 132, 252, 0.85)';
                    ctx.shadowColor = '#c084fc';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                }
            }

            ctx.restore();
        }

        function animateBgCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

            drawBackgroundNebulae(isDark);
            drawBlackHoleVortex(isDark);

            stars.forEach(s => {
                s.update();
                s.draw(isDark);
            });

            shootingStars.forEach(ss => {
                ss.update();
                ss.draw(isDark);
            });

            requestAnimationFrame(animateBgCanvas);
        }

        resizeCanvas();
        animateBgCanvas();
    }
});
