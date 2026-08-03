(function () {
  var STORAGE_KEY = 'saaniya-nav-collapsed';
  var navbar = document.querySelector('nav.navbar');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navContainer = navbar ? navbar.querySelector('.nav-container') : null;

  function isMobile() {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  function ensureReopenButton() {
    var existing = document.getElementById('sidebarReopen');
    if (existing) return existing;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'sidebarReopen';
    btn.className = 'sidebar-reopen';
    btn.setAttribute('aria-label', 'Open navigation');
    btn.title = 'Open navigation';
    btn.innerHTML =
      '<img src="assets/Saaniyalogo.png" alt="" width="28" height="28">';
    document.body.appendChild(btn);

    btn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setCollapsed(false);
    });

    return btn;
  }

  function setCollapsed(collapsed) {
    if (!navbar) return;
    if (isMobile()) {
      collapsed = false;
    }

    navbar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('nav-collapsed', collapsed);
    navbar.setAttribute('aria-hidden', collapsed ? 'true' : 'false');

    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (err) {
      /* ignore storage errors */
    }

    var hideBtn = document.getElementById('sidebarCollapse');
    if (hideBtn) {
      hideBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    var reopen = ensureReopenButton();
    reopen.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (!isMobile() && collapsed) {
      reopen.focus();
    }
  }

  function ensureCollapseButton() {
    if (!navbar || !navContainer) return null;
    var existing = document.getElementById('sidebarCollapse');
    if (existing) return existing;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'sidebarCollapse';
    btn.className = 'sidebar-collapse';
    btn.setAttribute('aria-controls', 'navLinks');
    btn.setAttribute('aria-label', 'Close navigation');
    btn.title = 'Close navigation';
    btn.innerHTML =
      '<span class="sidebar-collapse-icon" aria-hidden="true">⟨</span>';

    var logo = navContainer.querySelector('.nav-logo');
    if (logo && logo.nextSibling) {
      navContainer.insertBefore(btn, logo.nextSibling);
    } else {
      navContainer.insertBefore(btn, navContainer.firstChild);
    }

    btn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (isMobile()) return;
      setCollapsed(true);
    });

    return btn;
  }

  if (navbar && navContainer) {
    ensureCollapseButton();
    ensureReopenButton();

    var saved = false;
    try {
      saved = localStorage.getItem(STORAGE_KEY) === '1';
    } catch (err) {
      saved = false;
    }
    setCollapsed(!isMobile() && saved);

    window.addEventListener('resize', function () {
      if (isMobile()) {
        setCollapsed(false);
      } else {
        var preferCollapsed = false;
        try {
          preferCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
        } catch (err) {
          preferCollapsed = false;
        }
        setCollapsed(preferCollapsed);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !isMobile() && !navbar.classList.contains('collapsed')) {
        setCollapsed(true);
      }
    });
  }

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', function (event) {
    event.stopPropagation();
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.addEventListener('click', function (event) {
    var insideNav = navLinks.contains(event.target);
    var onToggle = menuToggle.contains(event.target);
    if (!insideNav && !onToggle && navLinks.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!isMobile()) return;
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
})();
