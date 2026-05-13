document.addEventListener('DOMContentLoaded', () => {
    const mockupContainer = document.querySelector('.mockup-container');
    const loader = document.getElementById('loader');
    const img = document.querySelector('.mockup-image');

    // Handle Image Loading
    if (img) {
        if (img.complete) {
            onImageLoad();
        } else {
            img.addEventListener('load', onImageLoad);
        }
    }

    function onImageLoad() {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                mockupContainer.classList.add('loaded');
            }, 500);
        }
    }

    // Smooth Page Transitions
    document.querySelectorAll('.nav-item, .control-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                mockupContainer.classList.remove('loaded');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
});
