// drive.js - Google Drive Uploader with PHP backend (Service Account)
// Global loader ID constant
const DRIVE_UPLOAD_LOADER_ID = 'drive_upload_loader';

window.original_upld2drv = function (buttonElement, loaderId, clientName, urlInputIdOfOriginalFile, PreviewDvIdForOriginalUrl, fileSizeLimitOfOriginal, urlInputIdOfThumbnailFile, thumbnailSize, callbackFunctionName = null, resizeBy = 0, showThumb = 1, autoExecute = 1, uploadConfig = null, folderName = 'my1_mr') {

 // Validate required parameters
 if (!buttonElement || !loaderId || !urlInputIdOfOriginalFile || !PreviewDvIdForOriginalUrl || fileSizeLimitOfOriginal === undefined) {
  customAlert('Missing required parameters!');
  return;
 }

 // Set default thumbnail size if not provided
 if (urlInputIdOfThumbnailFile && (thumbnailSize === undefined || thumbnailSize === null)) {
  thumbnailSize = 200;
 }

 const fileInput = document.createElement('input');
 fileInput.type = 'file';
 fileInput.accept = 'image/*';
 fileInput.style.display = 'none';
 document.body.appendChild(fileInput);

 const originalText = buttonElement.textContent;
 buttonElement.textContent = originalText + ' wait';

 fileInput.click();

 fileInput.addEventListener('change', async () => {
  if (fileInput.files.length === 0) {
   buttonElement.textContent = originalText;
   document.body.removeChild(fileInput);
   return;
  }

  const originalFile = fileInput.files[0];

  // Check file size limit
  if (originalFile.size > fileSizeLimitOfOriginal * 1024) {
   customAlert(`File size exceeds the limit of ${fileSizeLimitOfOriginal} KB`);
   buttonElement.textContent = originalText;
   document.body.removeChild(fileInput);
   return;
  }

  const img = new Image();
  img.onload = async function () {
   originalFile.width = this.width;
   originalFile.height = this.height;

   // Create form group for previews
   const previewFormGroup = createFormGroup();
   previewFormGroup.id = 'upload_preview_group';
   previewFormGroup.style.zIndex = '10000';
   previewFormGroup.style.position = 'relative';

   const itemGuGroup = document.getElementById(urlInputIdOfOriginalFile).closest('.form_group');
   if (itemGuGroup) {
    itemGuGroup.insertAdjacentElement('afterend', previewFormGroup);
   } else {
    buttonElement.insertAdjacentElement('afterend', previewFormGroup);
   }

   const previewContainer = createPreviewContainer();
   previewFormGroup.appendChild(previewContainer);

   // Show original image info
   createImageInfoDisplay(originalFile, 'Selected Image', previewContainer);

   const hasThumbnailInput = urlInputIdOfThumbnailFile && urlInputIdOfThumbnailFile.trim() !== '';

   const uploadButton = document.createElement('button');
   uploadButton.textContent = hasThumbnailInput ? 'Upload Files' : 'Upload File';
   uploadButton.style.marginTop = '15px';
   uploadButton.style.padding = '10px 20px';
   uploadButton.style.backgroundColor = '#4CAF50';
   uploadButton.style.color = 'white';
   uploadButton.style.border = 'none';
   uploadButton.style.borderRadius = '4px';
   uploadButton.style.cursor = 'pointer';
   uploadButton.style.zIndex = '10001';
   uploadButton.style.position = 'relative';

   // Store loaderId in a variable accessible inside onclick
   const originalLoaderId = loaderId;

   uploadButton.onclick = async () => {
    // uploadButton.disabled = true;

    // CREATE/SHOW THE LOADER (ONLY ONCE)
    const activeLoader = createDynamicLoader2('drive_upload_loader', 'Processing...', null);

    const updateMessage = (msg) => {
     const msgEl = activeLoader.querySelector('.mra_loader-message');
     if (msgEl) msgEl.textContent = msg;
    };

    try {
     let thumbnailFile = null;
     if (hasThumbnailInput) {
      updateMessage('Generating thumbnail...');
      thumbnailFile = await resizeImageToThumbnail(originalFile, thumbnailSize, resizeBy);
     }

     updateMessage('Uploading ...');
     const result = await uploadFileToPHP(originalFile, thumbnailFile, clientName, folderName);

     if (!result.su || result.su !== 1) {
      throw new Error(result.ms || 'Upload failed');
     }

     // HIDE THE LOADER
     hideLoaderById2('drive_upload_loader');

     const originalData = result.da.original;
     const thumbnailData = result.da.thumbnail;
     const originalPreviewableUrl = originalData.directUrl;
     const thumbnailPreviewableUrl = thumbnailData ? thumbnailData.directUrl : "";

     const isGallery = (uploadConfig && uploadConfig.isGallery === 1);

     const originalInput = document.getElementById(urlInputIdOfOriginalFile);

     const inputIdParts = urlInputIdOfOriginalFile.split('_');
     const prefix = inputIdParts.length > 1 ? inputIdParts[0] : 'mra';
     const key = inputIdParts.length > 1 ? inputIdParts[1] : urlInputIdOfOriginalFile;
     const previewDivId = `${prefix}_${key}_div`;

     if (isGallery) {
      // GALLERY MODE
      let existingGallery = [];

      if (originalInput && originalInput.value) {
       try {
        const parsed = JSON.parse(originalInput.value);
        if (Array.isArray(parsed)) {
         existingGallery = parsed;
        }
       } catch (e) { }
      }

      const newImage = {
       a: originalPreviewableUrl,
       b: originalData.webViewLink
      };
      existingGallery.push(newImage);
      const galleryValue = JSON.stringify(existingGallery);

      if (originalInput) {
       originalInput.value = galleryValue;
      }

      let previewDiv = document.getElementById(previewDivId);
      if (!previewDiv) {
       previewDiv = document.createElement('div');
       previewDiv.id = previewDivId;
       previewDiv.className = 'mra__value-div';

       const inputContainer = originalInput?.closest('.mra__input-container');
       if (inputContainer && inputContainer.parentNode) {
        inputContainer.parentNode.insertBefore(previewDiv, inputContainer.nextSibling);
       } else {
        const formGroup = originalInput?.closest('.mra__form-group');
        if (formGroup) {
         formGroup.appendChild(previewDiv);
        }
       }
      }

      if (typeof window.setGalleryImages === 'function') {
       window.setGalleryImages(
        urlInputIdOfOriginalFile,
        galleryValue,
        previewDivId,
        key,
        { a: key, b: 'setGalleryImages' }
       );
      }

      if (thumbnailData && urlInputIdOfThumbnailFile) {
       const thumbnailInput = document.getElementById(urlInputIdOfThumbnailFile);
       if (thumbnailInput) {
        const thumbKey = urlInputIdOfThumbnailFile.split('_')[1] || urlInputIdOfThumbnailFile;
        const thumbPreviewDivId = `${prefix}_${thumbKey}_div`;

        let existingThumbGallery = [];
        if (thumbnailInput.value) {
         try {
          const parsed = JSON.parse(thumbnailInput.value);
          if (Array.isArray(parsed)) {
           existingThumbGallery = parsed;
          }
         } catch (e) { }
        }
        existingThumbGallery.push({
         a: thumbnailPreviewableUrl,
         b: thumbnailData.webViewLink
        });
        thumbnailInput.value = JSON.stringify(existingThumbGallery);

        if (typeof window.setGalleryImages === 'function') {
         window.setGalleryImages(
          urlInputIdOfThumbnailFile,
          JSON.stringify(existingThumbGallery),
          thumbPreviewDivId,
          thumbKey,
          { a: thumbKey, b: 'setGalleryImages' }
         );
        }
       }
      }

     } else {
      // SINGLE IMAGE MODE
      if (originalInput) {
       originalInput.value = originalPreviewableUrl;
      }

      let previewDiv = document.getElementById(previewDivId);
      if (!previewDiv) {
       previewDiv = document.createElement('div');
       previewDiv.id = previewDivId;
       previewDiv.className = 'mra__value-div';

       const inputContainer = originalInput?.closest('.mra__input-container');
       if (inputContainer && inputContainer.parentNode) {
        inputContainer.parentNode.insertBefore(previewDiv, inputContainer.nextSibling);
       } else {
        const formGroup = originalInput?.closest('.mra__form-group');
        if (formGroup) {
         formGroup.appendChild(previewDiv);
        }
       }
      }

      if (typeof window.prepImgByURL === 'function') {
       window.prepImgByURL(
        urlInputIdOfOriginalFile,
        originalPreviewableUrl,
        previewDivId,
        key,
        { a: key, b: 'prepImgByURL' }
       );
      }

      if (thumbnailData && urlInputIdOfThumbnailFile) {
       const thumbnailInput = document.getElementById(urlInputIdOfThumbnailFile);
       if (thumbnailInput) {
        thumbnailInput.value = thumbnailPreviewableUrl;
       }
      }
     }

     if (callbackFunctionName && typeof window[callbackFunctionName] === 'function') {
      window[callbackFunctionName]({
       originalUrl: originalPreviewableUrl,
       thumbnailUrl: thumbnailPreviewableUrl || null,
       originalInputId: urlInputIdOfOriginalFile,
       thumbnailInputId: urlInputIdOfThumbnailFile || null,
       isGallery: isGallery ? 1 : 0
      });
     }

     if (previewFormGroup && previewFormGroup.remove) {
      previewFormGroup.remove();
     }

     buttonElement.disabled = false;
     buttonElement.textContent = originalText;

     // Final safety hide
     setTimeout(() => {
      hideLoaderById2('drive_upload_loader');
     }, 100);

     if (typeof showToast === 'function') {
      showToast('Upload successful!', {
       duration: 3000,
       position: 'top',
       type: 'success',
       dismissible: true
      });
     }

    } catch (error) {
     hideLoaderById2('drive_upload_loader');
     customAlert('Upload failed: ' + error.message);
     uploadButton.disabled = false;
    }
   };

   previewContainer.appendChild(uploadButton);
  };

  img.onerror = function () {
   customAlert('The selected file is not a valid image.');
   buttonElement.textContent = originalText;
   document.body.removeChild(fileInput);
  };

  img.src = URL.createObjectURL(originalFile);
 }, { once: true });
};

// Wrapper function for mra__main calling convention
window.upld2drv = function (inputId, value, divId, key, fullObject) {
 console.log('upld2drv wrapper called with:', { inputId, value, divId, key, fullObject });

 // Extract parameters from fullObject
 const clientName = fullObject.c || 'default';
 const fileSizeLimitOfOriginal = parseInt(fullObject.d) || 1024;
 const thumbnailSize = parseInt(fullObject.e) || 200;
 const thumbnailInputId = fullObject.f || null;
 const callbackFunctionName = fullObject.g || null;
 const resizeBy = parseInt(fullObject.h) || 0;
 const showThumb = parseInt(fullObject.i) || 1;
 const autoExecute = parseInt(fullObject.j) || 1;
 const loaderId = fullObject.k || 'loader';
 const isGallery = parseInt(fullObject.l) || 0;
 const folderName = fullObject.m || 'my1_mr';

 // Get the button element
 const buttonElement = document.getElementById(divId);
 if (!buttonElement) {
  console.error('Button element not found:', divId);
  customAlert('Button element not found');
  return;
 }

 // Hide the input element
 const inElement = document.getElementById(inputId);
 if (inElement) {
  inElement.style.display = 'none';
 }

 // Store config for upload
 const uploadConfig = {
  isGallery: isGallery,
  inputId: inputId,
  divId: divId,
  thumbnailInputId: thumbnailInputId,
  callbackFunctionName: callbackFunctionName,
  folderName: folderName
 };

 // Call original upload function
 window.original_upld2drv(
  buttonElement,
  loaderId,
  clientName,
  inputId,
  divId,
  fileSizeLimitOfOriginal,
  thumbnailInputId,
  thumbnailSize,
  callbackFunctionName,
  resizeBy,
  showThumb,
  autoExecute,
  uploadConfig,
  folderName
 );
};

// Upload both original and thumbnail in one call
async function uploadFileToPHP(originalFile, thumbnailFile, clientName, folderName) {
 const formData = new FormData();
 formData.append('original_file', originalFile);
 formData.append('client', clientName);
 formData.append('folder', folderName || 'my1_mr');

 if (thumbnailFile) {
  formData.append('thumbnail_file', thumbnailFile);
 }

 const response = await fetch('https://my1.in/drive_upload.php', {
  method: 'POST',
  body: formData
 });

 return await response.json();
}

// Helper functions (keep as is)
function createFormGroup() {
 const formGroup = document.createElement('div');
 formGroup.className = 'form_group';
 formGroup.style.marginBottom = '20px';
 formGroup.style.padding = '15px';
 formGroup.style.border = '1px solid #ddd';
 formGroup.style.borderRadius = '5px';
 formGroup.style.backgroundColor = '#f9f9f9';
 return formGroup;
}

function createPreviewContainer() {
 const container = document.createElement('div');
 container.style.display = 'flex';
 container.style.flexDirection = 'column';
 container.style.gap = '20px';
 return container;
}

function createImageInfoDisplay(image, title, container) {
 const infoContainer = document.createElement('div');
 infoContainer.style.flex = '1';

 const titleElement = document.createElement('h4');
 titleElement.textContent = title;
 titleElement.style.margin = '0 0 10px 0';
 titleElement.style.color = '#333';

 const previewContainer = document.createElement('div');
 previewContainer.style.marginBottom = '10px';
 previewContainer.style.textAlign = 'center';

 const imgElement = document.createElement('img');
 imgElement.src = URL.createObjectURL(image);
 imgElement.style.maxWidth = '100%';
 imgElement.style.maxHeight = '200px';
 imgElement.style.borderRadius = '4px';
 imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

 const infoElement = document.createElement('div');
 infoElement.style.fontSize = '14px';
 infoElement.style.color = '#555';
 infoElement.innerHTML = `
        <p>Name: ${image.name}</p>
        <p>Size: ${(image.size / 1024).toFixed(2)} KB</p>
        <p>Type: ${image.type}</p>
    `;

 if (image.width && image.height) {
  infoElement.innerHTML += `<p>Dimensions: ${image.width} × ${image.height}px</p>`;
 }

 previewContainer.appendChild(imgElement);
 infoContainer.appendChild(titleElement);
 infoContainer.appendChild(previewContainer);
 infoContainer.appendChild(infoElement);
 container.appendChild(infoContainer);

 return imgElement;
}

function resizeImageToThumbnail(originalImage, resize2pixels, resizeBy_w0_h1 = 0) {
 return new Promise((resolve) => {
  const img = new Image();
  img.onload = function () {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');

   let newWidth, newHeight;

   if (resizeBy_w0_h1 === 1) {
    const ratio = resize2pixels / img.height;
    newWidth = img.width * ratio;
    newHeight = resize2pixels;
   } else {
    const ratio = resize2pixels / img.width;
    newWidth = resize2pixels;
    newHeight = img.height * ratio;
   }

   canvas.width = newWidth;
   canvas.height = newHeight;
   ctx.drawImage(img, 0, 0, newWidth, newHeight);

   canvas.toBlob((blob) => {
    const thumbnailFile = new File([blob], 'thumb_' + originalImage.name, {
     type: 'image/webp',
     lastModified: Date.now()
    });
    thumbnailFile.width = newWidth;
    thumbnailFile.height = newHeight;
    resolve(thumbnailFile);
   }, 'image/webp', 0.85);
  };
  img.src = URL.createObjectURL(originalImage);
 });
}

function createUploadedImagePreview(url, title, container, showThumb) {
 const previewContainer = document.createElement('div');
 previewContainer.style.margin = '15px 0';

 const titleElement = document.createElement('h4');
 titleElement.textContent = title;
 titleElement.style.margin = '0 0 10px 0';
 titleElement.style.color = '#333';

 const imgElement = document.createElement('img');
 imgElement.src = url;
 imgElement.style.maxWidth = '100%';
 imgElement.style.maxHeight = '200px';
 imgElement.style.borderRadius = '4px';
 imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
 imgElement.onerror = function () {
  imgElement.src = 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png';
 };

 const linkElement = document.createElement('a');
 linkElement.href = url;
 linkElement.target = '_blank';
 linkElement.textContent = 'Open in Drive';
 linkElement.style.display = 'block';
 linkElement.style.marginTop = '5px';
 linkElement.style.fontSize = '14px';
 linkElement.style.color = '#1a73e8';

 previewContainer.appendChild(titleElement);
 previewContainer.appendChild(imgElement);
 previewContainer.appendChild(linkElement);

 if (showThumb === 0) {
  previewContainer.style.display = 'none';
 }

 container.appendChild(previewContainer);
 return url;
}