document.addEventListener('DOMContentLoaded', function() {
    // Select all add to cart buttons and cart badge
    const addToCartBtns = document.querySelectorAll('.custom-radius-btn');
    const cartBadge = document.querySelector('.cart-icon .badge');
    
    // Get initial cart count
    let cartCount = parseInt(cartBadge.textContent) || 0;
    
    // Add click event listener to each button
    addToCartBtns.forEach(function(btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Update cart count
            cartCount++;
            cartBadge.textContent = cartCount;
            
            // Animate the badge
            cartBadge.classList.add('pulse');
            setTimeout(() => {
                cartBadge.classList.remove('pulse');
            }, 300);
            
            // Store original button content
            const originalContent = this.innerHTML;
            
            // Change button appearance
            this.innerHTML = '<i class="bi bi-check2 me-2"></i>Added';
            this.disabled = true;
            
            // Reset button after delay
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
                this.disabled = false;
            }, 1000);
        };
    });
    
});