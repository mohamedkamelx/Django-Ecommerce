document.addEventListener('DOMContentLoaded', function() {
    // Product Data and State Management
    let productData = null;
    let currentState = {
        selectedColor: null,
        selectedSize: null,
        currentImageIndex: 0
    };

    // DOM Elements
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const colorContainer = document.getElementById('colorContainer');
    const sizeContainer = document.getElementById('sizeContainer');
    const selectedColorText = document.getElementById('selectedColorText');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const savetBtn = document.getElementById('saveBtn');

    // Initialize Colors
    function initializeColors() {
        if (!productData || !productData.colors) return;
        
        colorContainer.innerHTML = productData.colors.map((color, index) => `
            <div class="color-swatch ${index === 0 ? 'active' : ''}"
                style="background-color: ${color.code}"
                data-color-index="${index}"
                title="${color.name}">
            </div>
        `).join('');

        // Set initial color
        currentState.selectedColor = productData.colors[0];
        selectedColorText.textContent = currentState.selectedColor.name;

        // Add click events to color swatches
        colorContainer.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', function() {
                const colorIndex = parseInt(this.dataset.colorIndex);
                updateColorSelection(colorIndex);
            });
        });
    }

    // Initialize Sizes
    function initializeSizes() {
        if (!currentState.selectedColor) return;
        updateSizeButtons();
    }

    // Update Size Buttons based on color availability
    function updateSizeButtons() {
        if (!productData || !productData.sizes || !currentState.selectedColor) return;

        sizeContainer.innerHTML = productData.sizes.map(size => {
            const isAvailable = currentState.selectedColor.availableSizes.includes(size);
            return `
                <button class="size-btn ${!isAvailable ? 'disabled' : ''}"
                        ${!isAvailable ? 'disabled' : ''}
                        data-size="${size}">
                    ${size}
                </button>
            `;
        }).join('');

        // Add click events to size buttons
        sizeContainer.querySelectorAll('.size-btn:not(.disabled)').forEach(button => {
            button.addEventListener('click', function() {
                updateSizeSelection(this.dataset.size);
            });
        });
    }

    let currentImageIndex = 0; // Track the current image index

    function initializeImages() {
        if (!currentState.selectedColor) return;
        updateImages();
    }

    function updateImages() {
        if (!currentState.selectedColor || !currentState.selectedColor.images) return;

        // Update main image source
        mainImage.src = currentState.selectedColor.images[currentImageIndex];

        // Populate thumbnails
        thumbnailContainer.innerHTML = currentState.selectedColor.images.map((img, index) => `
            <img src="${img}" class="img-fluid rounded-2 thumbnail cursor-pointer" data-image-index="${index}" alt="Product view ${index + 1}">
        `).join('');

        // Add click events to thumbnails
        thumbnailContainer.querySelectorAll('.thumbnail').forEach(img => {
            img.addEventListener('click', function() {
                currentImageIndex = parseInt(this.dataset.imageIndex);
                updateMainImage(currentImageIndex);
            });
        });
        
        // Highlight the active thumbnail
        highlightActiveThumbnail();
    }

    // Function to update the main image based on index
    function updateMainImage(index) {
        currentImageIndex = index;
        mainImage.src = currentState.selectedColor.images[currentImageIndex];

        // Highlight the active thumbnail
        highlightActiveThumbnail();
    }

    // Function to highlight the active thumbnail
    function highlightActiveThumbnail() {
        thumbnailContainer.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === currentImageIndex);
        });
    }

    // Event listeners for next and previous buttons
    document.getElementById('prevImageBtn').addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + currentState.selectedColor.images.length) % currentState.selectedColor.images.length;
        updateMainImage(currentImageIndex);
    });

    document.getElementById('nextImageBtn').addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % currentState.selectedColor.images.length;
        updateMainImage(currentImageIndex);
    });

    // Update Color Selection
    function updateColorSelection(colorIndex) {
        if (!productData || !productData.colors) return;

        // Update the selected color
        currentState.selectedColor = productData.colors[colorIndex];
        currentState.selectedSize = null;
        currentState.currentImageIndex = 0;

        // Update UI
        colorContainer.querySelectorAll('.color-swatch').forEach((swatch, index) => {
            swatch.classList.toggle('active', index === colorIndex);
        });
        selectedColorText.textContent = currentState.selectedColor.name;

        updateImages(); // Update images to reflect new color selection
        updateSizeButtons();
    }

    // Update Size Selection
    function updateSizeSelection(size) {
        currentState.selectedSize = size;
        
        // Update UI
        sizeContainer.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
    }


    const cartBadge = document.querySelector('.cart-icon .badge');
    let cartCount = parseInt(cartBadge.textContent) || 0;

    // Add to Cart
    function addToCart() {
        if (!currentState.selectedSize) {
            alert('Please select a size');
            return;
        }
        if (!currentState.selectedColor) {
            alert('Please select a color');
            return;
        }
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


    }
    function saveItem() {
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
            this.style.background = 'white';
            this.disabled = false;
        }, 1000);


    }


    const itemSlug = document.querySelector('[data-item-slug]').dataset.itemSlug;
    fetch(`http://127.0.0.1:8000/main/product/${itemSlug}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        productData = data;
        // Initialize all components after data is loaded
        initializeColors();
        initializeSizes();
        initializeImages();
        
        // Add cart button listener
        addToCartBtn.addEventListener('click', addToCart);
        savetBtn.addEventListener('click', saveItem);
    })
    .catch(error => {
        console.error('Error loading product data:', error);
    });
});