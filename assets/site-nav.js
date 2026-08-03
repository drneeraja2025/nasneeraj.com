(function () {
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
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
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
})();
