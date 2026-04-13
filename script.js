// ==========================================
// --- Scroll Spy & Sliding Indicator ---
// ==========================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');
const indicator = document.querySelector('.active-indicator');

// Function to move the sliding background to the active link
// Function to move the sliding background to the active link
// Function to move the sliding background and change its color
function moveIndicator(activeLink) {
    const indicator = document.querySelector('.active-indicator');
    const pillNav = document.querySelector('.pill-nav');
    if (!activeLink || !indicator || !pillNav) return;
    
    // 1. Move the slider
    const linkTop = activeLink.offsetTop;
    const linkLeft = activeLink.offsetLeft;
    const linkWidth = activeLink.offsetWidth;
    const linkHeight = activeLink.offsetHeight;
    
    indicator.style.top = `${linkTop}px`;
    indicator.style.left = `${linkLeft}px`;
    indicator.style.width = `${linkWidth}px`;
    indicator.style.height = `${linkHeight}px`;

    // 2. The Color Palette Map (Matches section IDs to colors)
    const sectionId = activeLink.getAttribute('href').substring(1);
    
    // 2. The Color Palette Map (Extracted from your image)
    const palette = {
        'home': { bg: '#aee5d3', text: '#000000' },         // 1. Mint Green
        'about': { bg: '#fcccae', text: '#000000' },         // 2. Soft Peach
        'academic': { bg: '#cbd5eb', text: '#000000' },      // 3. Periwinkle Blue
        'certificates': { bg: '#f4cce3', text: '#000000' },  // 4. Soft Pink
        'projects': { bg: '#e3f2cd', text: '#000000' },      // 5. Pale Lime/Green     
        'feedback': { bg: '#eee0cd', text: '#000000' }       // 7. Warm Beige
    };

    // 3. Apply the color transition dynamically
    if (palette[sectionId]) {
        pillNav.style.setProperty('--indicator-bg', palette[sectionId].bg);
        pillNav.style.setProperty('--active-text', palette[sectionId].text);
    }
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4 // Triggers when 40% of a section is visible
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navItems.forEach(item => item.classList.remove('active-link'));
            
            // Get the ID of the section on screen
            const activeId = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
            
            if (activeLink) {
                // Add active text color
                activeLink.classList.add('active-link');
                // Slide the background indicator to this link
                moveIndicator(activeLink);
            }
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
});

// Re-calculate indicator position if the window is resized
window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-links a.active-link');
    if (currentActive) moveIndicator(currentActive);
});

// Run once on load to set initial position
setTimeout(() => {
    const initialActive = document.querySelector('.nav-links a.active-link');
    if (initialActive) moveIndicator(initialActive);
}, 100);

// ==========================================
// --- Modal & PDF Viewer Logic ---
// ==========================================
const modal = document.getElementById('document-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-modal');
const viewBtns = document.querySelectorAll('.view-doc-btn');

if (modal && viewBtns.length > 0) {
    
    // 1. Open Modal & Inject PDF
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the PDF path from the button's data attribute
            const pdfPath = this.getAttribute('data-pdf');
            
            if (pdfPath) {
                // Create an iframe to display the PDF
                modalBody.innerHTML = `<iframe src="${pdfPath}" class="pdf-frame"></iframe>`;
            } else {
                modalBody.innerHTML = `<p style="text-align:center; margin-top:50px;">Document path not found.</p>`;
            }
            
            // Show the modal
            modal.style.display = 'block';
            
            // Optional: Disable background scrolling when modal is open
            document.body.style.overflow = 'hidden'; 
        });
    });

    // 2. Close Modal Logic
    function closeModal() {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear iframe so audio/loading stops in background
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal if user clicks outside the modal box
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
}

// --- Drag to Scroll for Carousels ---
const slider = document.getElementById('academic-track');
let isDown = false;
let startX;
let scrollLeft;

if (slider) {
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        slider.scrollLeft = scrollLeft - walk;
    });
}
// --- Arrow Button Scrolling ---
const slideLeftBtn = document.getElementById('slide-left');
const slideRightBtn = document.getElementById('slide-right');

if (slideLeftBtn && slideRightBtn && slider) {
    slideLeftBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -400, behavior: 'smooth' });
    });
    
    slideRightBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 400, behavior: 'smooth' });
    });
}
// ==========================================
// --- Custom Canvas CAPTCHA & Form Logic ---
// ==========================================
const captchaCanvas = document.getElementById('captcha-canvas');
const ctx = captchaCanvas ? captchaCanvas.getContext('2d') : null;
let currentCaptchaText = '';

function generateCaptcha() {
    if (!ctx) return;
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    currentCaptchaText = '';
    
    for (let i = 0; i < 6; i++) {
        currentCaptchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Pastel interference lines
    const pastelColors = ['#FFCBE1', '#D6E5D0', '#FFE1AB', '#BCDBEC', '#DCCCEC', '#FFDAB4'];
    for (let i = 0; i < 7; i++) {
        ctx.strokeStyle = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
        ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
        ctx.stroke();
    }

    // Scrambled Text
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#1A202C';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < currentCaptchaText.length; i++) {
        ctx.save();
        const x = 20 + (i * 22);
        const y = captchaCanvas.height / 2;
        ctx.translate(x, y);
        const rotation = (Math.random() - 0.5) * 0.4; 
        ctx.rotate(rotation);
        ctx.fillText(currentCaptchaText[i], 0, 0);
        ctx.restore();
    }
}

if (captchaCanvas) generateCaptcha();

const refreshBtn = document.getElementById('refresh-captcha');
if (refreshBtn) refreshBtn.addEventListener('click', generateCaptcha);

// Form Validation, Toast Popups & Thank You Greeting
const form = document.getElementById('contact-form');
const captchaInput = document.getElementById('captcha-input');
const successPopup = document.getElementById('success-popup'); 
const errorPopup = document.getElementById('error-popup');
const thankYouMessage = document.getElementById('thank-you-message');

function showToast(popupElement) {
    popupElement.classList.add('show');
    setTimeout(() => {
        popupElement.classList.remove('show');
    }, 3500);
}

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents page reload
        
        const userCaptcha = captchaInput.value.trim();
        
        if (userCaptcha === currentCaptchaText) {
            // Success Logic
            showToast(successPopup);
            
            // Hide the form and show the Thank You message
            form.style.display = 'none';
            thankYouMessage.style.display = 'block';
            
            form.reset(); 
        } else {
            // Error Logic
            showToast(errorPopup);
            captchaInput.value = ''; 
            generateCaptcha(); 
        }
    });
}

// Function to reset the view if they want to send another message
window.resetFeedbackForm = function() {
    thankYouMessage.style.display = 'none';
    form.style.display = 'flex'; // Use flex because of .modern-form class
    generateCaptcha();
};

// ==========================================
// --- Multi-Directional Scroll Animations ---
// ==========================================

// 1. Group elements by the animation they should have
const animationGroups = [
    {
        // Headings slide in from the Left
        selectors: '.section-massive-title, .sub-heading',
        animationClass: 'anim-left'
    },
    {
        // Paragraphs and Forms slide up from the Bottom
        selectors: '.section-subtext, .about-text p, .modern-form .input-wrapper',
        animationClass: 'anim-up'
    },
    {
        // Certificates and Projects slide in from the Right
        selectors: '.cert-card, .work-card',
        animationClass: 'anim-right'
    },
   
];

// 2. Prepare the elements with their specific classes
animationGroups.forEach(group => {
    const elements = document.querySelectorAll(group.selectors);
    elements.forEach((el, index) => {
        el.classList.add('anim-element', group.animationClass);
        
        // Add a slight stagger delay if there are multiple elements together (like cards/paragraphs)
        if (index % 3 === 1) el.classList.add('delay-1');
        if (index % 3 === 2) el.classList.add('delay-2');
    });
});

// 3. Set up the Intersection Observer
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Trigger slightly before it hits the bottom
    threshold: 0.15 
});

// 4. Start observing all elements with the 'anim-element' class
document.querySelectorAll('.anim-element').forEach(el => {
    revealObserver.observe(el);
});