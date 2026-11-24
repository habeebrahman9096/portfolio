(function () {
    const config = window.PORTFOLIO_SUPABASE;
    const headers = { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}` };
    const apiUrl = path => `${config.url}${path}`;

    async function request(path, options = {}) {
        if (!config || !config.url) {
            throw new Error('Supabase configuration missing.');
        }
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;
        try {
            const response = await fetch(apiUrl(path), {
                ...options,
                signal: controller ? controller.signal : undefined,
                headers: { ...headers, ...(options.headers || {}) }
            });
            if (timeoutId) clearTimeout(timeoutId);
            if (!response.ok) {
                let message = 'Unable to connect to Supabase.';
                try {
                    const error = await response.json();
                    message = error.msg || error.message || error.error_description || message;
                } catch (error) {
                    message = await response.text() || message;
                }
                throw new Error(message);
            }
            return response.status === 204 ? null : response.json();
        } catch (error) {
            if (timeoutId) clearTimeout(timeoutId);
            throw error;
        }
    }

    async function getProjects() {
        return request('/rest/v1/projects?select=*&order=created_at.desc');
    }

    function projectForPortfolio(project) {
        return {
            id: project.id,
            title: project.title,
            category: project.category,
            categoryLabel: project.category_label,
            image: project.image_url,
            desc: project.description,
            client: project.client,
            year: project.year,
            role: project.role,
            tools: project.tools || [],
            works: [{ image: project.image_url, title: project.title, caption: project.caption || '' }]
        };
    }

    function accessToken() {
        return sessionStorage.getItem('portfolioAccessToken');
    }

    function authHeaders() {
        const token = accessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async function signIn(email, password) {
        const result = await request('/auth/v1/token?grant_type=password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        sessionStorage.setItem('portfolioAccessToken', result.access_token);
        return result.user;
    }

    async function signUp(email, password) {
        return request('/auth/v1/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    }

    async function getCurrentUser() {
        const token = accessToken();
        if (!token) return null;
        try {
            return await request('/auth/v1/user', { headers: authHeaders() });
        } catch (error) {
            sessionStorage.removeItem('portfolioAccessToken');
            return null;
        }
    }

    async function createProject(project) {
        return request('/rest/v1/projects', {
            method: 'POST',
            headers: { ...authHeaders(), 'Content-Type': 'application/json', Prefer: 'return=representation' },
            body: JSON.stringify(project)
        });
    }

    async function updateProject(id, project) {
        return request(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { ...authHeaders(), 'Content-Type': 'application/json', Prefer: 'return=representation' },
            body: JSON.stringify(project)
        });
    }

    async function deleteProject(id) {
        return request(`/rest/v1/projects?id=eq.${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { ...authHeaders(), Prefer: 'return=representation' }
        });
    }

    async function uploadImage(file) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
        const objectName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const response = await fetch(apiUrl(`/storage/v1/object/project-images/${objectName}`), {
            method: 'POST',
            headers: { ...headers, ...authHeaders(), 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' },
            body: file
        });
        if (!response.ok) throw new Error(await response.text() || 'Image upload failed.');
        return `${config.url}/storage/v1/object/public/project-images/${objectName}`;
    }

    window.portfolioApi = {
        config,
        getProjects,
        projectForPortfolio,
        signIn,
        signUp,
        getCurrentUser,
        createProject,
        updateProject,
        deleteProject,
        uploadImage,
        signOut: () => sessionStorage.removeItem('portfolioAccessToken')
    };
}());
