/* ============================================================
   ADMIN PANEL — Offline, localStorage-based, Password Protected
   Password: habeeb@admin2026
   ============================================================ */

(function () {
    'use strict';

    /* ── CONFIG ─────────────────────────────────────────────── */
    const ADMIN_PASSWORD   = 'habeeb@admin2026';
    const SESSION_KEY      = 'hb_admin_session';
    const PROJECTS_KEY     = 'hb_portfolio_projects';
    const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

    const CATEGORY_LABELS = {
        branding:   'Branding / Identity',
        logo:       'Logo Design',
        poster:     'Poster Design',
        social:     'Social Media',
        print:      'Print Materials',
        thumbnail:  'YouTube Thumbnail',
        packaging:  'Packaging Design',
        other:      'Other'
    };

    const DELETED_KEY     = 'hb_portfolio_deleted_ids';

    /* ── HELPERS ─────────────────────────────────────────────── */
    function getDeletedIds() {
        try { return JSON.parse(localStorage.getItem(DELETED_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function saveDeletedIds(ids) {
        localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
    }

    function getProjects() {
        try {
            const rawLocal = localStorage.getItem(PROJECTS_KEY);
            const localProjects = rawLocal ? JSON.parse(rawLocal) : null;
            const staticProjects = window.PROJECTS_DATABASE || [];
            const deletedIds = getDeletedIds();

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
            return allProjects.filter(p => !deletedIds.includes(p.id));
        } catch (e) {
            return (window.PROJECTS_DATABASE || []).filter(p => !getDeletedIds().includes(p.id));
        }
    }

    function saveProjects(projects) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

    function generateId() {
        return 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    }

    function isSessionValid() {
        try {
            const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
            return session && session.expires > Date.now();
        } catch (e) { return false; }
    }

    function createSession() {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            expires: Date.now() + SESSION_DURATION
        }));
    }

    function destroySession() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    /* ── TOAST ───────────────────────────────────────────────── */
    const toastEl = document.getElementById('toast');
    let toastTimer;
    function showToast(msg, isError = false) {
        toastEl.textContent = msg;
        toastEl.style.borderColor = isError ? 'rgba(239,68,68,0.4)' : '';
        toastEl.style.color = isError ? '#ef4444' : '';
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
    }

    /* ── AUTH ELEMENTS ───────────────────────────────────────── */
    const authGate      = document.getElementById('authGate');
    const adminContent  = document.getElementById('adminContent');
    const authForm      = document.getElementById('authForm');
    const authPassword  = document.getElementById('authPassword');
    const authMessage   = document.getElementById('authMessage');
    const authSubmit    = document.getElementById('authSubmit');
    const togglePwdBtn  = document.getElementById('togglePassword');
    const logoutBtn     = document.getElementById('logoutBtn');

    /* ── FORM ELEMENTS ───────────────────────────────────────── */
    const projectForm   = document.getElementById('projectForm');
    const fTitle        = document.getElementById('fTitle');
    const fCategory     = document.getElementById('fCategory');
    const fImage        = document.getElementById('fImage');
    const fDesc         = document.getElementById('fDesc');
    const fClient       = document.getElementById('fClient');
    const fYear         = document.getElementById('fYear');
    const fTools        = document.getElementById('fTools');
    const dropZone      = document.getElementById('dropZone');
    const previewWrap   = document.getElementById('imagePreviewWrap');
    const clearImageBtn = document.getElementById('clearImage');
    const formTitle     = document.getElementById('formTitle');
    const saveIcon      = document.getElementById('saveIcon');
    const saveLabel     = document.getElementById('saveLabel');
    const cancelEditBtn = document.getElementById('cancelEdit');

    /* ── LIST ELEMENTS ───────────────────────────────────────── */
    const projectList   = document.getElementById('projectList');
    const projectCount  = document.getElementById('projectCount');
    const emptyState    = document.getElementById('emptyState');
    const clearAllBtn   = document.getElementById('clearAll');

    let editingId   = null;
    let imageGallery = []; // stores base64 of newly selected images

    /* ══════════════════════════════════════════════════════════
       AUTH LOGIC
       ══════════════════════════════════════════════════════════ */
    function showAdmin() {
        authGate.hidden = true;
        adminContent.hidden = false;
        renderProjects();
    }

    function showLogin() {
        authGate.hidden = false;
        adminContent.hidden = true;
    }

    // Auto-login if session still valid
    if (isSessionValid()) {
        showAdmin();
    }

    // Toggle password visibility
    togglePwdBtn.addEventListener('click', () => {
        const isHidden = authPassword.type === 'password';
        authPassword.type = isHidden ? 'text' : 'password';
        togglePwdBtn.querySelector('i').className = isHidden
            ? 'fa-solid fa-eye-slash'
            : 'fa-solid fa-eye';
    });

    // Login form submit
    authForm.addEventListener('submit', e => {
        e.preventDefault();
        const pwd = authPassword.value.trim();
        if (pwd === ADMIN_PASSWORD) {
            createSession();
            authMessage.hidden = true;
            authPassword.value = '';
            showAdmin();
            showToast('Welcome back, Habeeb! 👋');
        } else {
            authMessage.textContent = 'Incorrect password. Please try again.';
            authMessage.hidden = false;
            authPassword.value = '';
            authPassword.focus();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        destroySession();
        showLogin();
        showToast('Signed out successfully.');
    });

    /* ══════════════════════════════════════════════════════════
       IMAGE UPLOAD — Drag & Drop + File Input
       ══════════════════════════════════════════════════════════ */

    // Drag & drop handlers
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) handleImageFiles(Array.from(e.dataTransfer.files));
    });

    // File input change
    fImage.addEventListener('change', () => {
        if (fImage.files.length) handleImageFiles(Array.from(fImage.files));
    });

    const previewGallery = document.getElementById('previewGallery');

    function renderPreviewGallery() {
        previewGallery.innerHTML = '';
        if (imageGallery.length === 0) {
            previewWrap.hidden = true;
            dropZone.hidden = false;
            return;
        }

        previewWrap.hidden = false;
        dropZone.hidden = false; // keep drop zone visible so user can add more images easily

        imageGallery.forEach((src, idx) => {
            const item = document.createElement('div');
            item.className = 'preview-thumb-item' + (idx === 0 ? ' is-cover' : '');

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Preview ${idx + 1}`;

            // Cover badge or Set Cover button
            if (idx === 0) {
                const coverTag = document.createElement('span');
                coverTag.className = 'cover-tag';
                coverTag.innerHTML = '<i class="fa-solid fa-star"></i> Cover';
                item.appendChild(coverTag);
            } else {
                const setCoverBtn = document.createElement('button');
                setCoverBtn.type = 'button';
                setCoverBtn.className = 'set-cover-btn';
                setCoverBtn.title = 'Set as main cover image';
                setCoverBtn.innerHTML = '<i class="fa-regular fa-star"></i> Set Cover';
                setCoverBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const [chosen] = imageGallery.splice(idx, 1);
                    imageGallery.unshift(chosen);
                    renderPreviewGallery();
                    showToast('Set as main cover image! 🌟');
                });
                item.appendChild(setCoverBtn);
            }

            // Delete button
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-thumb-btn';
            removeBtn.title = 'Remove this image';
            removeBtn.setAttribute('aria-label', 'Remove image');
            removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageGallery.splice(idx, 1);
                renderPreviewGallery();
            });

            // Reorder bar (Move Left / Move Right)
            if (imageGallery.length > 1) {
                const reorderBar = document.createElement('div');
                reorderBar.className = 'thumb-reorder-bar';

                if (idx > 0) {
                    const moveLeftBtn = document.createElement('button');
                    moveLeftBtn.type = 'button';
                    moveLeftBtn.className = 'move-thumb-btn';
                    moveLeftBtn.title = 'Move Left';
                    moveLeftBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
                    moveLeftBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const temp = imageGallery[idx];
                        imageGallery[idx] = imageGallery[idx - 1];
                        imageGallery[idx - 1] = temp;
                        renderPreviewGallery();
                    });
                    reorderBar.appendChild(moveLeftBtn);
                }

                if (idx < imageGallery.length - 1) {
                    const moveRightBtn = document.createElement('button');
                    moveRightBtn.type = 'button';
                    moveRightBtn.className = 'move-thumb-btn';
                    moveRightBtn.title = 'Move Right';
                    moveRightBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
                    moveRightBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const temp = imageGallery[idx];
                        imageGallery[idx] = imageGallery[idx + 1];
                        imageGallery[idx + 1] = temp;
                        renderPreviewGallery();
                    });
                    reorderBar.appendChild(moveRightBtn);
                }

                item.appendChild(reorderBar);
            }

            item.append(img, removeBtn);
            previewGallery.appendChild(item);
        });
    }

    function handleImageFiles(files) {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        let validFiles = files.filter(f => allowed.includes(f.type));
        
        if (validFiles.length < files.length) {
            showToast('Some files skipped (only JPEG, PNG, WebP allowed).', true);
        }
        
        if (!validFiles.length) return;

        let processedCount = 0;
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    // Compress & resize
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1200;
                    
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to compressed JPEG (80% quality)
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);
                    imageGallery.push(base64);
                    processedCount++;
                    if (processedCount === validFiles.length) {
                        renderPreviewGallery();
                    }
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Clear image selection
    clearImageBtn.addEventListener('click', () => {
        imageGallery = [];
        renderPreviewGallery();
        fImage.value = '';
    });

    /* ══════════════════════════════════════════════════════════
       FORM — Add / Edit Project
       ══════════════════════════════════════════════════════════ */
    function resetForm() {
        editingId    = null;
        imageGallery = [];
        projectForm.reset();
        fYear.value  = new Date().getFullYear();
        renderPreviewGallery();
        fImage.value = '';
        formTitle.textContent  = 'Add a Project';
        saveLabel.textContent  = 'Add Project';
        saveIcon.className     = 'fa-solid fa-plus';
        cancelEditBtn.hidden   = true;
    }

    function beginEdit(project) {
        editingId = project.id;
        fTitle.value    = project.title;
        fCategory.value = project.category || 'branding';
        fDesc.value     = project.desc || '';
        fClient.value   = project.client || '';
        fYear.value     = project.year || '2026';
        fTools.value    = (project.tools || []).join(', ');
        
        // show existing images
        imageGallery = Array.isArray(project.images) && project.images.length > 0 
            ? [...project.images] 
            : (project.image ? [project.image] : []);
            
        renderPreviewGallery();
        formTitle.textContent  = 'Edit Project';
        saveLabel.textContent  = 'Save Changes';
        saveIcon.className     = 'fa-solid fa-floppy-disk';
        cancelEditBtn.hidden   = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelEditBtn.addEventListener('click', resetForm);

    function getProjectById(id) {
        return getProjects().find(p => p.id === id);
    }

    projectForm.addEventListener('submit', e => {
        e.preventDefault();

        // For a new or edited project, at least one image is required
        if (imageGallery.length === 0) {
            showToast('Please select or keep at least one project image.', true);
            return;
        }

        const tools = fTools.value.split(',').map(t => t.trim()).filter(Boolean);
        const category = fCategory.value;
        
        const project = {
            id:            editingId || generateId(),
            title:         fTitle.value.trim(),
            category:      category,
            categoryLabel: CATEGORY_LABELS[category] || category,
            images:        [...imageGallery],
            image:         imageGallery[0] || '',
            desc:          fDesc.value.trim(),
            client:        fClient.value.trim() || 'Independent Project',
            year:          fYear.value.trim() || String(new Date().getFullYear()),
            tools:         tools,
            createdAt:     editingId ? (getProjectById(editingId)?.createdAt || Date.now()) : Date.now()
        };

        const projects = getProjects();
        if (editingId) {
            const idx = projects.findIndex(p => p.id === editingId);
            if (idx !== -1) {
                projects[idx] = project;
            } else {
                projects.unshift(project);
            }
        } else {
            projects.unshift(project); // newest first
        }

        try {
            saveProjects(projects);
            if (editingId) {
                showToast('Project updated! ✅');
            } else {
                showToast('Project added to portfolio! 🎨');
            }
            renderProjects();
            resetForm();
        } catch (e) {
            console.error(e);
            showToast('Storage limit exceeded! Try smaller images or delete old projects.', true);
        }
    });

    function getProjectById(id) {
        return getProjects().find(p => p.id === id) || null;
    }

    /* ══════════════════════════════════════════════════════════
       RENDER PROJECT LIST
       ══════════════════════════════════════════════════════════ */
    function renderProjects() {
        const projects = getProjects();
        projectList.innerHTML = '';
        projectCount.textContent = projects.length;
        emptyState.hidden  = projects.length > 0;
        clearAllBtn.hidden = projects.length === 0;

        projects.forEach(project => {
            const row = document.createElement('article');
            row.className = 'admin-project';

            const img = document.createElement('img');
            const firstImage = Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : (project.image || '');
            img.src = firstImage;
            img.alt = project.title;
            img.onerror = () => { img.src = 'https://via.placeholder.com/80x64?text=?'; };

            const info = document.createElement('div');
            info.style.overflow = 'hidden';

            const titleEl = document.createElement('h3');
            titleEl.textContent = project.title;

            const metaEl = document.createElement('p');
            metaEl.textContent = `${project.categoryLabel} · ${project.year}`;

            info.append(titleEl, metaEl);

            const actions = document.createElement('div');
            actions.className = 'project-actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.title = 'Edit';
            editBtn.setAttribute('aria-label', `Edit ${project.title}`);
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editBtn.addEventListener('click', () => beginEdit(project));

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete';
            deleteBtn.title = 'Delete';
            deleteBtn.setAttribute('aria-label', `Delete ${project.title}`);
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteProject(project));

            actions.append(editBtn, deleteBtn);
            row.append(img, info, actions);
            projectList.appendChild(row);
        });
    }

    /* ══════════════════════════════════════════════════════════
       DELETE PROJECT
       ══════════════════════════════════════════════════════════ */
    function deleteProject(project) {
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

        const deletedIds = getDeletedIds();
        if (!deletedIds.includes(project.id)) {
            deletedIds.push(project.id);
            saveDeletedIds(deletedIds);
        }

        const projects = getProjects().filter(p => p.id !== project.id);
        saveProjects(projects);

        if (editingId === project.id) resetForm();
        renderProjects();
        showToast('Project deleted.');
    }

    clearAllBtn.addEventListener('click', () => {
        if (!window.confirm('Delete ALL added projects? This cannot be undone.')) return;

        const allProjects = getProjects();
        const deletedIds = getDeletedIds();
        allProjects.forEach(p => {
            if (!deletedIds.includes(p.id)) deletedIds.push(p.id);
        });
        saveDeletedIds(deletedIds);
        saveProjects([]);

        resetForm();
        renderProjects();
        showToast('All projects cleared.');
    });

    /* ══════════════════════════════════════════════════════════
       EXPORT DATA
       ══════════════════════════════════════════════════════════ */
    const exportDataBtn = document.getElementById('exportDataBtn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const projects = getProjects();
            if (projects.length === 0) {
                showToast('No projects to export!', true);
                return;
            }

            const dataStr = `window.PROJECTS_DATABASE = ${JSON.stringify(projects, null, 4)};`;
            const blob = new Blob([dataStr], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'projects_data.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('Data exported successfully! Replace your local projects_data.js file.');
        });
    }

    // Update export button visibility
    const origRenderProjects = renderProjects;
    renderProjects = function() {
        origRenderProjects();
        const hasProjects = getProjects().length > 0;
        if (exportDataBtn) exportDataBtn.hidden = !hasProjects;
    }

    /* ── INIT ─────────────────────────────────────────────────── */
    resetForm();
    renderProjects();

}());
