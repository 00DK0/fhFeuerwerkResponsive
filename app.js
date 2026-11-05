/* FH-Pyrotechnik – gemeinsames Script für alle Seiten
   1. Mobiles Menü
   2. Bildansicht (Lightbox) für Galerie- und Beispielbilder */
(function () {
    'use strict';

    /* ---------- 1. Mobiles Menü ---------- */
    var navToggle = document.querySelector('.mobile-menu-toggle');
    var navList = document.querySelector('.nav-list');

    function isMenuOpen() {
        return navList && navList.getAttribute('data-visible') === 'true';
    }

    function setMenu(open) {
        if (!navToggle || !navList) return;
        navList.setAttribute('data-visible', open ? 'true' : 'false');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
        document.body.classList.toggle('nav-open', open);
    }

    if (navToggle && navList) {
        navToggle.addEventListener('click', function () {
            setMenu(!isMenuOpen());
        });

        // Klick auf einen Menüpunkt schließt das Menü
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });

        // Klick neben das Menü schließt es
        document.addEventListener('click', function (e) {
            if (isMenuOpen() && !navList.contains(e.target) && !navToggle.contains(e.target)) {
                setMenu(false);
            }
        });

        // Escape schließt das Menü
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMenuOpen()) {
                setMenu(false);
                navToggle.focus();
            }
        });

        // Beim Wechsel auf die Desktop-Ansicht Menü zurücksetzen
        var desktop = window.matchMedia('(min-width: 960px)');
        var onChange = function () { if (desktop.matches) setMenu(false); };
        if (desktop.addEventListener) desktop.addEventListener('change', onChange);
        else if (desktop.addListener) desktop.addListener(onChange);
    }

    /* ---------- 2. Bildansicht (Lightbox) ---------- */
    var images = Array.prototype.slice.call(
        document.querySelectorAll('.gallery-grid img, .einzelbilder img')
    );
    if (!images.length || typeof HTMLDialogElement !== 'function') return;

    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Bildansicht');
    dialog.innerHTML =
        '<figure class="lightbox__figure">' +
            '<img class="lightbox__img" alt="">' +
            '<figcaption class="lightbox__counter" aria-live="polite"></figcaption>' +
        '</figure>' +
        '<button type="button" class="lightbox__btn lightbox__close" aria-label="Bildansicht schließen">&times;</button>' +
        '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Vorheriges Bild">&#8249;</button>' +
        '<button type="button" class="lightbox__btn lightbox__next" aria-label="Nächstes Bild">&#8250;</button>';
    document.body.appendChild(dialog);

    var figure = dialog.querySelector('.lightbox__figure');
    var bigImg = dialog.querySelector('.lightbox__img');
    var counter = dialog.querySelector('.lightbox__counter');
    var current = 0;

    if (images.length === 1) dialog.setAttribute('data-single', '');

    function show(index) {
        current = (index + images.length) % images.length;
        var img = images[current];
        bigImg.src = img.currentSrc || img.src;
        bigImg.alt = img.getAttribute('alt') || '';
        counter.textContent = (current + 1) + ' / ' + images.length;
    }

    function openAt(index) {
        show(index);
        dialog.showModal();
        document.body.classList.add('lightbox-open');
    }

    dialog.addEventListener('close', function () {
        document.body.classList.remove('lightbox-open');
        if (images[current]) images[current].focus();
    });

    dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
    dialog.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });

    // Klick auf den dunklen Hintergrund schließt die Ansicht
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target === figure) dialog.close();
    });

    // Pfeiltasten blättern
    dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });

    // Wischen auf dem Smartphone
    var touchX = null;
    dialog.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });

    images.forEach(function (img, i) {
        img.classList.add('zoomable');
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', (img.getAttribute('alt') || 'Bild') + ' – vergrößern');
        img.addEventListener('click', function () { openAt(i); });
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAt(i);
            }
        });
    });
})();
