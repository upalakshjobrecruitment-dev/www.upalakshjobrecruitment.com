// Upalaksh Job Recruitment App JavaScript

// Global variables
let currentStep = 0;
let resumeData = {
    personal: {},
    summary: '',
    experience: [],
    education: [],
    skills: []
};
let uploadedFiles = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupEventListeners();
    setupNavigation();
    setupFormValidation();
    updateProgress();
    initMap();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // File upload setup
    setupFileUpload();

    // Modal close events
    setupModalEvents();
}

// Setup modal events
function setupModalEvents() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'resumeBuilderModal') {
                closeResumeBuilder();
            }
            if (e.target.id === 'resumeUploaderModal') {
                closeResumeUploader();
            }
        }
    });

    // Close button events
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 80; // Fixed header height
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Resume Builder Functions
function openResumeBuilder() {
    const modal = document.getElementById('resumeBuilderModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        currentStep = 0;
        updateProgress();
        showStep(currentStep);
        
        // Add initial experience and education entries
        setTimeout(() => {
            if (document.getElementById('experienceEntries').children.length === 0) {
                addExperience();
            }
            if (document.getElementById('educationEntries').children.length === 0) {
                addEducation();
            }
        }, 100);
    }
}

function closeResumeBuilder() {
    const modal = document.getElementById('resumeBuilderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showStep(step) {
    // Hide all form sections
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(s => s.classList.remove('active'));
    
    // Show current step
    const stepNames = ['personal', 'summary', 'experience', 'education', 'skills'];
    const currentForm = document.getElementById(stepNames[step] + 'Form');
    const currentStepEl = document.querySelector(`.step[data-step="${stepNames[step]}"]`);
    
    if (currentForm) currentForm.classList.add('active');
    if (currentStepEl) currentStepEl.classList.add('active');
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const generateBtn = document.getElementById('generateBtn');
    
    if (prevBtn) prevBtn.disabled = step === 0;
    
    if (step === stepNames.length - 1) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (generateBtn) generateBtn.style.display = 'inline-flex';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (generateBtn) generateBtn.style.display = 'none';
    }
    
    updateProgress();
    updatePreview();
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateCurrentStep() {
    const stepNames = ['personal', 'summary', 'experience', 'education', 'skills'];
    const currentStepName = stepNames[currentStep];
    
    if (currentStepName === 'personal') {
        const fullName = document.getElementById('fullName')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        
        if (!fullName || !email || !phone) {
            showError('Please fill in all required fields');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return false;
        }
        
        // Save personal data
        resumeData.personal = {
            fullName,
            email,
            phone,
            address: document.getElementById('address')?.value?.trim() || ''
        };
    }
    
    return true;
}

function updateProgress() {
    const progress = ((currentStep + 1) / 5) * 100;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = Math.round(progress) + '% Complete';
}

function addExperience() {
    const container = document.getElementById('experienceEntries');
    if (!container) return;
    
    const index = container.children.length;
    
    const entryDiv = document.createElement('div');
    entryDiv.className = 'experience-entry';
    entryDiv.setAttribute('data-index', index);
    entryDiv.innerHTML = `
        <div class="entry-header">
            <h5>Experience ${index + 1}</h5>
            <button type="button" class="remove-entry" onclick="removeExperience(${index})">Remove</button>
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Job Title" id="exp-title-${index}">
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Company Name" id="exp-company-${index}">
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Duration (e.g., Jan 2020 - Present)" id="exp-duration-${index}">
        </div>
        <div class="form-group">
            <textarea class="form-control" rows="3" placeholder="Job Description" id="exp-description-${index}"></textarea>
        </div>
    `;
    
    container.appendChild(entryDiv);
    
    // Add event listeners to new inputs
    const inputs = entryDiv.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

function removeExperience(index) {
    const entry = document.querySelector(`.experience-entry[data-index="${index}"]`);
    if (entry) {
        entry.remove();
        updatePreview();
    }
}

function addEducation() {
    const container = document.getElementById('educationEntries');
    if (!container) return;
    
    const index = container.children.length;
    
    const entryDiv = document.createElement('div');
    entryDiv.className = 'education-entry';
    entryDiv.setAttribute('data-index', index);
    entryDiv.innerHTML = `
        <div class="entry-header">
            <h5>Education ${index + 1}</h5>
            <button type="button" class="remove-entry" onclick="removeEducation(${index})">Remove</button>
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Degree/Qualification" id="edu-degree-${index}">
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Institution Name" id="edu-institution-${index}">
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Year/Duration" id="edu-duration-${index}">
        </div>
    `;
    
    container.appendChild(entryDiv);
    
    // Add event listeners to new inputs
    const inputs = entryDiv.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

function removeEducation(index) {
    const entry = document.querySelector(`.education-entry[data-index="${index}"]`);
    if (entry) {
        entry.remove();
        updatePreview();
    }
}

function updatePreview() {
    const previewContent = document.getElementById('resumePreview');
    if (!previewContent) return;
    
    // Collect current form data
    const personal = {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || ''
    };
    
    const summary = document.getElementById('summary')?.value || '';
    const skills = document.getElementById('skills')?.value || '';
    
    // Collect experience data
    const experience = [];
    const expEntries = document.querySelectorAll('.experience-entry');
    expEntries.forEach((entry, index) => {
        const title = document.getElementById(`exp-title-${index}`)?.value || '';
        const company = document.getElementById(`exp-company-${index}`)?.value || '';
        const duration = document.getElementById(`exp-duration-${index}`)?.value || '';
        const description = document.getElementById(`exp-description-${index}`)?.value || '';
        
        if (title || company) {
            experience.push({ title, company, duration, description });
        }
    });
    
    // Collect education data
    const education = [];
    const eduEntries = document.querySelectorAll('.education-entry');
    eduEntries.forEach((entry, index) => {
        const degree = document.getElementById(`edu-degree-${index}`)?.value || '';
        const institution = document.getElementById(`edu-institution-${index}`)?.value || '';
        const duration = document.getElementById(`edu-duration-${index}`)?.value || '';
        
        if (degree || institution) {
            education.push({ degree, institution, duration });
        }
    });
    
    // Generate preview HTML
    let previewHtml = '';
    
    if (personal.fullName || personal.email || personal.phone) {
        previewHtml += `
            <div class="resume-header">
                <div class="resume-name">${personal.fullName}</div>
                <div class="resume-contact">
                    ${personal.email ? `<span>${personal.email}</span>` : ''}
                    ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                    ${personal.address ? `<span>${personal.address}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    if (summary) {
        previewHtml += `
            <div class="resume-section">
                <h5>Professional Summary</h5>
                <p>${summary}</p>
            </div>
        `;
    }
    
    if (experience.length > 0) {
        previewHtml += `
            <div class="resume-section">
                <h5>Work Experience</h5>
                ${experience.map(exp => `
                    <div class="experience-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${exp.title}</div>
                                <div class="item-company">${exp.company}</div>
                            </div>
                            <div class="item-date">${exp.duration}</div>
                        </div>
                        ${exp.description ? `<p>${exp.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (education.length > 0) {
        previewHtml += `
            <div class="resume-section">
                <h5>Education</h5>
                ${education.map(edu => `
                    <div class="education-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${edu.degree}</div>
                                <div class="item-company">${edu.institution}</div>
                            </div>
                            <div class="item-date">${edu.duration}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
        if (skillsArray.length > 0) {
            previewHtml += `
                <div class="resume-section">
                    <h5>Skills</h5>
                    <div class="skills-list">
                        ${skillsArray.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    if (!previewHtml) {
        previewHtml = `
            <div class="preview-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Fill out the form to see your resume preview</p>
            </div>
        `;
    }
    
    previewContent.innerHTML = previewHtml;
}

function generateResume() {
    // Collect all form data
    updateResumeData();
    
    if (!resumeData.personal.fullName) {
        showError('Please fill in your name to generate the resume');
        return;
    }
    
    try {
        // Check if jsPDF is available
        if (typeof window.jspdf === 'undefined') {
            showError('PDF generator is loading. Please try again in a moment.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set up PDF styling
        doc.setFont('helvetica');
        
        let yPos = 30;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        
        // Header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(resumeData.personal.fullName, margin, yPos);
        yPos += 10;
        
        // Contact info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const contactInfo = [
            resumeData.personal.email,
            resumeData.personal.phone,
            resumeData.personal.address
        ].filter(item => item).join(' | ');
        
        if (contactInfo) {
            doc.text(contactInfo, margin, yPos);
            yPos += 15;
        }
        
        // Draw line under header
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;
        
        // Summary
        if (resumeData.summary) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('PROFESSIONAL SUMMARY', margin, yPos);
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const summaryLines = doc.splitTextToSize(resumeData.summary, pageWidth - 2 * margin);
            doc.text(summaryLines, margin, yPos);
            yPos += summaryLines.length * 5 + 10;
        }
        
        // Experience
        if (resumeData.experience.length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('WORK EXPERIENCE', margin, yPos);
            yPos += 8;
            
            resumeData.experience.forEach(exp => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 30;
                }
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(exp.title, margin, yPos);
                
                if (exp.duration) {
                    doc.text(exp.duration, pageWidth - margin - 50, yPos);
                }
                yPos += 6;
                
                doc.setFont('helvetica', 'italic');
                doc.text(exp.company, margin, yPos);
                yPos += 6;
                
                if (exp.description) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    const descLines = doc.splitTextToSize(exp.description, pageWidth - 2 * margin);
                    doc.text(descLines, margin, yPos);
                    yPos += descLines.length * 4 + 8;
                }
                yPos += 3;
            });
            yPos += 5;
        }
        
        // Education
        if (resumeData.education.length > 0) {
            if (yPos > 220) {
                doc.addPage();
                yPos = 30;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('EDUCATION', margin, yPos);
            yPos += 8;
            
            resumeData.education.forEach(edu => {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(edu.degree, margin, yPos);
                
                if (edu.duration) {
                    doc.text(edu.duration, pageWidth - margin - 30, yPos);
                }
                yPos += 6;
                
                doc.setFont('helvetica', 'italic');
                doc.text(edu.institution, margin, yPos);
                yPos += 10;
            });
        }
        
        // Skills
        if (resumeData.skills.length > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 30;
            }
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('SKILLS', margin, yPos);
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const skillsText = resumeData.skills.join(', ');
            const skillsLines = doc.splitTextToSize(skillsText, pageWidth - 2 * margin);
            doc.text(skillsLines, margin, yPos);
        }
        
        // Save PDF
        const filename = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        doc.save(filename);
        
        showSuccess('Resume generated successfully!');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showError('Error generating PDF. Please try again.');
    }
}

function updateResumeData() {
    // Personal info
    resumeData.personal = {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || ''
    };
    
    // Summary
    resumeData.summary = document.getElementById('summary')?.value || '';
    
    // Experience
    resumeData.experience = [];
    const expEntries = document.querySelectorAll('.experience-entry');
    expEntries.forEach((entry, index) => {
        const title = document.getElementById(`exp-title-${index}`)?.value || '';
        const company = document.getElementById(`exp-company-${index}`)?.value || '';
        const duration = document.getElementById(`exp-duration-${index}`)?.value || '';
        const description = document.getElementById(`exp-description-${index}`)?.value || '';
        
        if (title || company) {
            resumeData.experience.push({ title, company, duration, description });
        }
    });
    
    // Education
    resumeData.education = [];
    const eduEntries = document.querySelectorAll('.education-entry');
    eduEntries.forEach((entry, index) => {
        const degree = document.getElementById(`edu-degree-${index}`)?.value || '';
        const institution = document.getElementById(`edu-institution-${index}`)?.value || '';
        const duration = document.getElementById(`edu-duration-${index}`)?.value || '';
        
        if (degree || institution) {
            resumeData.education.push({ degree, institution, duration });
        }
    });
    
    // Skills
    const skillsInput = document.getElementById('skills')?.value || '';
    resumeData.skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
}

// Resume Uploader Functions
function openResumeUploader() {
    const modal = document.getElementById('resumeUploaderModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        resetUploader();
    }
}

function closeResumeUploader() {
    const modal = document.getElementById('resumeUploaderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processUploadedFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processUploadedFiles(files);
}

function processUploadedFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file
    if (!validateFile(file)) return;
    
    // Show progress
    showUploadProgress();
    
    // Simulate upload process
    setTimeout(() => {
        uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            file: file
        });
        
        showUploadSuccess(file);
    }, 1500);
}

function validateFile(file) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showError('Please upload a PDF, DOC, or DOCX file');
        return false;
    }
    
    if (file.size > maxSize) {
        showError('File size must be less than 5MB');
        return false;
    }
    
    return true;
}

function showUploadProgress() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadProgress = document.getElementById('uploadProgress');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadSuccess) uploadSuccess.style.display = 'none';
    if (uploadProgress) uploadProgress.style.display = 'block';
    
    // Simulate progress
    const progressFill = document.querySelector('#uploadProgress .progress-fill');
    const progressText = document.querySelector('#uploadProgress .progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = progress < 100 ? 'Uploading...' : 'Processing...';
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
}

function showUploadSuccess(file) {
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccess = document.getElementById('uploadSuccess');
    
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (uploadSuccess) uploadSuccess.style.display = 'block';
    
    // Update file details
    const fileDetails = document.getElementById('fileDetails');
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    if (fileDetails) {
        fileDetails.innerHTML = `
            <div><strong>File Name:</strong> ${file.name}</div>
            <div><strong>File Size:</strong> ${fileSize} MB</div>
            <div><strong>File Type:</strong> ${file.type.split('/')[1].toUpperCase()}</div>
            <div><strong>Upload Date:</strong> ${new Date().toLocaleDateString()}</div>
        `;
    }
}

function viewUploadedResume() {
    if (uploadedFiles.length > 0) {
        const file = uploadedFiles[uploadedFiles.length - 1].file;
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
    }
}

function resetUploader() {
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadSuccess) uploadSuccess.style.display = 'none';
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (uploadArea) uploadArea.style.display = 'block';
    
    // Reset file input
    if (fileInput) fileInput.value = '';
}

// Google Maps - Simplified version without API key
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Create a simple static map fallback
    mapContainer.innerHTML = `
        <div style="width: 100%; height: 400px; background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%); display: flex; align-items: center; justify-content: center; color: white; text-align: center; padding: 20px; border-radius: 8px;">
            <div>
                <div style="font-size: 48px; margin-bottom: 16px;">📍</div>
                <h4 style="margin: 0 0 8px 0;">Upalaksh Job Recruitment</h4>
                <p style="margin: 0; line-height: 1.4;">
                    Office No. 42, 3rd Floor<br>
                    RIO Complex, Dhamtari Road<br>
                    Lalpur, Tikrapara<br>
                    Raipur – 492001
                </p>
                <div style="margin-top: 16px;">
                    <a href="https://maps.google.com/?q=21.2333,81.6333" target="_blank" style="color: #4299e1; text-decoration: none;">View on Google Maps</a>
                </div>
            </div>
        </div>
    `;
}

// Contact Form
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName')?.value?.trim() || '',
        email: document.getElementById('contactEmail')?.value?.trim() || '',
        phone: document.getElementById('contactPhone')?.value?.trim() || '',
        message: document.getElementById('contactMessage')?.value?.trim() || ''
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccess('Thank you for your message! We will get back to you soon.');
    }, 2000);
}

// Form Validation
function setupFormValidation() {
    // Real-time validation for resume builder
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-control')) {
            updatePreview();
        }
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'error' ? 'background: #e53e3e;' : 'background: #38a169;'}
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Expose functions to global scope for onclick handlers
window.openResumeBuilder = openResumeBuilder;
window.closeResumeBuilder = closeResumeBuilder;
window.openResumeUploader = openResumeUploader;
window.closeResumeUploader = closeResumeUploader;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.generateResume = generateResume;
window.addExperience = addExperience;
window.removeExperience = removeExperience;
window.addEducation = addEducation;
window.removeEducation = removeEducation;
window.viewUploadedResume = viewUploadedResume;
window.resetUploader = resetUploader;
window.scrollToSection = scrollToSection;