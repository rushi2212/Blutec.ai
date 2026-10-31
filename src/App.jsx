import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { renderRoute } from './legacy.js';
import './styles.css';

function Site() {
  const location = useLocation();
  const html = renderRoute(location.pathname, location.search);
  const priorPath = useRef(location.pathname);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('teddypups-intro-seen'));

  useEffect(() => {
    if (!showIntro) return;
    sessionStorage.setItem('teddypups-intro-seen', '1');
    const timer = window.setTimeout(() => setShowIntro(false), 2050);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

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
    const navigateClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === location.pathname || url.hash) return;
      event.preventDefault();
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
    document.addEventListener('click', navigateClick);
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
    const forms = [...document.querySelectorAll('#inquiryForm, form[data-inquiry]')];
    const submit = async event => {
      const form = event.currentTarget;
      event.preventDefault();
      const output = form.querySelector('[role="status"]');
      const values = Object.fromEntries(new FormData(form));
      try {
        const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(values) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Please check the form and try again.');
        output.textContent = form.dataset.inquiry === 'profile' ? 'Thanks — your message passed the local demo check. Use WhatsApp or email above to reach TeddyPups.' : 'Thanks — your message passed the local demo check. Use WhatsApp or email above to reach TeddyPups.';
        form.reset();
      } catch (error) { output.textContent = error.message || 'Your message could not be sent. Please contact us on WhatsApp.'; }
    };
    forms.forEach(form => form.addEventListener('submit', submit));
    let photoIndex = 0;
    let galleryMode = 'family';
    const modal = document.getElementById('mediaModal');
    const familyPhotos = [...document.querySelectorAll('[data-photo] img')];
    const detailPhotos = [...document.querySelectorAll('.detail-thumb img')];
    const showPhoto = index => {
      const photos = galleryMode === 'detail' ? detailPhotos : familyPhotos;
      if (!photos.length || !modal) return;
      photoIndex = (index + photos.length) % photos.length;
      const target = modal.querySelector('img');
      target.src = photos[photoIndex].src;
      target.alt = photos[photoIndex].alt;
      modal.classList.add('open');
    };
    const selectDetailPhoto = index => {
      if (!detailPhotos.length) return;
      photoIndex = (index + detailPhotos.length) % detailPhotos.length;
      const thumb = document.querySelector(`[data-detail-index="${photoIndex}"]`);
      const main = document.querySelector('.detail-main');
      if (thumb && main) { main.src = detailPhotos[photoIndex].src; main.alt = detailPhotos[photoIndex].alt; }
      document.querySelectorAll('[data-detail-index]').forEach((item, i) => { item.classList.toggle('active', i === photoIndex); item.setAttribute('aria-pressed', String(i === photoIndex)); });
      const count = document.querySelector('.detail-count');
      if (count) count.innerHTML = `${photoIndex + 1} <i>/</i> ${detailPhotos.length}`;
    };
    const galleryClick = event => {
      const familyButton = event.target.closest('[data-photo]');
      const detailButton = event.target.closest('[data-detail-open]');
      const detailThumb = event.target.closest('[data-detail-index]');
      if (familyButton) { galleryMode = 'family'; showPhoto(Number(familyButton.dataset.photo)); }
      if (detailButton) { galleryMode = 'detail'; showPhoto(Number(detailButton.dataset.detailOpen)); }
      if (detailThumb) { galleryMode = 'detail'; selectDetailPhoto(Number(detailThumb.dataset.detailIndex)); }
      if (event.target.closest('.detail-next')) selectDetailPhoto(photoIndex + 1);
      if (event.target.closest('.detail-prev')) selectDetailPhoto(photoIndex - 1);
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
    const header = document.querySelector('.site-header');
    let priorScroll = window.scrollY;
    const syncHeader = () => {
      const current = window.scrollY;
      header?.setAttribute('data-scrolled', String(current > 12));
      if (current < 16 || current < priorScroll - 4) header?.setAttribute('data-hidden', 'false');
      else if (current > priorScroll + 4 && current > 140) header?.setAttribute('data-hidden', 'true');
      priorScroll = current;
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    const revealItems = [...document.querySelectorAll('.section, .page-intro, .detail, .profile-intro, .page-wrap')];
    revealItems.forEach(item => item.classList.add('motion-reveal'));
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }) : null;
    revealItems.forEach(item => observer ? observer.observe(item) : item.classList.add('is-visible'));
    if (priorPath.current !== location.pathname) { window.scrollTo(0, 0); priorPath.current = location.pathname; }
    syncHeader();
    return () => {
      button?.removeEventListener('click', toggleMenu);
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('click', navigateClick);
      document.removeEventListener('click', faqClick);
      document.removeEventListener('click', filterClick);
      forms.forEach(form => form.removeEventListener('submit', submit));
      document.removeEventListener('click', galleryClick);
      document.removeEventListener('keydown', keyClick);
      window.removeEventListener('scroll', syncHeader);
      observer?.disconnect();
    };
  }, [location.pathname, location.search]);

  return <>
    <div dangerouslySetInnerHTML={{ __html: html }} />
    {showIntro && <div className="puppy-intro" aria-hidden="true">
      <div className="intro-sky"><span>🐾</span><span>🐾</span><span>🐾</span>
        <svg className="intro-runner" viewBox="0 0 180 130" fill="none">
          <path className="runner-tail" d="M43 54C22 42 25 19 40 20" stroke="#57301e" strokeWidth="9" strokeLinecap="round"/>
          <ellipse cx="86" cy="76" rx="49" ry="35" fill="#f6cc87" stroke="#57301e" strokeWidth="5"/>
          <ellipse cx="130" cy="53" rx="29" ry="27" fill="#f6cc87" stroke="#57301e" strokeWidth="5"/>
          <path className="runner-ear" d="M111 35C101 9 112 3 127 27" fill="#a9693d" stroke="#57301e" strokeWidth="4" strokeLinejoin="round"/>
          <ellipse cx="151" cy="60" rx="12" ry="9" fill="#fff4dc" stroke="#57301e" strokeWidth="4"/><circle cx="151" cy="43" r="3.5" fill="#28170f"/><circle cx="160" cy="60" r="2.5" fill="#28170f"/>
          <g className="runner-leg runner-leg-one"><path d="M61 98L55 119" stroke="#57301e" strokeWidth="9" strokeLinecap="round"/></g>
          <g className="runner-leg runner-leg-two"><path d="M109 100L115 119" stroke="#57301e" strokeWidth="9" strokeLinecap="round"/></g>
          <path d="M48 121h15M108 121h15" stroke="#57301e" strokeWidth="8" strokeLinecap="round"/>
        </svg>
      </div><div className="intro-blanket"><span>Welcome home, little one</span></div>
    </div>}
  </>;
}

export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>;
}
