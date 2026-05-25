document.addEventListener('DOMContentLoaded', () => {
    const mockupContainer = document.querySelector('.mockup-container');
    const loader = document.getElementById('loader');
    const img = document.querySelector('.mockup-image');

    const pageImageMap = {
        'index.html': 'new/Home Page - New 01.jpg',
        'about.html': 'new/About Us.jpg',
        'services.html': 'new/Our Services.jpg',
        'projects.html': 'new/Our Projects.jpg',
        'project-menu.html': 'new/Project Menu.jpg',
        'ongoing-projects.html': 'new/On-going All Project.jpg',
        'ongoing-project.html': 'new/Ongoing Project.jpg',
        'completed-projects.html': 'new/Completed Projects.jpg',
        'upcoming-projects.html': 'new/Upcoming Projects.jpg',
        'joint-development.html': 'new/Joint Development.jpg',
        'privilege-club.html': 'new/Privilege Club.jpg',
        'media.html': 'new/Media & News.jpg',
        'blog.html': 'new/Blog.jpg',
        'career.html': 'new/Career Page.jpg',
        'contact.html': 'new/Contact Us.jpg'
    };

    // Fallback list of available V2 pages (for file:// protocol or CORS errors)
    const hardcodedV2Pages = [
        'index.html',
        'about.html',
        'services.html',
        'projects.html',
        'project-menu.html',
        'ongoing-projects.html',
        'ongoing-project.html',
        'completed-projects.html',
        'upcoming-projects.html',
        'joint-development.html',
        'privilege-club.html',
        'media.html',
        'career.html',
        'contact.html'
    ];

    function getPageKey(href) {
        if (!href) return '';
        const filename = href.substring(href.lastIndexOf('/') + 1);
        if (filename === '' || filename === '/') return 'index.html';
        return filename;
    }

    // Toast Notification Creator
    function showToast(message) {
        let toast = document.querySelector('.version-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'version-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
        }
        
        toast.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Update Page Numbers and Next/Prev Controls
    function updateNavigationState() {
        const version = localStorage.getItem('design-version') || 'v1';
        
        // Apply body class
        if (version === 'v2') {
            document.body.classList.add('v2-active');
        } else {
            document.body.classList.remove('v2-active');
        }

        // Get all visible nav items
        const allNavItems = Array.from(document.querySelectorAll('.nav-item'));
        const visibleNavItems = allNavItems.filter(item => {
            if (version === 'v2') {
                return !item.classList.contains('v2-unavailable');
            }
            return !item.classList.contains('v1-unavailable');
        });

        // Dynamically update numbers to ensure sequential presentation in both versions
        visibleNavItems.forEach((item, idx) => {
            const numEl = item.querySelector('.nav-number');
            if (numEl) {
                numEl.textContent = String(idx + 1).padStart(2, '0');
            }
        });

        const prevBtn = Array.from(document.querySelectorAll('.control-btn')).find(el => el.textContent.trim().toLowerCase() === 'prev');
        const nextBtn = Array.from(document.querySelectorAll('.control-btn')).find(el => el.textContent.trim().toLowerCase() === 'next');
        const pageIndicator = document.querySelector('.page-indicator');

        if (visibleNavItems.length > 0) {
            const currentPathname = window.location.pathname;
            const currentKey = getPageKey(currentPathname);
            
            let currentIndex = visibleNavItems.findIndex(item => {
                const href = item.getAttribute('href');
                return getPageKey(href) === currentKey;
            });

            if (currentIndex === -1) {
                currentIndex = 0;
            }

            const totalPages = visibleNavItems.length;
            
            // Update Page Indicator
            if (pageIndicator) {
                const displayIndex = String(currentIndex + 1).padStart(2, '0');
                const displayTotal = String(totalPages).padStart(2, '0');
                pageIndicator.textContent = `${displayIndex} / ${displayTotal}`;
            }

            // Update Prev Button
            if (prevBtn) {
                if (totalPages <= 1) {
                    prevBtn.style.display = 'none';
                } else {
                    prevBtn.style.display = '';
                    const prevIndex = (currentIndex - 1 + totalPages) % totalPages;
                    prevBtn.setAttribute('href', visibleNavItems[prevIndex].getAttribute('href'));
                }
            }

            // Update Next Button
            if (nextBtn) {
                if (totalPages <= 1) {
                    nextBtn.style.display = 'none';
                } else {
                    nextBtn.style.display = '';
                    const nextIndex = (currentIndex + 1) % totalPages;
                    nextBtn.setAttribute('href', visibleNavItems[nextIndex].getAttribute('href'));
                }
            }
        }
    }

    // Check V2 Image Availability
    async function checkV2Availability() {
        const navItems = document.querySelectorAll('.nav-item');
        const isFileProtocol = window.location.protocol === 'file:';

        const checkPromises = Array.from(navItems).map(async (item) => {
            const href = item.getAttribute('href');
            const key = getPageKey(href);
            const v2Path = pageImageMap[key];
            
            let isAvailable = false;
            
            if (v2Path) {
                if (isFileProtocol) {
                    isAvailable = hardcodedV2Pages.includes(key);
                } else {
                    try {
                        const response = await fetch(v2Path, { method: 'HEAD' });
                        isAvailable = response.ok;
                    } catch (e) {
                        isAvailable = hardcodedV2Pages.includes(key);
                    }
                }
            }

            if (isAvailable) {
                item.classList.remove('v2-unavailable');
            } else {
                item.classList.add('v2-unavailable');
            }
        });

        await Promise.all(checkPromises);
        
        // Update switcher buttons UI
        const currentPath = window.location.pathname;
        const currentKey = getPageKey(currentPath);
        const currentNavItem = Array.from(navItems).find(item => getPageKey(item.getAttribute('href')) === currentKey);
        
        if (currentNavItem && currentNavItem.classList.contains('v2-unavailable')) {
            const v2Btn = document.querySelector('.switcher-btn[data-version="v2"]');
            if (v2Btn) {
                v2Btn.classList.add('unavailable');
            }
        }

        updateNavigationState();
    }

    // Handle Image & Switcher Loading
    if (img) {
        const v1Src = img.getAttribute('src');
        img.setAttribute('data-v1-src', v1Src);

        const currentPath = window.location.pathname;
        const currentKey = getPageKey(currentPath);
        const v2Src = pageImageMap[currentKey] || `new/${currentKey}`;
        img.setAttribute('data-v2-src', v2Src);

        // Read saved preferred version
        const preferredVersion = localStorage.getItem('design-version') || 'v1';
        let currentLoadedVersion = 'v1';

        // Render Version Switcher UI
        const switcher = document.createElement('div');
        switcher.className = 'version-switcher';
        switcher.innerHTML = `
            <button class="switcher-btn" data-version="v1">Design V1</button>
            <button class="switcher-btn" data-version="v2">Design V2</button>
        `;
        document.body.appendChild(switcher);

        // Define load handler
        const handleLoad = () => {
            onImageLoad();
            // Clean up to prevent duplicate triggers
            img.removeEventListener('load', handleLoad);
        };

        // Define error handler for version fallback
        const handleError = () => {
            if (currentLoadedVersion === 'v2') {
                console.warn('V2 image not found, falling back to V1:', v2Src);
                img.src = v1Src;
                currentLoadedVersion = 'v1';
                
                const v2Btn = switcher.querySelector('[data-version="v2"]');
                if (v2Btn) {
                    v2Btn.classList.add('unavailable');
                }
                
                switcher.querySelectorAll('.switcher-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-version') === 'v1');
                });
                
                showToast('Version 2 is not available for this page. Showing Version 1.');
                updateNavigationState();
            }
        };

        // Register event listeners BEFORE setting/changing src
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        // Load preferred version initially
        if (preferredVersion === 'v2') {
            currentLoadedVersion = 'v2';
            img.src = v2Src;
            switcher.querySelector('[data-version="v2"]').classList.add('active');
        } else {
            currentLoadedVersion = 'v1';
            switcher.querySelector('[data-version="v1"]').classList.add('active');
            
            // Since we did not change src, check if it's already complete
            if (img.complete) {
                handleLoad();
            }
        }

        // Switcher click interactions
        switcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.switcher-btn');
            if (!btn) return;

            const selectedVersion = btn.getAttribute('data-version');

            if (btn.classList.contains('unavailable')) {
                showToast('Version 2 is not available for this page.');
                return;
            }

            if (selectedVersion === currentLoadedVersion) return;

            currentLoadedVersion = selectedVersion;
            localStorage.setItem('design-version', selectedVersion);

            switcher.querySelectorAll('.switcher-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
            });

            if (mockupContainer) mockupContainer.classList.remove('loaded');
            if (loader) {
                loader.style.display = 'flex';
                loader.style.opacity = '1';
            }

            setTimeout(() => {
                // Register fresh listeners for the manual change
                img.addEventListener('load', handleLoad);
                img.addEventListener('error', handleError);
                img.src = selectedVersion === 'v2' ? v2Src : v1Src;
                updateNavigationState();
            }, 400);
        });

        // Run the dynamic check for sidebar links
        checkV2Availability();
    } else {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }

    function onImageLoad() {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (mockupContainer) {
                    mockupContainer.classList.add('loaded');
                }
            }, 500);
        }
    }

    // Smooth Page Transitions
    document.querySelectorAll('.nav-item, .control-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                if (mockupContainer) mockupContainer.classList.remove('loaded');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
});


