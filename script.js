document.addEventListener('DOMContentLoaded', () => {
    const versions = {
        v1: {
            label: 'Version 1',
            pages: [
                { id: 'home', label: 'HOME PAGE', image: 'v1/Home Page - New 01.jpg' },
                { id: 'about', label: 'ABOUT US', image: 'v1/About Us.jpg' },
                { id: 'services', label: 'OUR SERVICES', image: 'v1/Our Services.jpg' },
                { id: 'projects', label: 'OUR PROJECTS', image: 'v1/Our Projects.jpg' },
                { id: 'project-menu', label: 'PROJECT MENU', image: 'v1/Project Menu.jpg' },
                { id: 'explore-project', label: 'EXPLORE PROJECT', image: 'v1/Exploreprojects.jpg' },
                { id: 'ongoing-project', label: 'ONGOING PROJECT', image: 'v1/Ongoing Project.jpg' },
                { id: 'completed-projects', label: 'COMPLETED PROJECTS', image: 'v1/Completed Projects.jpg' },
                { id: 'upcoming-projects', label: 'UPCOMING PROJECTS', image: 'v1/Upcoming Projects.jpg' },
                { id: 'joint-development', label: 'JOINT DEVELOPMENT', image: 'v1/Joint Development.jpg' },
                { id: 'privilege-club', label: 'PRIVILEGE CLUB', image: 'v1/Privilege Club.jpg' },
                { id: 'media', label: 'MEDIA & NEWS', image: 'v1/Media & News.jpg' },
                { id: 'careers', label: 'CAREERS', image: 'v1/Career Page.jpg' },
                { id: 'contact', label: 'CONTACT US', image: 'v1/Contact Us.jpg' }
            ]
        },
        v2: {
            label: 'Version 2',
            pages: [
                { id: 'home', label: 'HOME PAGE', image: 'v2/Home Page - New 01.jpg' },
                { id: 'about', label: 'ABOUT US', image: 'v2/About Us.jpg' },
                { id: 'services', label: 'OUR SERVICES', image: 'v2/Our Services.jpg' },
                { id: 'projects', label: 'OUR PROJECTS', image: 'v2/Our Projects.jpg' },
                { id: 'project-menu', label: 'PROJECT MENU', image: 'v2/Project Menu.jpg' },
                { id: 'explore-project', label: 'EXPLORE PROJECT', image: 'v2/Explore Project.jpg' },
                { id: 'ongoing-project', label: 'ONGOING PROJECT', image: 'v2/Ongoing Projects.jpg' },
                { id: 'completed-projects', label: 'COMPLETED PROJECTS', image: 'v2/Completed Projects.jpg' },
                { id: 'upcoming-projects', label: 'UPCOMING PROJECTS', image: 'v2/Upcoming Projects.jpg' },
                { id: 'joint-development', label: 'JOINT VENTURE', image: 'v2/Joint Venture.jpg' },
                { id: 'privilege-club', label: 'PRIVILEGE CLUB', image: 'v2/Privilege Club.jpg' },
                { id: 'media', label: 'MEDIA & NEWS', image: 'v2/Media & News.jpg' },
                { id: 'careers', label: 'CAREERS', image: 'v2/Career Page.jpg' },
                { id: 'contact', label: 'CONTACT US', image: 'v2/Contact Us.jpg' }
            ]
        },
        mobile: {
            label: 'Mobile View',
            pages: [
                { id: 'home', label: 'HOME PAGE', image: 'mobileramkamal/Home Page.jpg' },
                { id: 'about', label: 'ABOUT US', image: 'mobileramkamal/About Us.jpg' },
                { id: 'services', label: 'OUR SERVICES', image: 'mobileramkamal/Our Services.jpg' },
                { id: 'projects', label: 'OUR PROJECTS', image: 'mobileramkamal/Our Projects.jpg' },
                { id: 'explore-project', label: 'EXPLORE PROJECTS', image: 'mobileramkamal/Explore Projects.jpg' },
                { id: 'ongoing-project', label: 'ONGOING PROJECTS', image: 'mobileramkamal/On going Projects.jpg' },
                { id: 'completed-projects', label: 'COMPLETED PROJECTS', image: 'mobileramkamal/Completed Projects.jpg' },
                { id: 'upcoming-projects', label: 'UPCOMING PROJECTS', image: 'mobileramkamal/Up coming Projects.jpg' },
                { id: 'joint-development', label: 'JOIN VENTURE', image: 'mobileramkamal/Join Venture.jpg' },
                { id: 'privilege-club', label: 'PRIVILEGE CLUB', image: 'mobileramkamal/Priilege Club.jpg' },
                { id: 'media', label: 'MEDIA & NEWS', image: 'mobileramkamal/Media & News.jpg' },
                { id: 'careers', label: 'CAREERS', image: 'mobileramkamal/Career Page.jpg' },
                { id: 'contact', label: 'CONTACT US', image: 'mobileramkamal/Contact Us.jpg' },
                { id: 'menu', label: 'MENU', image: 'mobileramkamal/Menu.jpg' }
            ]
        }
    };

    const versionIds = Object.keys(versions);
    let currentVersion = normalizeVersion(localStorage.getItem('design-version'));
    let currentPageId = versions[currentVersion].pages[0].id;
    let loadToken = 0;

    const loader = document.getElementById('loader');
    const mockupContainer = document.getElementById('mockup-container');
    const mockupImg = document.getElementById('mockup-img');
    const navList = document.getElementById('nav-list');
    const pageNum = document.getElementById('page-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const switcher = document.getElementById('switcher');

    function normalizeVersion(version) {
        return versionIds.includes(version) ? version : 'v1';
    }

    function getPages(version = currentVersion) {
        return versions[normalizeVersion(version)].pages;
    }

    function findPage(version, pageId) {
        return getPages(version).find(page => page.id === pageId);
    }

    function pageExistsInAnyVersion(pageId) {
        return versionIds.find(version => findPage(version, pageId));
    }

    function getPageIndex() {
        return getPages().findIndex(page => page.id === currentPageId);
    }

    function canonicalHash(version, pageId) {
        return `#/${version}/${pageId}`;
    }

    function parseHash() {
        const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

        if (parts.length >= 2 && versionIds.includes(parts[0])) {
            return { version: parts[0], pageId: parts[1] };
        }

        if (parts.length >= 1) {
            return { version: null, pageId: parts[0] };
        }

        return { version: null, pageId: null };
    }

    function resolveRoute() {
        const route = parseHash();
        let version = normalizeVersion(route.version || currentVersion);
        let pageId = route.pageId;

        if (!route.version && pageId) {
            const versionWithPage = pageExistsInAnyVersion(pageId);
            if (versionWithPage && !findPage(version, pageId)) {
                version = versionWithPage;
            }
        }

        if (!pageId || !findPage(version, pageId)) {
            pageId = getPages(version)[0].id;
        }

        return { version, pageId };
    }

    function setRoute(version, pageId) {
        const safeVersion = normalizeVersion(version);
        const page = findPage(safeVersion, pageId) || getPages(safeVersion)[0];
        const nextHash = canonicalHash(safeVersion, page.id);

        if (window.location.hash === nextHash) {
            applyState(safeVersion, page.id, false);
            return;
        }

        window.location.hash = nextHash;
    }

    function syncHash(version, pageId) {
        const nextHash = canonicalHash(version, pageId);
        if (window.location.hash !== nextHash) {
            history.replaceState(null, '', nextHash);
        }
    }

    function applyState(version, pageId, shouldSyncHash = true) {
        currentVersion = normalizeVersion(version);
        currentPageId = pageId;
        localStorage.setItem('design-version', currentVersion);

        if (shouldSyncHash) {
            syncHash(currentVersion, currentPageId);
        }

        render();
    }

    function handleRouting() {
        const route = resolveRoute();
        applyState(route.version, route.pageId);
    }

    function render() {
        document.body.dataset.version = currentVersion;
        renderSidebar();
        renderSwitcher();
        renderControls();
        loadMockup();
    }

    function renderSidebar() {
        const fragment = document.createDocumentFragment();

        getPages().forEach((page, index) => {
            const item = document.createElement('a');
            item.href = canonicalHash(currentVersion, page.id);
            item.className = 'nav-item';
            item.dataset.page = page.id;

            if (page.id === currentPageId) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            }

            item.innerHTML = `
                <span class="nav-number">${String(index + 1).padStart(2, '0')}</span>
                <span class="nav-label">${page.label}</span>
            `;

            fragment.appendChild(item);
        });

        navList.replaceChildren(fragment);
    }

    function renderSwitcher() {
        switcher.querySelectorAll('.switcher-btn').forEach(button => {
            const version = button.dataset.version;
            const isActive = version === currentVersion;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    function renderControls() {
        const pages = getPages();
        const currentIndex = getPageIndex();
        const totalPages = pages.length;
        const canMove = totalPages > 1;

        pageNum.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
        prevBtn.disabled = !canMove;
        nextBtn.disabled = !canMove;
    }

    function loadMockup() {
        const page = findPage(currentVersion, currentPageId);
        if (!page) return;

        const token = ++loadToken;
        mockupContainer.classList.remove('loaded');
        loader.classList.remove('hidden');
        mockupImg.alt = `${versions[currentVersion].label} - ${page.label}`;

        const image = new Image();
        image.onload = () => {
            if (token !== loadToken) return;

            mockupImg.src = page.image;
            requestAnimationFrame(() => {
                mockupContainer.classList.add('loaded');
                loader.classList.add('hidden');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            });
        };

        image.onerror = () => {
            if (token !== loadToken) return;

            mockupImg.src = page.image;
            mockupContainer.classList.add('loaded');
            loader.classList.add('hidden');
            showToast(`Image missing: ${page.image}`);
        };

        image.src = page.image;
    }

    function showToast(message) {
        let toast = document.querySelector('.version-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'version-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast.timeoutId);
        toast.timeoutId = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    switcher.addEventListener('click', event => {
        const button = event.target.closest('.switcher-btn');
        if (!button) return;

        const selectedVersion = normalizeVersion(button.dataset.version);
        if (selectedVersion === currentVersion) return;

        const selectedPage = findPage(selectedVersion, currentPageId) || getPages(selectedVersion)[0];
        setRoute(selectedVersion, selectedPage.id);
    });

    prevBtn.addEventListener('click', () => {
        const pages = getPages();
        if (pages.length <= 1) return;

        const currentIndex = getPageIndex();
        const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
        setRoute(currentVersion, pages[prevIndex].id);
    });

    nextBtn.addEventListener('click', () => {
        const pages = getPages();
        if (pages.length <= 1) return;

        const currentIndex = getPageIndex();
        const nextIndex = (currentIndex + 1) % pages.length;
        setRoute(currentVersion, pages[nextIndex].id);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            prevBtn.click();
        }

        if (event.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    window.addEventListener('hashchange', handleRouting);
    handleRouting();
});
