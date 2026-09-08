/**
 * "사용자 이벤트 > 상태 변경 > DOM 렌더링" 패턴 구현
 * 1. Dark Mode Theme Manager (LocalStorage + prefers-color-scheme)
 * 2. Mobile Navigation & Hamburger Toggle
 * 3. Scroll Interactions (Navbar Background, Scroll-to-Top, Smooth Scroll)
 * 4. Intersection Observer Scroll Animations
 * 5. GitHub API Async Fetching & 4-State UI (Loading / Success / Error / Empty)
 * 6. Contact Form Validation UX
 * 7. Hero Text Typing Effect
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // Global State
  // ==========================================================================
  const state = {
    theme: 'light', // 'light' | 'dark'
  }

  // ==========================================================================
  // 1. Theme Management (Dark Mode / Light Mode)
  // 이벤트: 테마 토글 버튼 클릭
  // 상태 변경: state.theme 변경 (light <-> dark)
  // DOM 렌더링: DocumentElement data-theme 변경, 토글 아이콘 교체, localStorage에 저장
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  function initTheme() {
    const savedTheme = localStorage.getItem('portfolio_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 저장된 설정 우선, 없을 시 시스템 설정 반영
    state.theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    renderTheme();

    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio_theme')) {
        state.theme = e.matches ? 'dark' : 'light';
        renderTheme();
      }
    });

    function toggleTheme() {
      state.theme = (state.theme === 'light') ? 'dark' : 'light';
      localStorage.setItem('portfolio_theme', state.theme);
      renderTheme();
    }

    function renderTheme() {
      document.documentElement.setAttribute('data-theme', state.theme);
      if(themeIcon) {
        if (state.theme === 'dark') {
          themeIcon.className = 'fa-solid fa-sun'; // FontAwesome 아이콘 클래스 변경
          themeToggleBtn.setAttribute('title', '라이트 모드로 전환');
          themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
        } else {
          themeIcon.className = 'fa-solid fa-moon'; // FontAwesome 아이콘 클래스 변경
          themeToggleBtn.setAttribute('title', '다크 모드로 전환');
          themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
        }
      }
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  }

  // ==========================================================================
  // 2. Mobile Navigation & Hamburger Menu Toggle
  // 이벤트: 햄버거 메뉴 버튼 클릭, 메뉴 링크 클릭, 외부 영역 클릭
  // 상태 변경: navOpen boolean
  // DOM 렌더링: active 클래스 토글, aria-expanded 갱신, 햄버거 아이콘 변경
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isActive = navMenu.classList.toggle('active');
    hamburgerBtn.clssList.toggle('active', isActive);
    hamburgerBtn.setAttribute('aria-expanded', String(isActive));
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu()
    });
  });

  // 외부 영역 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (
      navMenu &&
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 3. Scroll Interactions (Navbar, Top Button, Active Section)
  // 이벤트: window scroll
  // DOM 렌더링: header scrolled 클래스, top-button visible 클래스, nav-link active 갱신
  // ==========================================================================
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // 네비게이션 헤더 배경 전환 (기본 60px 이상)
    if (header) {
      if (currentScrollY >= (CONFIG.SCROLL?.NAVBAR_THRESHOLD || 60)) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 맨 위로가기 버튼 노출 (기본 300px 이상)
    if (scrollTopBtn) {
      if (currentScrollY >= (CONFIG.SCROLL?.TOP_BTN_THRESHOLD || 300)) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // 현재 스크롤 위치에 따른 네비게이션 링크 활성화
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 4. Scroll Animations (Intersection Observer)
  // ==========================================================================


  // ==========================================================================
  // 5. GitHub API Fetching & 4-State UI (Loading / Success / Error / Empty)
  // ==========================================================================


  // ==========================================================================
  // 6. Contact Form Validation UX
  // ==========================================================================


  // ==========================================================================
  // 7. Typing Effect (Hero Section)
  // ==========================================================================


  // ==========================================================================
  // Utility Functions & Config Reflection
  // ==========================================================================


  // ==========================================================================
  // Initialization
  // ==========================================================================
  initTheme();

});