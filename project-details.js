/* ==========================================================================
   PROJECT DETAILS & WORKS GALLERY DATABASE
   ==========================================================================
   To add new works to any project category, simply add an entry with:
     - image: "path/to/image.jpg" or "https://..."
     - title: "Work Title"
     - caption: "Short description of this specific design"
   ========================================================================== */

const PROJECTS_DATABASE = {
    'luxury-perfume': {
        id: 'luxury-perfume',
        title: 'Luxury Perfume Branding',
        category: 'Branding / Identity',
        client: 'Elixir Parfum Paris',
        year: '2026',
        role: 'Brand Identity Designer',
        desc: 'Comprehensive brand identity and luxury packaging suite designed for a high-end boutique fragrance line. The project spans custom logo design, gold-embossed box packaging, bottle typography, visual style guidelines, and marketing collateral.',
        tools: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Brand Guidelines'],
        works: [
            {
                image: 'assets/projects/luxury-perfume.jpg',
                title: 'Main Brand Identity Showcase',
                caption: 'Official brand mark presentation with luxury gold and deep purple palette.'
            },
            {
                image: 'https://i.postimg.cc/Xrc1nCkN/branding.jpg',
                title: 'Packaging & Bottle Design',
                caption: 'Custom gold-foil box packaging and perfume glass bottle print layout.'
            },
            {
                image: 'assets/projects/restaurant-logo.jpg',
                title: 'Typography & Color Scheme',
                caption: 'Strict typography scaling guides and visual color tokens for digital & print.'
            }
        ]
    },
    'restaurant-logo': {
        id: 'restaurant-logo',
        title: 'Restaurant Logo & Dining Concept',
        category: 'Logo Design',
        client: 'Saffron Kitchen',
        year: '2026',
        role: 'Logo & Visual Designer',
        desc: 'Minimalist logo mark and branding system created for "Saffron Kitchen", a premium dining establishment. The project features hand-drawn calligraphy sketches vectorized to perfection, complete with menu designs and staff apparel badges.',
        tools: ['Adobe Illustrator', 'CorelDRAW', 'Calligraphy', 'Figma'],
        works: [
            {
                image: 'assets/projects/restaurant-logo.jpg',
                title: 'Official Logo & Iconography',
                caption: 'Vector logo mark incorporating spice motifs and contemporary typography.'
            },
            {
                image: 'https://i.postimg.cc/fVjqM9fS/logo1.jpg',
                title: 'Menu Card & Stationeries',
                caption: 'Elegant leather-textured menu cover design and business card mockups.'
            }
        ]
    },
    'custom-poster': {
        id: 'custom-poster',
        title: 'Poster & Flyer Design Showcase',
        category: 'Poster Design',
        client: 'Multiple Events & Brands',
        year: '2026',
        role: 'Graphic Designer',
        desc: 'A curated selection of high-impact promotional posters designed for music festivals, cultural events, sports meets, and commercial brand launches. Each poster combines vibrant color contrast, custom photo manipulation, and bold typography.',
        tools: ['Adobe Photoshop', 'Lightroom', 'Manipulations', 'Canva Pro'],
        works: [
            {
                image: 'assets/projects/event-poster.jpg',
                title: 'Music Event Festival Poster',
                caption: 'Open-air electronic concert poster with neon line effects and typography.'
            },
            {
                image: 'https://i.postimg.cc/gJW11YHG/poster.jpg',
                title: 'Cultural Festival Artwork',
                caption: 'Bilingual traditional festival poster featuring mandala artwork and gold gradients.'
            }
        ]
    },
    'instagram-campaign': {
        id: 'instagram-campaign',
        title: 'Social Media Creatives & Campaigns',
        category: 'Social Media',
        client: 'Fashion & Tech Clients',
        year: '2026',
        role: 'Social Media Designer',
        desc: 'High-converting social media creative assets built for Instagram feeds, stories, Facebook banners, and promotional ads. Optimized to maximize CTR and visual grid aesthetics.',
        tools: ['Canva Pro', 'Figma', 'Photoshop', 'Grid Layouts'],
        works: [
            {
                image: 'https://i.postimg.cc/Xrc1nCkN/branding.jpg',
                title: 'Instagram Grid Layout',
                caption: '12-post grid puzzle layout designed for brand launch.'
            },
            {
                image: 'assets/projects/event-poster.jpg',
                title: 'Story & Reel Cover Templates',
                caption: 'Animated highlight icons and promotional story templates.'
            }
        ]
    },
    'youtube-thumbnail': {
        id: 'youtube-thumbnail',
        title: 'YouTube Thumbnail Design',
        category: 'YouTube Thumbnail',
        client: 'Tech & Lifestyle Creators',
        year: '2026',
        role: 'Thumbnail Specialist',
        desc: 'High-CTR thumbnail covers designed specifically for YouTube channels. Features high-contrast cutout effects, expressive facial highlights, glowing outline vectors, and readable bold typography.',
        tools: ['Adobe Photoshop', 'After Effects', 'Lightroom'],
        works: [
            {
                image: 'https://i.postimg.cc/DzstCWsB/thumbnail.jpg',
                title: 'Tech Review Thumbnail',
                caption: 'High CTR thumbnail layout for smartphone unboxing review video.'
            }
        ]
    },
    'packaging-design': {
        id: 'packaging-design',
        title: 'Packaging & Product Box Design',
        category: 'Packaging Design',
        client: 'Botanica Tea Co.',
        year: '2026',
        role: 'Packaging Designer',
        desc: 'Custom product packaging, bottle labels, and merchandise box dielines crafted for retail display. Complete with CMYK print-ready bleeds, barcodes, and material finish specifications.',
        tools: ['Adobe Illustrator', 'InDesign', 'Packaging Dielines'],
        works: [
            {
                image: 'assets/projects/luxury-perfume.jpg',
                title: 'Organic Tea Box Packaging',
                caption: 'Textured card surface package design with botanical leaf graphics.'
            }
        ]
    },
    'school-brochure': {
        id: 'school-brochure',
        title: 'Brochure & Print Materials Showcase',
        category: 'Print Materials',
        client: 'Educational Institutions',
        year: '2026',
        role: 'Print Layout Designer',
        desc: 'Professional multi-page brochures, corporate flyers, catalogues, and corporate stationery templates structured with clean grid alignment and print production standards.',
        tools: ['Adobe InDesign', 'Photoshop', 'Print Production'],
        works: [
            {
                image: 'assets/projects/restaurant-logo.jpg',
                title: '16-Page Prospectus Brochure',
                caption: 'Landscape catalogue layout with multi-column text grids and table formatting.'
            }
        ]
    },
    'festival-poster': {
        id: 'festival-poster',
        title: 'Cultural Festival Poster Art',
        category: 'Poster Design',
        client: 'Cultural Association',
        year: '2026',
        role: 'Creative Designer',
        desc: 'Custom cultural festival poster art celebrating local traditions with intricate vector mandala patterns, rich gold typography, and warm aesthetic lighting.',
        tools: ['CorelDRAW', 'Photoshop', 'Vector Art'],
        works: [
            {
                image: 'https://i.postimg.cc/gJW11YHG/poster.jpg',
                title: 'Kerala Cultural Festival Poster',
                caption: 'Traditional event poster rendered with warm gold tones and mandala motifs.'
            }
        ]
    }
};

/* ==========================================================================
   PAGE INITIALIZATION & RENDERER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    
    // Theme Toggle Handler
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolioTheme', newTheme);
            if (themeIcon) themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    }

    // Get URL Parameters (e.g. ?id=luxury-perfume or ?adminId=proj_123)
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const adminId   = urlParams.get('adminId');

    let project = null;

    const targetId = adminId || projectId;

    if (targetId) {
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
            
            const found = allProjects.find(p => p.id === targetId);
            if (found) {
                project = {
                    id:       found.id,
                    title:    found.title,
                    category: found.categoryLabel || found.category,
                    client:   found.client || 'Independent Project',
                    year:     found.year || '2026',
                    role:     found.role || 'Graphic Designer',
                    desc:     found.desc || '',
                    tools:    found.tools || [],
                    works:    Array.isArray(found.works) && found.works.length > 0
                        ? found.works
                        : (found.images || (found.image ? [found.image] : [])).map(imgUrl => ({
                            image: imgUrl,
                            title: found.title,
                            caption: found.caption || found.desc || ''
                        }))
                };
            }
        } catch (e) {
            console.warn('Could not load target project.', e);
        }
    }

    // Fallback: check static dictionary if not already found
    if (!project && projectId && PROJECTS_DATABASE[projectId]) {
        project = PROJECTS_DATABASE[projectId];
    }

    // If not found, fallback to luxury-perfume
    if (!project) {
        project = PROJECTS_DATABASE['luxury-perfume'];
    }

    // Populate Page Elements
    document.title = `${project.title} | Habeeburahman Portfolio`;
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectCategory').textContent = project.category;
    document.getElementById('projectDesc').textContent = project.desc;
    document.getElementById('projectClient').textContent = project.client;
    document.getElementById('projectYear').textContent = project.year;

    // Render Tools Tags
    const toolsContainer = document.getElementById('projectTools');
    toolsContainer.innerHTML = project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');

    // Render Works Gallery (Album View)
    const galleryGrid = document.getElementById('worksGalleryGrid');
    if (project.works && project.works.length > 0) {
        // Store images globally for the lightbox
        window.lightboxImages = project.works.map(w => ({
            src: w.image,
            caption: '' // Removed caption from lightbox
        }));
        
        const coverWork = project.works[0];
        const imageCount = project.works.length;
        
        galleryGrid.innerHTML = `
            <div class="album-card-wrap" onclick="openLightbox(0)">
                <div class="work-card album-card">
                    <div class="album-badge"><i class="fa-solid fa-images"></i> ${imageCount} Images</div>
                    <div class="work-img-container">
                        <img src="${coverWork.image}" alt="${escapeHtml(coverWork.title)}" class="work-img" loading="lazy" onerror="this.src='https://via.placeholder.com/600x400?text=Design+Work'">
                        <div class="work-hover-overlay">
                            <i class="fa-regular fa-folder-open"></i>
                            <span>View Album</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        galleryGrid.innerHTML = `<p class="no-works">No design works uploaded for this category yet.</p>`;
    }
});

// Lightbox modal logic
let currentLightboxIndex = 0;

function openLightbox(index) {
    if (!window.lightboxImages || !window.lightboxImages.length) return;
    
    currentLightboxIndex = index;
    updateLightbox();
    
    // Populate Mobile Scroll View
    const scrollView = document.getElementById('lightboxScrollView');
    scrollView.innerHTML = window.lightboxImages.map(img => `
        <div class="scroll-view-item">
            <img src="${img.src}" alt="Design Work" loading="lazy">
            <div class="scroll-view-caption">${img.caption}</div>
        </div>
    `).join('');
    
    const modal = document.getElementById('lightboxModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const imgData = window.lightboxImages[currentLightboxIndex];
    document.getElementById('lightboxImg').src = imgData.src;
    document.getElementById('lightboxCaption').innerHTML = imgData.caption;
    document.getElementById('lightboxCounter').textContent = `${currentLightboxIndex + 1} / ${window.lightboxImages.length}`;
}

document.getElementById('lightboxPrev')?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex > 0) ? currentLightboxIndex - 1 : window.lightboxImages.length - 1;
    updateLightbox();
});

document.getElementById('lightboxNext')?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex < window.lightboxImages.length - 1) ? currentLightboxIndex + 1 : 0;
    updateLightbox();
});

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);

// Close on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (e.target === modal) {
        closeLightbox();
    }
});

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function escapeHtml(text) {
    return text ? text.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
}
