  // Search functionality
  document.getElementById('searchIcon').addEventListener('click', function() {
    if (window.innerWidth <= 768) {
      // Mobile behavior
      const mobileSearch = document.getElementById('mobileSearch');
      mobileSearch.classList.toggle('active');
      if (mobileSearch.classList.contains('active')) {
        mobileSearch.querySelector('input').focus();
      }
    } else {
      // Desktop behavior
      const input = document.getElementById('searchInput');
      input.style.display = input.style.display === 'block' ? 'none' : 'block';
      if (input.style.display === 'block') {
        input.focus();
      }
    }
  });

  // Close search on outside click
  document.addEventListener('click', function(event) {
    const searchContainer = document.getElementById('searchContainer');
    const mobileSearch = document.getElementById('mobileSearch');
    const searchIcon = document.getElementById('searchIcon');

    if (!searchContainer.contains(event.target) && !mobileSearch.contains(event.target)) {
      if (window.innerWidth <= 768) {
        mobileSearch.classList.remove('active');
      } else {
        document.getElementById('searchInput').style.display = 'none';
      }
    }
  });

  // Profile dropdown
  document.addEventListener('DOMContentLoaded', function() {
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownMenu = profileDropdown.querySelector('.dropdown-menu');

    profileDropdown.addEventListener('mouseenter', function() {
      dropdownMenu.classList.add('show');
    });

    profileDropdown.addEventListener('mouseleave', function() {
      dropdownMenu.classList.remove('show');
    });
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    const mobileSearch = document.getElementById('mobileSearch');
    const searchInput = document.getElementById('searchInput');
    
    if (window.innerWidth > 768) {
      mobileSearch.classList.remove('active');
    } else {
      searchInput.style.display = 'none';
    }
  });