/*
================================================================
* Description:   Dynamic Data Loader from API
================================================================
*/

const API_BASE_URL = 'https://portfolio-backend-1044029024389.us-central1.run.app';

// Handle CV download - opens in new tab or downloads
function setupCVDownloadButtons() {
    const downloadButtons = document.querySelectorAll('#downloadButton');
    downloadButtons.forEach(button => {
        if (button && button.href) {
            // Add download attribute to force download
            button.setAttribute('download', '');
            // Add target="_blank" to open in new tab if download doesn't work
            button.setAttribute('target', '_blank');
            // Add click handler as backup
            button.addEventListener('click', function(e) {
                // If download attribute doesn't work (cross-origin), open in new tab
                if (!this.hasAttribute('download') || this.getAttribute('download') === '') {
                    // Browser will handle it - download if possible, otherwise open in new tab
                }
            });
        }
    });
}

// Fetch portfolio data from API
async function loadPortfolioData() {
    try {
        console.log('Loading portfolio data from:', `${API_BASE_URL}/api/profile`);
        const response = await fetch(`${API_BASE_URL}/api/profile`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Portfolio data loaded successfully:', data);
        populatePage(data);
        // Setup CV download buttons after page is populated
        setTimeout(() => setupCVDownloadButtons(), 100);
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        console.error('Make sure the Flask backend is running on http://127.0.0.1:800');
        // Show error message to user
        showErrorMessage('Unable to load data. Please ensure the backend server is running on port 800.');
    }
}

// Show error message to user
function showErrorMessage(message) {
    // Try to show error in About section if it's empty
    const aboutContent = document.querySelector('#about-content');
    if (aboutContent && aboutContent.innerHTML.trim() === '') {
        aboutContent.innerHTML = `
            <div class="alert alert-warning">
                <strong>Warning:</strong> ${message}
                <br><small>Start the Flask backend with: <code>cd backend && python app.py</code></small>
            </div>
        `;
    }
}

// Populate all sections with data
function populatePage(data) {
    if (!data) {
        console.error('No data provided to populatePage');
        return;
    }
    
    console.log('Populating page with data:', data);
    
    if (data.header && data.social_links) {
        populateHeader(data.header, data.social_links);
    }
    if (data.home) {
        populateHome(data.home);
    }
    if (data.about) {
        populateAbout(data.about);
    }
    if (data.services) {
        populateServices(data.services);
    }
    if (data.frameworks) {
        populateFrameworks(data.frameworks);
    }
    if (data.resume) {
        populateResume(data.resume);
    }
    if (data.testimonials) {
        populateTestimonials(data.testimonials);
    }
    if (data.contact) {
        populateContact(data.contact);
    }
    if (data.footer) {
        populateFooter(data.footer);
    }
}

// Header Section
function populateHeader(header, socialLinks) {
    // Profile image
    const profileImg = document.querySelector('header img[alt="profile"]');
    if (profileImg) {
        profileImg.src = header.profile_image;
        profileImg.title = header.title;
    }
    
    // Name
    const nameElement = document.querySelector('header h1');
    if (nameElement) {
        nameElement.textContent = header.name;
    }
    
    // Social links in header
    const socialIcons = document.querySelectorAll('header .social-icons li a');
    if (socialIcons.length > 0) {
        // Upwork
        if (socialIcons[0]) {
            socialIcons[0].href = socialLinks.upwork.url;
            socialIcons[0].setAttribute('data-bs-original-title', socialLinks.upwork.title);
            const upworkImg = socialIcons[0].querySelector('img');
            if (upworkImg) {
                upworkImg.src = socialLinks.upwork.icon;
            }
        }
        // Fiverr
        if (socialIcons[1]) {
            socialIcons[1].href = socialLinks.fiverr.url;
            socialIcons[1].setAttribute('data-bs-original-title', socialLinks.fiverr.title);
            const fiverrImg = socialIcons[1].querySelector('img');
            if (fiverrImg) {
                fiverrImg.src = socialLinks.fiverr.icon;
            }
        }
        // LinkedIn
        if (socialIcons[2]) {
            socialIcons[2].href = socialLinks.linkedin.url;
            socialIcons[2].setAttribute('data-bs-original-title', socialLinks.linkedin.title);
            const linkedinImg = socialIcons[2].querySelector('img');
            if (linkedinImg) {
                linkedinImg.src = socialLinks.linkedin.icon;
            }
        }
        // GitHub
        if (socialIcons[3]) {
            socialIcons[3].href = socialLinks.github.url;
            socialIcons[3].setAttribute('data-bs-original-title', socialLinks.github.title);
        }
    }
}

// Home/Intro Section
function populateHome(home) {
    // Welcome text
    const welcomeText = document.querySelector('#home .text-7');
    if (welcomeText) {
        welcomeText.textContent = home.welcome_text;
    }
    
    // Location
    const locationText = document.querySelector('#home .text-5.text-light');
    if (locationText) {
        locationText.textContent = home.location;
    }
    // Typed strings: left as static HTML; theme.js initializes Typed once (original behavior).
}

// About Section
function populateAbout(about) {
    if (!about) {
        console.error('About data is missing');
        return;
    }
    
    console.log('Populating about section with data:', about);
    
    // About content (title and description)
    const aboutContent = document.querySelector('#about-content');
    if (aboutContent) {
        if (about.title && about.description) {
            aboutContent.innerHTML = `
                <h2 class="text-7 fw-600 mb-3">${about.title}</h2>
                <p>${about.description}</p>
            `;
        } else {
            console.warn('About title or description missing');
        }
    } else {
        console.error('About content container not found');
    }

    // Personal info
    const personalInfo = document.querySelector('#about-personal-info');
    if (personalInfo) {
        if (about.personal_info) {
            personalInfo.innerHTML = `
                <div class="ps-lg-4">
                  <ul class="list-style-2">
                    <li class=""><span class="fw-600 me-2">Name:</span>${about.personal_info.name || 'N/A'}</li>
                    <li class=""><span class="fw-600 me-2">Email:</span><a href="mailto:${about.personal_info.email || ''}">${about.personal_info.email || 'N/A'}</a></li>
                    <li class="border-0"><span class="fw-600 me-2">From:</span>${about.personal_info.location || 'N/A'}</li>
                  </ul>
                  ${about.cv_file ? `<a href="${about.cv_file}" id="downloadButton" class="btn btn-primary rounded-pill" download target="_blank">Download CV</a>` : ''}
                </div>
            `;
        } else {
            console.warn('Personal info data missing');
        }
    } else {
        console.error('Personal info container not found');
    }

    // Stats
    const statsContainer = document.querySelector('#about-stats');
    if (statsContainer) {
        if (about.stats) {
            statsContainer.innerHTML = `
              <div class="row">
                <div class="col-6 col-md-3">
                  <div class="featured-box text-center">
                    <h4 class="text-12 text-muted mb-0"><span class="counter" data-from="0" data-to="${about.stats.years_experience || 0}">${about.stats.years_experience || 0}</span>+</h4>
                    <p class="mb-0">Years Experiance</p>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="featured-box text-center">
                    <h4 class="text-12 text-muted mb-0"><span class="counter" data-from="0" data-to="${about.stats.happy_clients || 0}">${about.stats.happy_clients || 0}</span>+</h4>
                    <p class="mb-0">Happy Clients</p>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="featured-box text-center">
                    <h4 class="text-12 text-muted mb-0"><span class="counter" data-from="0" data-to="${about.stats.projects_done || 0}">${about.stats.projects_done || 0}</span>+</h4>
                    <p class="mb-0">Projects Done</p>
                  </div>
                </div>
                <div class="col-6 col-md-3">
                  <div class="featured-box text-center">
                    <h4 class="text-12 text-muted mb-0"><span class="counter" data-from="0" data-to="${about.stats.awards || 0}">${about.stats.awards || 0}</span></h4>
                    <p class="mb-0">Get Awards</p>
                  </div>
                </div>
              </div>
            `;

            // Reinitialize counter animation after content is inserted
            if (typeof jQuery !== 'undefined' && jQuery().countTo) {
                setTimeout(() => {
                    jQuery('#about-stats .counter').countTo();
                }, 100);
            }
        } else {
            console.warn('Stats data missing');
        }
    } else {
        console.error('Stats container not found');
    }
}

// Services Section
function populateServices(services) {
    const servicesContainer = document.querySelector('#services .row .col-lg-11 .row');
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = services.map(service => `
        <div class="col-md-6">
            <div class="featured-box style-3 mb-5${service.id === services.length ? ' mb-md-0' : ''}">
                <div class="featured-box-icon text-primary bg-white shadow-sm rounded">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p class="mb-0">${service.description}</p>
            </div>
        </div>
    `).join('');
}

// Frameworks Section
function populateFrameworks(frameworks) {
    const frameworksContainer = document.querySelector('#skills .col-lg-11 .row');
    if (!frameworksContainer) return;
    
    // Split into two rows (4 items each)
    const firstRow = frameworks.slice(0, 4);
    const secondRow = frameworks.slice(4);
    
    frameworksContainer.innerHTML = `
        <div class="row">
            ${firstRow.map(fw => `
                <div class="col-md-3 col-sm-6 p-2">
                    <div class="featured-box style-3 mb-5" style="display:flex; align-items:center; gap:10px;">
                        <img src="${fw.icon}" alt="${fw.name}" style="width:25px; height:25px; object-fit:contain;">
                        <h3 style="margin:0; font-size:16px;">${fw.name}</h3>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="row">
            ${secondRow.map(fw => `
                <div class="col-md-3 col-sm-6 p-2">
                    <div class="featured-box style-3 mb-5" style="display:flex; align-items:center; gap:10px;">
                        <img src="${fw.icon}" alt="${fw.name}" style="width:25px; height:25px; object-fit:contain;">
                        <h3 style="margin:0; font-size:16px;">${fw.name}</h3>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Resume Section
function populateResume(resume) {
    if (!resume) {
        console.error('Resume data is missing');
        return;
    }
    
    console.log('Populating resume with data:', resume);
    
    // Education
    const educationContainer = document.querySelector('#education-container');
    if (educationContainer) {
        if (resume.education && resume.education.length > 0) {
            const educationHTML = resume.education.map(edu => `
                <div class="bg-white border rounded p-4 mb-4">
                    <p class="badge bg-primary text-2 fw-400">${edu.period}</p>
                    <h3 class="text-5">${edu.degree}</h3>
                    <p class="text-danger">${edu.institution}</p>
                    ${edu.description ? `<p class="mb-0">${edu.description}</p>` : ''}
                </div>
            `).join('');
            
            // Keep the "Education" heading and add certifications after
            const existingHeading = educationContainer.querySelector('h2');
            if (existingHeading) {
                // Remove existing education items but keep heading
                const existingItems = educationContainer.querySelectorAll('.bg-white.border.rounded');
                existingItems.forEach(item => item.remove());
                // Insert new education items after heading
                existingHeading.insertAdjacentHTML('afterend', educationHTML);
            } else {
                educationContainer.innerHTML = `
                    <h2 class="text-6 fw-600 mb-4">Education</h2>
                    ${educationHTML}
                `;
            }
        } else {
            console.warn('No education data found');
        }
    } else {
        console.error('Education container not found');
    }

    // Certifications
    const certificationsContainer = document.querySelector('#certifications-container');
    if (certificationsContainer) {
        if (resume.certifications && resume.certifications.length > 0) {
            // Check if there's a heading before certifications
            const parentContainer = certificationsContainer.parentElement;
            const certHeading = parentContainer.querySelector('h2:last-of-type');
            
            const certificationsHTML = resume.certifications.map(cert => `
                <div class="bg-white border rounded p-4 mb-4">
                    <p class="badge bg-primary text-2 fw-400">${cert.period || ''}</p>
                    <h3 class="text-5">${cert.title || ''}</h3>
                    <p class="text-danger">${cert.institution || ''}</p>
                    ${cert.description ? `<p class="mb-0">${cert.description}</p>` : ''}
                </div>
            `).join('');
            
            // Clear existing certifications and add new ones
            certificationsContainer.innerHTML = certificationsHTML;
            
            // Add heading if it doesn't exist
            if (!certHeading || !certHeading.textContent.includes('Certification')) {
                const heading = document.createElement('h2');
                heading.className = 'text-6 fw-600 mb-4';
                heading.textContent = 'Certification';
                certificationsContainer.insertAdjacentElement('beforebegin', heading);
            }
        } else {
            console.warn('No certifications data found');
        }
    } else {
        console.error('Certifications container not found');
    }

    // Experience
    const experienceContainer = document.querySelector('#experience-container');
    if (experienceContainer) {
        if (resume.experience && resume.experience.length > 0) {
            const experienceHTML = resume.experience.map(exp => `
                <div class="bg-white border rounded p-4 mb-4">
                    <p class="badge bg-primary text-2 fw-400">${exp.period}</p>
                    <h3 class="text-5">${exp.title}</h3>
                    <p class="text-danger">${exp.company}</p>
                    ${exp.description ? `<p class="mb-0">${exp.description}</p>` : ''}
                </div>
            `).join('');
            
            // Keep the "Experience" heading
            const existingHeading = experienceContainer.querySelector('h2');
            if (existingHeading) {
                // Remove existing experience items but keep heading
                const existingItems = experienceContainer.querySelectorAll('.bg-white.border.rounded');
                existingItems.forEach(item => item.remove());
                // Insert new experience items after heading
                existingHeading.insertAdjacentHTML('afterend', experienceHTML);
            } else {
                experienceContainer.innerHTML = `
                    <h2 class="text-6 fw-600 mb-4">Experience</h2>
                    ${experienceHTML}
                `;
            }
        } else {
            console.warn('No experience data found');
        }
    } else {
        console.error('Experience container not found');
    }

    // Skills
    const skillsContainer = document.querySelector('#skills-container');
    if (skillsContainer) {
        if (resume.skills && resume.skills.length > 0) {
            // Split skills into two columns
            const midPoint = Math.ceil(resume.skills.length / 2);
            const leftSkills = resume.skills.slice(0, midPoint);
            const rightSkills = resume.skills.slice(midPoint);
            
            const skillsHTML = `
                <h2 class="text-6 fw-600 mt-4 mb-4">My Skills</h2>
                <div class="row gx-5">
                    <div class="col-md-6">
                        ${leftSkills.map(skill => `
                            <p class="text-dark fw-500 text-start mb-2">${skill.name} <span class="float-end">${skill.percentage}%</span></p>
                            <div class="progress progress-sm mb-4">
                                <div class="progress-bar" role="progressbar" style="width: ${skill.percentage}%" aria-valuenow="${skill.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="col-md-6">
                        ${rightSkills.map(skill => `
                            <p class="text-dark fw-500 text-start mb-2">${skill.name} <span class="float-end">${skill.percentage}%</span></p>
                            <div class="progress progress-sm mb-4">
                                <div class="progress-bar" role="progressbar" style="width: ${skill.percentage}%" aria-valuenow="${skill.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="text-center mt-5">
                    <a href="${resume.cv_file || 'project_files/Muhammad_Abdullah_Resume.pdf'}" id="downloadButton" class="btn btn-outline-secondary rounded-pill shadow-none" download target="_blank">Download CV <span class="ms-1">
                    <i class="fas fa-download"></i></span></a></div>
            `;
            
            skillsContainer.innerHTML = skillsHTML;
        } else {
            console.warn('No skills data found');
        }
    } else {
        console.error('Skills container not found');
    }
}

// Testimonials Section
function populateTestimonials(testimonials) {
    if (!testimonials || testimonials.length === 0) {
        console.warn('No testimonials data provided, keeping existing testimonials');
        return;
    }
    
    const testimonialsContainer = document.querySelector('.testimonial-carousel');
    if (!testimonialsContainer) {
        console.error('Testimonials container not found');
        return;
    }
    
    console.log('Populating testimonials with', testimonials.length, 'items');
    
    // Wait for jQuery and Owl Carousel to be available
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.owlCarousel === 'undefined') {
        console.warn('jQuery or Owl Carousel not available, retrying in 500ms');
        setTimeout(() => populateTestimonials(testimonials), 500);
        return;
    }
    
    // Destroy existing carousel if it exists
    const existingCarousel = jQuery(testimonialsContainer);
    if (existingCarousel.data('owl.carousel')) {
        try {
            existingCarousel.trigger('destroy.owl.carousel');
            existingCarousel.removeClass('owl-carousel owl-loaded owl-drag owl-grab');
            // Clean up any owl-specific elements
            existingCarousel.find('.owl-stage-outer, .owl-stage, .owl-item').remove();
        } catch (e) {
            console.log('Error destroying carousel:', e);
        }
    }
    
    // Generate testimonials HTML
    const testimonialsHTML = testimonials.map(testimonial => {
        const fontSizeStyle = 'style="font-size:smaller"';
        
        // Fix image path if it doesn't start with images/
        let imagePath = testimonial.image;
        if (imagePath && !imagePath.startsWith('images/') && !imagePath.startsWith('http')) {
            imagePath = 'images/' + imagePath;
        }
        
        // Fix flag path if needed
        let flagPath = testimonial.flag;
        if (flagPath && !flagPath.startsWith('images/') && !flagPath.startsWith('http')) {
            flagPath = 'images/' + flagPath;
        }
        
        return `
        <div class="item">
            <div class="bg-light rounded p-5 h-100 d-flex flex-column">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="d-flex align-items-center">
                        <img class="img-fluid rounded-circle border d-inline-block w-auto" src="${imagePath}" alt="${testimonial.name}" onerror="this.src='images/icons8-user-50.png';">
                        <p class="ms-3 mb-0">
                            <strong class="d-block text-dark fw-600">${testimonial.name}</strong>
                            <span class="text-muted fw-500">
                                <img src="${flagPath}" alt="" style="width:40% !important">
                            </span>
                        </p>
                    </div>
                    <span class="text-2">
                        ${Array(testimonial.rating || 5).fill(0).map(() => '<i class="fas fa-star text-warning"></i>').join('')}
                    </span>
                </div>
                <p class="text-dark fw-500 mb-0 fst-italic flex-grow-1" ${fontSizeStyle}>${testimonial.review}</p>
            </div>
        </div>
        `;
    }).join('');
    
    // Update innerHTML
    testimonialsContainer.innerHTML = testimonialsHTML;
    
    // Verify content was added
    if (testimonialsContainer.children.length === 0) {
        console.error('Failed to add testimonials content');
        return;
    }
    
    console.log('Testimonials HTML added, reinitializing carousel...');
    
    // Reinitialize Owl Carousel using the same method as theme.js (reading from data attributes)
    setTimeout(() => {
        try {
            const a = jQuery(testimonialsContainer);
            const rtlVal = jQuery("html").attr("dir") == 'rtl';
            
            // Ensure the container has owl-carousel class and data attributes
            if (!a.hasClass('owl-carousel')) {
                a.addClass('owl-carousel owl-theme');
            }
            
            // Make sure container is visible
            a.css('display', '');
            
            // Read settings from data attributes (matching theme.js approach)
            const carouselOptions = {
                rtl: rtlVal,
                autoplay: a.data('autoplay') !== undefined ? a.data('autoplay') : false,
                loop: a.data('loop') !== undefined ? a.data('loop') : true,
                nav: a.data('nav') !== undefined ? a.data('nav') : false,
                margin: a.data('margin') !== undefined ? a.data('margin') : 25,
                stagePadding: a.data('stagepadding') !== undefined ? a.data('stagepadding') : 0,
                slideBy: a.data('slideby') !== undefined ? a.data('slideby') : 1,
                items: a.data('items-lg') !== undefined ? a.data('items-lg') : 2,
                responsive: {
                    0: { items: a.data('items-xs') !== undefined ? a.data('items-xs') : 1 },
                    576: { items: a.data('items-sm') !== undefined ? a.data('items-sm') : 1 },
                    768: { items: a.data('items-md') !== undefined ? a.data('items-md') : 1 },
                    992: { items: a.data('items-lg') !== undefined ? a.data('items-lg') : 2 }
                }
            };
            
            console.log('Initializing carousel with options:', carouselOptions);
            a.owlCarousel(carouselOptions);
            
            // Verify carousel initialized
            if (a.data('owl.carousel')) {
                console.log('Testimonials carousel reinitialized successfully');
            } else {
                console.warn('Carousel may not have initialized properly, but content should still be visible');
            }
        } catch (e) {
            console.error('Error reinitializing testimonials carousel:', e);
            console.log('Testimonials content should still be visible even without carousel');
        }
    }, 400);
}

// Contact Section
function populateContact(contact) {
    // Address
    const addressContainer = document.querySelector('#contact .col-md-4.col-xl-3');
    if (addressContainer) {
        const paragraphs = addressContainer.querySelectorAll('p.text-3');
        if (paragraphs.length >= 3) {
            // Address
            paragraphs[0].textContent = contact.address;
            // Phone
            paragraphs[1].innerHTML = `<span class="text-primary text-4 me-2"><i class="fas fa-phone"></i></span>${contact.phone}`;
            // Email
            paragraphs[2].innerHTML = `<span class="text-primary text-4 me-2"><i class="fas fa-envelope"></i></span>${contact.email}`;
        }
    }
    
    // Social links
    const contactSocialIcons = document.querySelectorAll('#contact .social-icons li a');
    if (contactSocialIcons.length >= 3) {
        // WhatsApp
        contactSocialIcons[0].href = contact.social_links.whatsapp.url;
        contactSocialIcons[0].setAttribute('data-bs-original-title', contact.social_links.whatsapp.title);
        contactSocialIcons[0].setAttribute('title', contact.social_links.whatsapp.title);
        contactSocialIcons[0].innerHTML = `<i class="${contact.social_links.whatsapp.icon}"></i>`;
        // Telegram
        contactSocialIcons[1].href = contact.social_links.telegram.url;
        contactSocialIcons[1].setAttribute('data-bs-original-title', contact.social_links.telegram.title);
        contactSocialIcons[1].setAttribute('title', contact.social_links.telegram.title);
        contactSocialIcons[1].innerHTML = `<i class="${contact.social_links.telegram.icon}"></i>`;
        // LinkedIn
        contactSocialIcons[2].href = contact.social_links.linkedin.url;
        contactSocialIcons[2].setAttribute('data-bs-original-title', contact.social_links.linkedin.title);
        contactSocialIcons[2].setAttribute('title', contact.social_links.linkedin.title);
        contactSocialIcons[2].innerHTML = `<i class="${contact.social_links.linkedin.icon}"></i>`;
    }
}

// Footer Section
function populateFooter(footer) {
    const copyrightElement = document.querySelector('footer p');
    if (copyrightElement) {
        copyrightElement.innerHTML = `Copyright © ${footer.copyright_year} <a href="#" class="fw-500">${footer.name}</a>. All Rights Reserved.`;
    }
}

// Portfolio Projects Section
async function loadPortfolioProjects() {
    try {
        console.log('Loading portfolio projects from:', `${API_BASE_URL}/api/portfolios`);
        const response = await fetch(`${API_BASE_URL}/api/portfolios`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const portfolios = await response.json();
        console.log('Portfolio projects loaded successfully:', portfolios);
        populatePortfolioProjects(portfolios);
    } catch (error) {
        console.error('Error loading portfolio projects:', error);
        console.error('Make sure the Flask backend is running on http://127.0.0.1:800');
        // Show error in portfolio container
        const portfolioContainer = document.querySelector('#portfolio-container');
        if (portfolioContainer && portfolioContainer.innerHTML.trim() === '') {
            portfolioContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center">
                        <strong>No projects loaded.</strong><br>
                        <small>Please ensure the Flask backend is running on port 800.</small>
                    </div>
                </div>
            `;
        }
    }
}

function populatePortfolioProjects(portfolios) {
    const portfolioContainer = document.querySelector('#portfolio-container');
    if (!portfolioContainer) {
        console.error('Portfolio container not found');
        return;
    }
    
    if (!portfolios || portfolios.length === 0) {
        console.warn('No portfolio projects found');
        return;
    }
    
    console.log('Populating portfolio with', portfolios.length, 'projects');
    
    // Category mapping: ai = Artificial Intelligence, ml = Machine Learning, sd = Software Development
    const categoryMap = {
        'ai': 'Artificial Intelligence',
        'ml': 'Machine Learning',
        'sd': 'Software Development'
    };
    
    // Clear existing content
    portfolioContainer.innerHTML = '';
    
    // Generate HTML for each portfolio item
    portfolios.forEach(portfolio => {
        const category = portfolio.CATEGORY || 'sd';
        const categoryLabel = categoryMap[category] || 'Software Development';
        
        // Construct image URL - if it's a relative path, point to backend static folder
        let imageSrc = portfolio.IMAGE;
        if (!imageSrc.startsWith('http')) {
            // Ensure path starts with 'images/' if it doesn't already
            if (!imageSrc.startsWith('images/')) {
                imageSrc = 'images/' + imageSrc;
            }
            // Construct backend URL for static files
            imageSrc = `${API_BASE_URL}/static/${imageSrc}`;
        }
        
        const projectUrl = `${API_BASE_URL}/project/${portfolio.id}`;
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = `col-sm-6 col-lg-4 ${category}`;
        portfolioItem.innerHTML = `
          <div class="portfolio-box rounded">
            <div class="portfolio-img rounded">
              <img class="img-fluid d-block" src="${imageSrc}" alt="${portfolio.PROJECT_TITLE}" onerror="this.src='${API_BASE_URL}/static/images/9513654.jpg';">
              <div class="portfolio-overlay">
                <a class="popup-ajax stretched-link" href="${projectUrl}"></a>
                <div class="portfolio-overlay-details">
                  <h5 class="text-white fw-400">${portfolio.PROJECT_TITLE}</h5>
                  <span class="text-light">${categoryLabel}</span>
                </div>
              </div>
            </div>
          </div>
        `;
        
        portfolioContainer.appendChild(portfolioItem);
    });
    
    // Reinitialize isotope filter if it exists
    if (typeof jQuery !== 'undefined' && jQuery.fn.isotope) {
        setTimeout(() => {
            jQuery('.portfolio-filter').isotope('reloadItems');
            jQuery('.portfolio-filter').isotope('layout');
        }, 100);
    }
}

// Initialize when DOM is ready and jQuery is available
function initializeDataLoader() {
    console.log('Initializing data loader...');
    // Wait for jQuery to be available
    if (typeof jQuery === 'undefined') {
        console.log('Waiting for jQuery...');
        setTimeout(initializeDataLoader, 100);
        return;
    }
    
    // Wait a bit for theme.js to initialize carousels first
    console.log('jQuery loaded, waiting for theme.js to initialize...');
    setTimeout(() => {
        console.log('Fetching data from backend...');
        loadPortfolioData();
        loadPortfolioProjects();
    }, 500);
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDataLoader);
} else {
    // DOM is already ready
    initializeDataLoader();
}
