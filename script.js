// DreamCanvas Legal Pages - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initScrollToTop();
    initActiveSection();
    initTableOfContents();
    initAnimations();
    initAccessibility();
});

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset for sticky header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
                
                // Focus management for accessibility
                targetElement.focus({ preventScroll: true });
            }
        });
    });
}

/**
 * Scroll to top button functionality
 */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleScrollButton, 10);
    });
    
    // Click handler
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus management
        document.querySelector('h1').focus({ preventScroll: true });
    });
    
    // Initial check
    toggleScrollButton();
}

/**
 * Active section highlighting in navigation
 */
function initActiveSection() {
    const sections = document.querySelectorAll('.section[id]');
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset + 150; // Offset for header
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update TOC links
        tocLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update section highlighting
        sections.forEach(section => {
            if (section.getAttribute('id') === currentSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 10);
    });
    
    // Initial check
    updateActiveSection();
}

/**
 * Enhanced table of contents functionality
 */
function initTableOfContents() {
    const toc = document.querySelector('.toc');
    const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    
    if (!toc || tocLinks.length === 0) return;
    
    // Add progress indicators
    tocLinks.forEach((link, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'toc-progress';
        progressBar.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
            border-radius: inherit;
            transition: width 0.3s ease;
            z-index: -1;
        `;
        
        link.style.position = 'relative';
        link.appendChild(progressBar);
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Collapse/expand functionality for mobile
    if (window.innerWidth <= 768) {
        const tocHeader = toc.querySelector('h3');
        const tocContent = toc.querySelector('ul');
        
        if (tocHeader && tocContent) {
            tocHeader.style.cursor = 'pointer';
            tocHeader.innerHTML += ' <span class="toc-toggle">▼</span>';
            
            const toggle = tocHeader.querySelector('.toc-toggle');
            let isExpanded = true;
            
            tocHeader.addEventListener('click', function() {
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    tocContent.style.display = 'grid';
                    toggle.textContent = '▼';
                } else {
                    tocContent.style.display = 'none';
                    toggle.textContent = '▶';
                }
            });
        }
    }
}

/**
 * Subtle animations and interactions
 */
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('.section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(section);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Hover effects for content blocks
    const contentBlocks = document.querySelectorAll(`
        .data-category, .ai-info, .ads-info, .firebase-service,
        .security-measure, .user-right, .retention-policy,
        .third-party-service, .definition-item, .service-feature,
        .responsibility, .account-management, .ai-disclaimer,
        .ads-terms, .ip-rights, .prohibited-use,
        .service-interruption, .account-termination,
        .liability-limitation, .governing-law, .terms-changes
    `);
    
    contentBlocks.forEach(block => {
        block.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.01)';
        });
        
        block.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Accessibility enhancements
 */
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Ana içeriğe geç';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
    }
    
    // Keyboard navigation for TOC
    const tocLinks = document.querySelectorAll('.toc a');
    tocLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' && index < tocLinks.length - 1) {
                e.preventDefault();
                tocLinks[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                e.preventDefault();
                tocLinks[index - 1].focus();
            }
        });
    });
    
    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
    
    // Announce section changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        const section = document.getElementById(hash);
        if (section) {
            const heading = section.querySelector('h2');
            if (heading) {
                announcer.textContent = `Bölüm: ${heading.textContent}`;
            }
        }
    });
    
    // Focus management for modal-like interactions
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any expanded mobile TOC
            const tocContent = document.querySelector('.toc ul');
            const tocToggle = document.querySelector('.toc-toggle');
            if (tocContent && tocToggle && tocContent.style.display === 'none') {
                tocContent.style.display = 'grid';
                tocToggle.textContent = '▼';
            }
        }
    });
}

/**
 * Utility functions
 */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function(target, duration = 500) {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    };
    
    // Override smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollPolyfill(target);
            }
        });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }
        }, 0);
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}