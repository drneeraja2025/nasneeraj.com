(function () {
  var STORAGE_KEY = 'saaniya-nav-collapsed';
  var navbar = document.querySelector('nav.navbar');
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  var navContainer = navbar ? navbar.querySelector('.nav-container') : null;
  var mobileQuery = window.matchMedia('(max-width: 960px)');

  function isMobile() {
    return mobileQuery.matches;
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

  function syncDrawerState(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('active', open);
    navLinks.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (isMobile()) {
      if (open) {
        navLinks.removeAttribute('inert');
      } else {
        navLinks.setAttribute('inert', '');
      }
    } else {
      navLinks.removeAttribute('inert');
      navLinks.setAttribute('aria-hidden', 'false');
    }

    if (menuToggle) {
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (!open) {
      closeAllDropdowns();
    }
  }

  function closeAllDropdowns(except) {
    if (!navLinks) return;
    navLinks.querySelectorAll('.nav-dropdown.open').forEach(function (item) {
      if (except && item === except) return;
      item.classList.remove('open');
      var menu = item.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('is-open');
      var trigger = item.querySelector('a');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function setDropdownOpen(item, open) {
    var trigger = item.querySelector('a');
    var menu = item.querySelector('.dropdown-menu');
    item.classList.toggle('open', open);
    if (menu) menu.classList.toggle('is-open', open);
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
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

    if (isMobile()) {
      syncDrawerState(false);
    } else if (navLinks) {
      navLinks.removeAttribute('inert');
      navLinks.setAttribute('aria-hidden', 'false');
      navLinks.classList.remove('active');
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

  function isDropdownTrigger(link) {
    if (!link || !link.parentElement) return false;
    return link.parentElement.classList.contains('nav-dropdown');
  }

  function wireDropdowns() {
    if (!navLinks) return;

    navLinks.querySelectorAll('.nav-dropdown').forEach(function (item) {
      var trigger = item.querySelector('a');
      var menu = item.querySelector('.dropdown-menu');
      if (!trigger || !menu || trigger.dataset.dropdownWired === '1') return;
      trigger.dataset.dropdownWired = '1';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('role', 'button');

      trigger.addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (typeof event.stopImmediatePropagation === 'function') {
            event.stopImmediatePropagation();
          }
          var willOpen = !item.classList.contains('open');
          closeAllDropdowns(item);
          setDropdownOpen(item, willOpen);
        },
        true
      );
    });
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

    function onViewportChange() {
      if (isMobile()) {
        setCollapsed(false);
        syncDrawerState(false);
      } else {
        var preferCollapsed = false;
        try {
          preferCollapsed = localStorage.getItem(STORAGE_KEY) === '1';
        } catch (err) {
          preferCollapsed = false;
        }
        setCollapsed(preferCollapsed);
        if (navLinks) {
          navLinks.classList.remove('active');
          navLinks.removeAttribute('inert');
          navLinks.setAttribute('aria-hidden', 'false');
        }
        closeAllDropdowns();
      }
    }

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', onViewportChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(onViewportChange);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAllDropdowns();
        if (!isMobile() && !navbar.classList.contains('collapsed')) {
          setCollapsed(true);
        }
      }
    });
  }

  if (navLinks) {
    wireDropdowns();

    document.addEventListener('click', function (event) {
      if (!navLinks.contains(event.target)) {
        closeAllDropdowns();
      }
    });
  }

  if (!menuToggle || !navLinks) return;

  menuToggle.setAttribute('aria-controls', 'navLinks');
  menuToggle.setAttribute('aria-expanded', 'false');

  if (isMobile()) {
    syncDrawerState(false);
  } else {
    navLinks.removeAttribute('inert');
    navLinks.setAttribute('aria-hidden', 'false');
  }

  function toggleMobileDrawer(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!isMobile()) return;
    syncDrawerState(!navLinks.classList.contains('active'));
  }

  menuToggle.addEventListener('click', toggleMobileDrawer);

  document.addEventListener('click', function (event) {
    if (!isMobile() || !navLinks.classList.contains('active')) return;
    var insideNav = navLinks.contains(event.target);
    var onToggle = menuToggle.contains(event.target);
    if (!insideNav && !onToggle) {
      syncDrawerState(false);
    }
  });

  navLinks.addEventListener('click', function (event) {
    if (!isMobile()) return;
    var link = event.target.closest('a');
    if (!link || !navLinks.contains(link)) return;
    if (isDropdownTrigger(link)) return;
    // Submenu / normal links close the drawer after navigation starts.
    syncDrawerState(false);
  });
})();
