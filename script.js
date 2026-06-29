/**
 * Dog Toy Bank — script.js
 * Lightweight vanilla JavaScript
 * - Mobile hamburger menu toggle
 * - Sticky header shadow on scroll
 * - Smooth scroll for anchor links
 * - Contact form validation & feedback
 */

(function () {
  'use strict';

  /* === Mobile Menu === */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen.toString());
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close mobile menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* === Sticky Header Shadow === */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* === Smooth Scroll for anchor links === */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // Move focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* === Contact Form Validation & Toast Feedback === */
  const contactForm = document.getElementById('contact-form');
  const toast       = document.getElementById('toast');

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('toast--error', !!isError);
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name    = contactForm.querySelector('#name').value.trim();
      const email   = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) { showToast('Please enter your name.', true); return; }
      if (!email || !emailRe.test(email)) { showToast('Please enter a valid email address.', true); return; }
      if (!message) { showToast('Please enter a message.', true); return; }

      /*
       * TO CONNECT A STATIC FORM BACKEND:
       * Option 1 — Formspree (https://formspree.io):
       *   1. Create a free Formspree account and get your endpoint.
       *   2. Set the form's action attribute to: https://formspree.io/f/YOUR_FORM_ID
       *   3. Set method="POST" on the form element.
       *   4. Remove this JS submit handler (or adapt it to call fetch() with FormData).
       *
       * Option 2 — Netlify Forms (if hosting on Netlify):
       *   Add netlify attribute to the <form> element and set method="POST".
       *
       * Option 3 — fetch() to Formspree (AJAX, keeps user on page):
       *   fetch('https://formspree.io/f/YOUR_FORM_ID', {
       *     method: 'POST',
       *     body: new FormData(contactForm),
       *     headers: { 'Accept': 'application/json' }
       *   }).then(r => r.ok ? showToast('Message sent! We\'ll be in touch.') : showToast('Something went wrong.', true));
       */

      // Placeholder success feedback (remove when Formspree is connected)
      showToast('Thanks for your message! We\'ll be in touch soon. 🐾');
      contactForm.reset();
    });
  }

  /* === Intersection Observer — fade-in on scroll === */
  const fadeEls = document.querySelectorAll('.how-card, .safety-item, .inside-item, details');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

})();
