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
    hamburgerBtn.classList.toggle('active', isActive);
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
  // 대상: fade-in-element 요소
  // DOM 렌더링: viewport 진입 시 .visible 클래스 추가
  // ==========================================================================
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    if (!fadeElements.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: CONFIG.SCROLL?.INTERSECTION_THRESHOLD || 0.2
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // 한번 노출 된 후 옵저버 해제
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  }

  // ==========================================================================
  // 5. GitHub API Fetching & 4-State UI (Loading / Success / Error / Empty)
  // ==========================================================================


  // ==========================================================================
  // 6. Contact Form Validation UX
  // 이벤트: input(실시간 검증 해제), submit(전체 유효성 검사)
  // 상태 변경: 폼 유효성 여부
  // DOM 렌더링: 인라인 에러 메시지 표시/숨김, 성공 알림 배너 노출, 폼 리셋
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const messageInput = document.getElementById('user-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const successMessage = document.getElementById('form-success-message');

  function validateEmail(email) {
    // 이메일 정규식 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
  }

  function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
  }

  function setError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
  }

  // 실시간 입력 이벤트: 사용자가 수정하면 즉시 에러 제거
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        clearError(nameInput, nameError);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (validateEmail(emailInput.value.trim())) {
        clearError(emailInput, emailError);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 5) {
        clearError(messageInput, messageError);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // 기본 폼 제출 방지

      let isValid = true;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      // 이름 검증
      if (!nameVal) {
        setError(nameInput, nameError, '이름을 입력해주세요.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // 이메일 검증
      if (!emailVal) {
        setError(emailInput, emailError, '이메일 주소를 입력해주세요.');
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        setError(emailInput, emailError, '올바른 이메일 형식(example@domain.com)으로 입력해주세요.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // 메시지 내용 검증
      if (!messageVal) {
        setError(messageInput, messageError, '문의 내용을 입력해주세요.');
        isValid = false;
      } else if (messageVal.length < 5) {
        setError(messageInput, messageError, '내용을 5자 이상 입력해주세요.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      // 유효성 검사 실패 시 첫 번째 오류 필드로 포커스 이동
      if (!isValid) {
        const firstErrorInput = contactForm.querySelector('.input-error');
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      // 성공 시: 성공 메시지 피드백 표시 및 폼 초기화
      if (successMessage) {
        successMessage.classList.remove('hidden');
        contactForm.reset();

        // 6초 후 성공 안내 자동 숨김
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 6000);
      }
    });
  }

  // ==========================================================================
  // 7. Typing Effect (Hero Section)
  // ==========================================================================
  const typingElement = document.getElementById('typing-text');
  const typingWords = CONFIG.PROFILE?.typingTexts || [
    'Front-End Developer.',
    'Creative Problem Solver.',
    'Continuous Learner.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentWord = typingWords[wordIndex];

      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

    if (!isDeleting && charIndex === currentWord.length) {
      // 한 단어 완성 시 일시 대기
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // 단어 삭제 완료 시 다음 단어로 이동
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // ==========================================================================
  // Utility Functions & Config Reflection
  // ==========================================================================


  // ==========================================================================
  // Initialization
  // ==========================================================================
  initTheme();
  initScrollAnimations()
  typeEffect();
});