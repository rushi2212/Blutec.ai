import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { renderRoute } from './legacy.js';
import './styles.css';

function Site() {
  const location = useLocation();
  const html = renderRoute(location.pathname, location.search);

  useEffect(() => {
    const menu = document.getElementById('menuPanel');
    const button = document.getElementById('menuButton');
    const toggleMenu = () => {
      const open = menu?.classList.toggle('open');
      button?.setAttribute('aria-expanded', String(Boolean(open)));
    };
    button?.addEventListener('click', toggleMenu);
    const closeMenu = event => {
      if (menu && !menu.contains(event.target) && !button?.contains(event.target)) menu.classList.remove('open');
    };
    document.addEventListener('click', closeMenu);
    const faqClick = event => {
      const button = event.target.closest('.faq-q');
      if (!button) return;
      const answer = button.nextElementSibling;
      const open = answer.hidden;
      answer.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span').textContent = open ? '−' : '+';
    };
    document.addEventListener('click', faqClick);
    const filterClick = event => {
      const filterButton = event.target.closest('[data-filter]');
      if (!filterButton) return;
      const filter = filterButton.dataset.filter;
      const url = new URL(location.pathname, window.location.origin);
      if (filter !== 'All') url.searchParams.set('breed', filter);
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
    document.addEventListener('click', filterClick);
    const form = document.getElementById('inquiryForm');
    const submit = async event => {
      if (event.target !== form) return;
      event.preventDefault();
      const output = form.querySelector('[role="status"]');
      const values = Object.fromEntries(new FormData(form));
      try {
        const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(values) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Please check the form and try again.');
        output.textContent = 'Thanks — your message passed the local demo check. To reach our team, use the WhatsApp or email links above.';
        form.reset();
      } catch (error) { output.textContent = error.message || 'Your message could not be sent. Please contact us on WhatsApp.'; }
    };
    form?.addEventListener('submit', submit);
    let photoIndex = 0;
    const modal = document.getElementById('mediaModal');
    const showPhoto = index => {
      const photos = [...document.querySelectorAll('[data-photo] img')];
      if (!photos.length || !modal) return;
      photoIndex = (index + photos.length) % photos.length;
      const target = modal.querySelector('img');
      target.src = photos[photoIndex].src;
      target.alt = photos[photoIndex].alt;
      modal.classList.add('open');
    };
    const galleryClick = event => {
      if (event.target.closest('[data-photo]')) showPhoto(Number(event.target.closest('[data-photo]').dataset.photo));
      if (event.target.closest('.modal-close') || event.target === modal) modal?.classList.remove('open');
      if (event.target.closest('.modal-next')) showPhoto(photoIndex + 1);
      if (event.target.closest('.modal-prev')) showPhoto(photoIndex - 1);
    };
    const keyClick = event => {
      if (event.key === 'Escape') modal?.classList.remove('open');
      if (modal?.classList.contains('open') && event.key === 'ArrowRight') showPhoto(photoIndex + 1);
      if (modal?.classList.contains('open') && event.key === 'ArrowLeft') showPhoto(photoIndex - 1);
    };
    document.addEventListener('click', galleryClick);
    document.addEventListener('keydown', keyClick);
    window.scrollTo(0, 0);
    return () => {
      button?.removeEventListener('click', toggleMenu);
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('click', faqClick);
      document.removeEventListener('click', filterClick);
      form?.removeEventListener('submit', submit);
      document.removeEventListener('click', galleryClick);
      document.removeEventListener('keydown', keyClick);
    };
  }, [location.pathname, location.search]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}
