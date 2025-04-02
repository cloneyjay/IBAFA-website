document.addEventListener('DOMContentLoaded', function() {
    const commonOptions = {
        loop: true,
        spaceBetween: 20,
        centeredSlides: true,
        grabCursor: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 10
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    };

    // Services Slider
    const servicesSlider = new Swiper('.services-slider', {
        ...commonOptions,
        effect: 'cards',
        on: {
            init: function () {
                this.el.classList.add('slider-initialized');
            }
        }
    });

    // Projects Slider
    const projectsSlider = new Swiper('.projects-slider', {
        ...commonOptions,
        effect: 'slide',
        on: {
            init: function () {
                this.el.classList.add('slider-initialized');
            }
        }
    });

    // Team Slider
    const teamSlider = new Swiper('.team-slider', {
        ...commonOptions,
        effect: 'slide',
        on: {
            init: function () {
                this.el.classList.add('slider-initialized');
            }
        }
    });
});