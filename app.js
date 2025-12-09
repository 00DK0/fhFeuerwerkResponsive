
const navToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-list a');

        navToggle.addEventListener('click', () => {
            const visibility = navList.getAttribute('data-visible');
            if (visibility === "false") {
                navList.setAttribute('data-visible', "true");
                navToggle.setAttribute('aria-expanded', "true");
            } else {
                navList.setAttribute('data-visible', "false");
                navToggle.setAttribute('aria-expanded', "false");
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.setAttribute('data-visible', "false");
                navToggle.setAttribute('aria-expanded', "false");
            });
        });