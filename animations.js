window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(function(element) {
        const position = element.getBoundingClientRect().top;
        const tailleEcran = window.innerHeight;

        if (position < tailleEcran) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
});

const buttons = document.querySelectorAll('.btn-reservation');
buttons.forEach(function(button) {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

const images = document.querySelectorAll('.zoom-img');
images.forEach(function(image) {
    image.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.4s ease';
    });
    image.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});


