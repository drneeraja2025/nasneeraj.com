(function () {
  var STORAGE_KEY = 'saaniya-nav-collapsed';
  var navbar = document.querySelector('nav.navbar');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navContainer = navbar ? navbar.querySelector('.nav-container') : null;

  function isMobile() {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  function setCollapsed(collapsed) {
    if (!navbar) return;
    navbar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('nav-collapsed', collapsed);
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch (err) {
      /* ignore storage errors */
    }
    var btn = document.getElementById('sidebarCollapse');
    if (btn) {
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.setAttribute(
        'aria-label',
        collapsed ? 'Expand navigation' : 'Collapse navigation'
      );
      var label = btn.querySelector('.sidebar-collapse-label');
      if (label) {
        label.textContent = collapsed ? 'Expand' : 'Collapse';
      }
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
    btn.innerHTML =
      '<span class="sidebar-collapse-icon" aria-hidden="true">⟨</span>' +
      '<span class="sidebar-collapse-label">Collapse</span>';

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
      setCollapsed(!navbar.classList.contains('collapsed'));
    });

    return btn;
  }

  if (navbar && navContainer) {
    ensureCollapseButton();
    var saved = false;
    try {
      saved = localStorage.getItem(STORAGE_KEY) === '1';
    } catch (err) {
      saved = false;
    }
    if (!isMobile()) {
      setCollapsed(saved);
    }

    window.addEventListener('resize', function () {
      if (isMobile()) {
        navbar.classList.remove('collapsed');
        document.body.classList.remove('nav-collapsed');
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
