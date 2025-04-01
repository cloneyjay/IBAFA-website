/**
 * Card Slider Implementation
 * This script handles the slider functionality for team, projects, and services sections
 */

class CardSlider {
    constructor(sliderContainer, options = {}) {
        this.container = sliderContainer;
        this.sliderTrack = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.sliderTrack.children);
        this.nextButton = this.container.querySelector('.slider-next');
        this.prevButton = this.container.querySelector('.slider-prev');
        this.indicators = this.container.querySelector('.slider-indicators');
        
        // Default options
        this.options = {
            // Number of slides visible at once
            slidesToShow: options.slidesToShow || 3,
            // Number of slides to move when navigating
            slidesToScroll: options.slidesToScroll || 1,
            autoplay: options.autoplay || false,
            autoplaySpeed: options.autoplaySpeed || 10000,
            responsive: options.responsive || [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };
        
        this.currentSlide = 0;
        this.slideWidth = 100 / this.options.slidesToShow;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        // Set up the slider
        this.setupSlider();
        
        // Create indicators
        this.createIndicators();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set up responsive behavior
        this.setupResponsive();
        
        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    setupSlider() {
        // Set slider track width
        this.sliderTrack.style.width = `${this.totalSlides * this.slideWidth}%`;
        
        // Set individual slide widths
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}%`;
        });
        
        // Initial position
        this.goToSlide(0);
        
        // Show the slider after setup
        this.container.classList.add('slider-initialized');
    }
    
    createIndicators() {
        if (!this.indicators) return;
        
        // Calculate number of indicators needed
        const indicatorCount = Math.ceil(this.totalSlides - (this.options.slidesToShow - 1));
        
        // Create indicator dots
        for (let i = 0; i < indicatorCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.indicators.appendChild(dot);
        }
    }
    
    addEventListeners() {
        // Next button click
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Previous button click
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        // Touch events for mobile swipe
        let startX, moveX, initialPosition;
        const threshold = 100; // Minimum distance to register as swipe
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            initialPosition = this.currentSlide * -this.slideWidth;
            
            if (this.options.autoplay) {
                this.stopAutoplay();
            }
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            const newPosition = initialPosition + (diff / this.container.offsetWidth * 100);
            
            // Apply the transform with limits
            const maxPosition = 0;
            const minPosition = -((this.totalSlides - this.options.slidesToShow) * this.slideWidth);
            
            if (newPosition <= maxPosition && newPosition >= minPosition) {
                this.sliderTrack.style.transform = `translateX(${newPosition}%)`;
            }
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            if (!startX || !moveX) {
                startX = null;
                moveX = null;
                return;
            }
            
            const diff = moveX - startX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            } else {
                // If the swipe wasn't strong enough, go back to current slide
                this.goToSlide(this.currentSlide);
            }
            
            startX = null;
            moveX = null;
            
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }, { passive: true });
    }
    
    setupResponsive() {
        const updateSliderSettings = () => {
            for (const item of this.options.responsive) {
                if (window.innerWidth <= item.breakpoint) {
                    this.updateSlidesToShow(item.settings.slidesToShow);
                    return;
                }
            }
            
            // Default to original settings if no breakpoint matches
            this.updateSlidesToShow(this.options.slidesToShow);
        };
        
        // Initial setup
        updateSliderSettings();
        
        // Update on window resize
        window.addEventListener('resize', updateSliderSettings);
    }
    
    updateSlidesToShow(count) {
        this.options.slidesToShow = count;
        this.slideWidth = 100 / count;
        
        // Update slider track width
        this.sliderTrack.style.width = `${this.totalSlides * this.slideWidth}%`;
        
        // Update individual slide widths
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}%`;
        });
        
        // Make sure current slide is valid
        const maxSlideIndex = this.totalSlides - this.options.slidesToShow;
        if (this.currentSlide > maxSlideIndex) {
            this.currentSlide = maxSlideIndex;
        }
        
        // Update position
        this.goToSlide(this.currentSlide);
        
        // Update indicators if needed
        if (this.indicators) {
            this.indicators.innerHTML = '';
            this.createIndicators();
        }
    }
    
    goToSlide(index) {
        // Ensure index is within bounds
        const maxSlideIndex = this.totalSlides - this.options.slidesToShow;
        if (index < 0) index = 0;
        if (index > maxSlideIndex) index = maxSlideIndex;
        
        this.currentSlide = index;
        const translateValue = -index * this.slideWidth;
        this.sliderTrack.style.transform = `translateX(${translateValue}%)`;
        
        // Update indicators
        if (this.indicators) {
            const dots = this.indicators.querySelectorAll('.slider-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
    
    nextSlide() {
        const maxSlideIndex = this.totalSlides - this.options.slidesToShow;
        if (this.currentSlide >= maxSlideIndex) {
            // Loop back to first slide
            this.goToSlide(0);
        } else {
            this.goToSlide(this.currentSlide + this.options.slidesToScroll);
        }
    }
    
    prevSlide() {
        if (this.currentSlide <= 0) {
            // Loop to last slide
            const maxSlideIndex = this.totalSlides - this.options.slidesToShow;
            this.goToSlide(maxSlideIndex);
        } else {
            this.goToSlide(this.currentSlide - this.options.slidesToScroll);
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplaySpeed);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Services Slider
    const servicesSlider = document.querySelector('.services-slider');
    if (servicesSlider) {
        new CardSlider(servicesSlider, {
            slidesToShow: 4,
            autoplay: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    // Projects Slider
    const projectsSlider = document.querySelector('.projects-slider');
    if (projectsSlider) {
        new CardSlider(projectsSlider, {
            slidesToShow: 3,
            autoplay: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    
    // Team Slider
    const teamSlider = document.querySelector('.team-slider');
    if (teamSlider) {
        new CardSlider(teamSlider, {
            slidesToShow: 4,
            autoplay: true,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
});