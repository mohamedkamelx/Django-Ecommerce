let colorIndex = 1;

function updateColorPreview(input, preview) {
    const colorCode = input.value;
    if (/^#[0-9A-F]{6}$/i.test(colorCode)) {
        preview.style.backgroundColor = colorCode;
    } else {
        preview.style.backgroundColor = '#fff';
    }
}

function handleImageUpload(input, previewContainer, colorIndex) {
    const files = input.files;

    if (files.length > 0) {
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('image-preview-wrapper');

                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.classList.add('image-preview');

                const radioDiv = document.createElement('div');
                const radioElement = document.createElement('input');
                radioElement.type = 'radio';
                radioElement.name = `mainImage[${colorIndex}]`;
                radioElement.value = previewContainer.children.length;
                radioElement.classList.add('main-image-radio');

                const labelElement = document.createElement('label');
                labelElement.textContent = 'Main';

                radioElement.addEventListener('change', function() {
                    const radios = previewContainer.querySelectorAll('.main-image-radio');
                    radios.forEach(radio => {
                        if (radio !== radioElement) {
                            radio.checked = false;
                        }
                    });
                });

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'remove-image-btn');
                removeButton.onclick = function() {
                    wrapper.remove();
                    if (radioElement.checked) {
                        const remainingRadios = previewContainer.querySelectorAll('.main-image-radio');
                        if (remainingRadios.length > 0) {
                            remainingRadios[0].checked = true;
                        }
                    }
                };

                radioDiv.appendChild(radioElement);
                radioDiv.appendChild(labelElement);
                wrapper.appendChild(imgElement);
                wrapper.appendChild(radioDiv);
                wrapper.appendChild(removeButton);

                previewContainer.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        });
    }
}

document.getElementById('addColorBtn').addEventListener('click', function() {
    colorIndex++;
    const colorSection = `
        <div class="color-section mb-4">
            <h5>Color ${colorIndex}</h5>
            <div class="mb-3 row">
                <div class="col-sm-6">
                    <label for="skuColorCode${colorIndex}" class="form-label">Color Code (Hex)</label>
                    <input type="text" class="form-control sku-color-code" id="skuColorCode${colorIndex}" name="colorCode[]" required placeholder="#000000">
                    <label for="skuColorname${colorIndex}" class="form-label">Color name</label>
                    <input type="text" class="form-control sku-color-code" id="skuColorname${colorIndex}" name="colorname[]" required>
                </div>
                <div class="col-sm-6">
                    <span class="color-preview" id="colorPreview${colorIndex}"></span>
                </div>
            </div>
            <div class="size-section">
                <h6>Sizes & Inventory</h6>
                <div class="mb-3 row g-3 align-items-center">
                    <div class="col-sm-5">
                        <label for="skuSize${colorIndex}" class="form-label">Size</label>
                        <select class="form-select" id="skuSize${colorIndex}" name="size[${colorIndex - 1}][]" required>
                            <option value="">Select a size</option>
                            <option value="S">Small</option>
                            <option value="M">mediam</option>
                            <option value="L">Large</option>
                            <option value="XL">X-Large</option>
                        </select>
                    </div>
                    <div class="col-sm-5">
                        <label for="skuInventory${colorIndex}" class="form-label">Inventory</label>
                        <input type="number" class="form-control" id="skuInventory${colorIndex}" name="inventory[${colorIndex - 1}][]" required>
                    </div>
                    <div class="col-sm-2">
                        <button type="button" class="btn btn-secondary add-size-btn">Add Size</button>
                    </div>
                </div>
            </div>
            <div class="size-rows"></div>
            <div class="mb-3">
                <label for="colorImages${colorIndex}" class="form-label">Upload Images for Color ${colorIndex}</label>
                <input type="file" class="form-control" id="colorImages${colorIndex}" name="colorImages[${colorIndex - 1}][]" accept="image/*" multiple>
                <div id="imagePreviewContainer${colorIndex}" class="image-preview-container"></div>
            </div>
        </div>
    `;
    document.getElementById('colorSections').insertAdjacentHTML('beforeend', colorSection);

    const newColorInput = document.getElementById(`skuColorCode${colorIndex}`);
    const newColorPreview = document.getElementById(`colorPreview${colorIndex}`);
    newColorInput.addEventListener('input', function() {
        updateColorPreview(newColorInput, newColorPreview);
    });

    const newImageInput = document.getElementById(`colorImages${colorIndex}`);
    const newImagePreviewContainer = document.getElementById(`imagePreviewContainer${colorIndex}`);
    newImageInput.addEventListener('change', function() {
        handleImageUpload(newImageInput, newImagePreviewContainer, colorIndex - 1);
    });
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-size-btn')) {
        const sizeSection = e.target.closest('.size-section');
        const colorIndex = sizeSection.closest('.color-section').querySelector('.sku-color-code').id.replace('skuColorCode', '');

        const sizeRow = `
            <div class="mb-3 row size-row g-3 align-items-center">
                <div class="col-sm-5">
                    <select class="form-select" name="size[${colorIndex - 1}][]">
                        <option value="">Select a size</option>
                        <option value="S">Small</option>
                        <option value="M">mediam</option>
                        <option value="L">Large</option>
                        <option value="XL">X-Large</option>
                    </select>
                </div>
                <div class="col-sm-5">
                    <input type="number" class="form-control" name="inventory[${colorIndex - 1}][]" required>
                </div>
            </div>
        `;
        sizeSection.nextElementSibling.insertAdjacentHTML('beforeend', sizeRow);
    }
});

document.getElementById('skuColorCode1').addEventListener('input', function() {
    updateColorPreview(document.getElementById('skuColorCode1'), document.getElementById('colorPreview1'));
});

document.getElementById('colorImages1').addEventListener('change', function() {
    handleImageUpload(document.getElementById('colorImages1'), document.getElementById('imagePreviewContainer1'), 0);
});

// Form Submission Handler
document.getElementById('createProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('createProduct', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    }).then(response => response.json())  // Parse the JSON response
    .then(data => {  // Now work with the parsed data
      if (data.status === 'success') {
          alert('Product created successfully!');
          const slug = data.slug;  
          url =  `product/${slug}`;
          window.location.href =url;
      } else {
          alert('There was an issue creating the product.');
      }
  
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred during submission.');
    });
});