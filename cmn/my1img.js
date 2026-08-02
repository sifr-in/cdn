// example: const imgObjDimensRqd = ["1920x1080px~1-512kb", "1280x720px~2-256kb", "360×800px~2", "414×896px~1", "500x500", "50x1000"];
// onclick="(async () => { await loadExe2Fn(24, [afterimagesetcallrun, imgObjDimensRqd], [1]); })();"
// window.afterimagesetcallrun = function (obj_imgssss) {do watwaer...}
(function () {
 'use strict';

 console.log('ad_img.js initializing...');

 // Legacy fallback limits (used only when no dimension specs are given)
 const DISP_MAX_WIDTH = 1080;
 const DISP_MAX_SIZE = 512;
 const THMP_MAX_WIDTH = 300;
 const THMP_MAX_SIZE = 32;

 // Format file size
 function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
 }


 // Get image processing limits from global config
 const getImageLimits = function () {
  const config = window[my1uzr.worknOnPg] || {};
  return {
   prodDispMaxWidth: config.prodDispMaxWidth || 1080,
   prodDispMaxSize: config.prodDispMaxSize || 512,
   prodThmpMaxWidth: config.prodThmpMaxWidth || 300,
   prodThmpMaxSize: config.prodThmpMaxSize || 32
  };
 };

 class ImageProcessor {
  constructor() {
   const limits = getImageLimits();
   this.imgWidthForDisplay = limits.prodDispMaxWidth;
   this.imgWidthForThumbnail = limits.prodThmpMaxWidth;
   this.imgMaxSizeForDisplay = limits.prodDispMaxSize * 1024;
   this.imgMaxSizeForThumbnail = limits.prodThmpMaxSize * 1024;
  }

  async loadImage(url) {
   return new Promise((resolve, reject) => {
    const img = new Image();

    if (url && !url.startsWith('data:') && !url.startsWith('blob:')) {
     img.crossOrigin = 'anonymous';
    }

    const timeoutId = setTimeout(() => {
     reject(new Error('Image loading timeout'));
    }, 30000);

    let corsError = false;

    img.onload = () => {
     clearTimeout(timeoutId);
     resolve(img);
    };

    img.onerror = () => {
     clearTimeout(timeoutId);
     if (!corsError && url && !url.startsWith('data:') && !url.startsWith('blob:')) {
      corsError = true;
      console.warn('CORS failed, trying without crossOrigin for:', url);
      const img2 = new Image();
      img2.onload = () => {
       resolve(img2);
      };
      img2.onerror = () => {
       reject(new Error('Failed to load image. The URL may be invalid or blocked.'));
      };
      img2.src = url + (url.includes('?') ? '&_=' : '?_=') + Date.now();
      return;
     }
     reject(new Error('Failed to load image. The URL may be invalid or blocked by CORS.'));
    };

    if (url.startsWith('blob:') || url.startsWith('data:')) {
     img.src = url;
    } else {
     const cacheBuster = url.includes('?') ? '&_=' + Date.now() : '?_=' + Date.now();
     img.src = url + cacheBuster;
    }
   });
  }

  getImageDetails(img, blob = null) {
   const details = {
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    aspectRatio: ((img.naturalWidth || img.width) / (img.naturalHeight || img.height)).toFixed(2),
    type: 'Unknown',
    size: 'Unknown',
    sizeInBytes: 0
   };
   if (blob) {
    details.size = this.formatFileSize(blob.size);
    details.sizeInBytes = blob.size;
    details.type = blob.type || 'image/png';
   }
   return details;
  }

  formatFileSize(bytes) {
   if (!bytes || bytes === 0) return '0 Bytes';
   const k = 1024;
   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
   const i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  calculateReduction(originalSize, compressedSize) {
   if (!originalSize || originalSize === 0) return 0;
   return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  }

  async compressImage(img, targetWidth, quality = 0.85) {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   const aspectRatio = img.naturalWidth / img.naturalHeight;
   const newWidth = Math.min(targetWidth, img.naturalWidth);
   const newHeight = newWidth / aspectRatio;
   canvas.width = newWidth;
   canvas.height = newHeight;
   ctx.imageSmoothingEnabled = true;
   ctx.imageSmoothingQuality = 'high';
   ctx.drawImage(img, 0, 0, newWidth, newHeight);
   return new Promise((resolve) => {
    canvas.toBlob((blob) => {
     resolve({ blob: blob, dataUrl: canvas.toDataURL('image/jpeg', quality), width: newWidth, height: newHeight });
    }, 'image/jpeg', quality);
   });
  }

  async compressImageWithSizeLimit(img, targetWidth, maxSizeBytes, quality = 0.85) {
   let result = await this.compressImage(img, targetWidth, quality);
   let currentQuality = quality;
   while (result.blob.size > maxSizeBytes && currentQuality > 0.1) {
    currentQuality -= 0.05;
    result = await this.compressImage(img, targetWidth, currentQuality);
   }
   return result;
  }

  async processImage(url) {
   try {
    const originalImg = await this.loadImage(url);
    let originalBlob = null;
    try {
     const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache'
     });
     if (response.ok) {
      originalBlob = await response.blob();
     }
    } catch (e) {
     console.warn('Could not fetch image as blob, using canvas fallback:', e);
    }

    if (!originalBlob) {
     try {
      const canvas = document.createElement('canvas');
      canvas.width = originalImg.naturalWidth || originalImg.width || 200;
      canvas.height = originalImg.naturalHeight || originalImg.height || 200;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(originalImg, 0, 0);
      originalBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
     } catch (canvasError) {
      console.warn('Canvas fallback failed:', canvasError);
      try {
       const dataUrl = originalImg.src;
       if (dataUrl && dataUrl.startsWith('data:')) {
        const response = await fetch(dataUrl);
        originalBlob = await response.blob();
       }
      } catch (finalError) {
       console.warn('Final fallback failed:', finalError);
      }
     }
    }

    if (!originalBlob) {
     const canvas = document.createElement('canvas');
     canvas.width = originalImg.naturalWidth || originalImg.width || 200;
     canvas.height = originalImg.naturalHeight || originalImg.height || 200;
     const ctx = canvas.getContext('2d');
     ctx.drawImage(originalImg, 0, 0);
     originalBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
    }

    const originalDetails = this.getImageDetails(originalImg, originalBlob);

    const displayResult = await this.compressImageWithSizeLimit(
     originalImg,
     this.imgWidthForDisplay,
     this.imgMaxSizeForDisplay,
     0.9
    );

    const thumbnailResult = await this.compressImageWithSizeLimit(
     originalImg,
     this.imgWidthForThumbnail,
     this.imgMaxSizeForThumbnail,
     0.8
    );

    return {
     original: { img: originalImg, blob: originalBlob, details: originalDetails, dataUrl: url },
     display: {
      img: displayResult,
      details: {
       width: displayResult.width, height: displayResult.height,
       aspectRatio: (displayResult.width / displayResult.height).toFixed(2),
       size: this.formatFileSize(displayResult.blob.size),
       sizeInBytes: displayResult.blob.size, type: 'image/jpeg',
       reduction: this.calculateReduction(originalDetails.sizeInBytes, displayResult.blob.size)
      },
      dataUrl: displayResult.dataUrl, blob: displayResult.blob
     },
     thumbnail: {
      img: thumbnailResult,
      details: {
       width: thumbnailResult.width, height: thumbnailResult.height,
       aspectRatio: (thumbnailResult.width / thumbnailResult.height).toFixed(2),
       size: this.formatFileSize(thumbnailResult.blob.size),
       sizeInBytes: thumbnailResult.blob.size, type: 'image/jpeg',
       reduction: this.calculateReduction(originalDetails.sizeInBytes, thumbnailResult.blob.size)
      },
      dataUrl: thumbnailResult.dataUrl, blob: thumbnailResult.blob
     }
    };
   } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
   }
  }
 }

 const imageProcessor = new ImageProcessor();

 // Compress and resize image
 function compressAndResizeImage(dataUrl, maxWidth, maxSizeKB, quality = 0.85) {
  return new Promise((resolve, reject) => {
   const img = new Image();
   img.onload = function () {
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
     height = Math.round((height * maxWidth) / width);
     width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    let resultQuality = quality;
    let result = canvas.toDataURL('image/jpeg', resultQuality);

    while (result.length > maxSizeKB * 1024 && resultQuality > 0.1) {
     resultQuality -= 0.1;
     result = canvas.toDataURL('image/jpeg', resultQuality);
    }

    resolve({ dataUrl: result, width: width, height: height, size: result.length });
   };
   img.onerror = function () {
    reject(new Error('Failed to load image for processing'));
   };
   img.src = dataUrl;
  });
 }

 // Parse a dimension spec like "1920x1080px~1-512kb" (side 1 = width required, side 2 = height required, no ~ = both exact, optional -<size>kb cap)
 function parseDimSpec(spec) {
  const m = String(spec || '').match(/^(\d+)\s*[x×]\s*(\d+)(?:\s*px)?(?:\s*~\s*([12]))?(?:-(\d+)\s*kb)?$/i);
  if (!m) return null;
  return { w: parseInt(m[1], 10), h: parseInt(m[2], 10), side: m[3] ? parseInt(m[3], 10) : 0, sizeKB: m[4] ? parseInt(m[4], 10) : 0 };
 }

 // Convert image into an exact WxH frame (cover crop), optionally honoring an interactive crop state {z, cx, cy}
 function convertToSpec(dataUrl, spec, maxSizeKB, crop) {
  return new Promise((resolve, reject) => {
   const img = new Image();
   img.onload = function () {
    const cw = spec.w, ch = spec.h;
    const iw = img.width, ih = img.height;
    const baseScale = Math.max(cw / iw, ch / ih);
    const z = crop && isFinite(crop.z) && crop.z > 0 ? crop.z : 1;
    const effScale = baseScale * z;
    const sw = Math.min(iw, cw / effScale);
    const sh = Math.min(ih, ch / effScale);
    const cx = crop && isFinite(crop.cx) ? crop.cx : iw / 2;
    const cy = crop && isFinite(crop.cy) ? crop.cy : ih / 2;
    const sx = cx - sw / 2;
    const sy = cy - sh / 2;
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    const srcX0 = Math.max(0, sx);
    const srcY0 = Math.max(0, sy);
    const srcX1 = Math.min(iw, sx + sw);
    const srcY1 = Math.min(ih, sy + sh);
    const srcW = srcX1 - srcX0;
    const srcH = srcY1 - srcY0;
    if (srcW > 0 && srcH > 0) {
     ctx.drawImage(img, srcX0, srcY0, srcW, srcH, (srcX0 - sx) / sw * cw, (srcY0 - sy) / sh * ch, srcW / sw * cw, srcH / sh * ch);
    }

    let quality = 0.85;
    let result = canvas.toDataURL('image/jpeg', quality);
    while (maxSizeKB > 0 && result.length > maxSizeKB * 1024 && quality > 0.1) {
     quality -= 0.1;
     result = canvas.toDataURL('image/jpeg', quality);
    }
    resolve({ dataUrl: result, width: cw, height: ch, size: result.length });
   };
   img.onerror = function () {
    reject(new Error('Failed to load image for conversion'));
   };
   img.src = dataUrl;
  });
 }

 // Handle image URL input (used internally after file selection)
 window.handleImageUrlInput = async function (url, prefix) {
  if (!url) return;

  window._adImgLoadSeq = (window._adImgLoadSeq || 0) + 1;
  const mySeq = window._adImgLoadSeq;

  const pfx = prefix || 'up';
  const dims = Array.isArray(window._imgObjDimensRqd) ? window._imgObjDimensRqd : [];
  const total = dims.length ? 1 + dims.length : 3;

  try {
   // Show processing indicators
   for (let i = 1; i <= total; i++) {
    const previewEl = document.getElementById(pfx + 'CataPopImagePreviewContent' + i);
    if (previewEl) {
     previewEl.innerHTML = '<div class="text-center text-muted py-2"><div class="spinner-border spinner-border-sm text-primary mb-1"></div><p class="mb-0 small">Processing...</p></div>';
    }
   }

   // Load image
   const img = new Image();
   img.crossOrigin = 'anonymous';

   await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
   });
   if (window._adImgLoadSeq !== mySeq) return;

   // Original
   const origCanvas = document.createElement('canvas');
   origCanvas.width = img.width;
   origCanvas.height = img.height;
   const origCtx = origCanvas.getContext('2d');
   origCtx.drawImage(img, 0, 0);
   const originalDataUrl = origCanvas.toDataURL('image/jpeg', 0.9);
   const origSize = originalDataUrl.length;

   window._adOrigImg = img;
   window._adOrigDataUrl = originalDataUrl;
   window._adCropStates = {};

   const origPreview = document.getElementById(pfx + 'CataPopImagePreviewContent1');
   const origInfo = document.getElementById(pfx + 'CataPopImagePreviewInfo1');
   if (origPreview) {
    origPreview.innerHTML = `<img src="${originalDataUrl}" class="rounded" style="max-width:100%;max-height:140px;object-fit:contain;">`;
   }
   if (origInfo) {
    origInfo.textContent = `${img.width}×${img.height}px · ${formatSize(origSize)}`;
   }

   if (dims.length) {
    // Convert to each required dimension
    for (let j = 0; j < dims.length; j++) {
     if (window._adImgLoadSeq !== mySeq) return;
     const spec = parseDimSpec(dims[j]);
     if (!spec) continue;
     const result = await convertToSpec(originalDataUrl, spec, spec.sizeKB || 0);
     const idx = j + 2;
     const pv = document.getElementById(pfx + 'CataPopImagePreviewContent' + idx);
     const pi = document.getElementById(pfx + 'CataPopImagePreviewInfo' + idx);
     if (pv) {
      pv.innerHTML = `<div class="text-center"><img src="${result.dataUrl}" class="rounded" style="max-width:100%;max-height:140px;object-fit:contain;" title="Click to zoom / reposition"></div>`;
      pv.style.cursor = 'pointer';
      pv.onclick = function () { window.openCropEditor(idx); };
     }
     if (pi) {
      pi.textContent = `${result.width}×${result.height}px · ${formatSize(result.size)}`;
     }
     const gInput = document.getElementById(pfx + 'CataPopG' + (j + 1) + 'Input');
     if (gInput) gInput.value = result.dataUrl;
    }
   } else {
    // Display size
    if (window._adImgLoadSeq !== mySeq) return;
    const displayResult = await compressAndResizeImage(originalDataUrl, DISP_MAX_WIDTH, DISP_MAX_SIZE, 0.85);
    const dispPreview = document.getElementById(pfx + 'CataPopImagePreviewContent2');
    const dispInfo = document.getElementById(pfx + 'CataPopImagePreviewInfo2');
    if (dispPreview) {
     dispPreview.innerHTML = `<img src="${displayResult.dataUrl}" class="rounded" style="max-width:100%;max-height:140px;object-fit:contain;">`;
    }
    if (dispInfo) {
     dispInfo.textContent = `${displayResult.width}×${displayResult.height}px · ${formatSize(displayResult.size)}`;
    }

    // Thumbnail
    const thumbResult = await compressAndResizeImage(originalDataUrl, THMP_MAX_WIDTH, THMP_MAX_SIZE, 0.7);
    const thumbPreview = document.getElementById(pfx + 'CataPopImagePreviewContent3');
    const thumbInfo = document.getElementById(pfx + 'CataPopImagePreviewInfo3');
    if (thumbPreview) {
     thumbPreview.innerHTML = `<img src="${thumbResult.dataUrl}" class="rounded" style="max-width:100%;max-height:140px;object-fit:contain;">`;
    }
    if (thumbInfo) {
     thumbInfo.textContent = `${thumbResult.width}×${thumbResult.height}px · ${formatSize(thumbResult.size)}`;
    }

    // Store processed images (backward compat g1/g2)
    const g1Input = document.getElementById(pfx + 'CataPopG1Input');
    const g2Input = document.getElementById(pfx + 'CataPopG2Input');
    if (g1Input) g1Input.value = displayResult.dataUrl;
    if (g2Input) g2Input.value = thumbResult.dataUrl;
   }

   // Store original
   const finalUrlInput = document.getElementById(pfx + 'CataPopFinalImageUrl');
   if (finalUrlInput) finalUrlInput.value = originalDataUrl;

   // Enable save button
   const saveBtn = document.getElementById('saveImageBtn');
   if (saveBtn) saveBtn.disabled = false;

   // Show file info
   const fileInfo = document.getElementById('upFileInfo');
   const uploadZone = document.getElementById('upUploadZone');
   if (fileInfo && uploadZone) {
    fileInfo.style.display = 'block';
    uploadZone.style.display = 'none';
    document.getElementById('upFileName').textContent = 'Image loaded';
    document.getElementById('upFileSize').textContent = `${img.width}×${img.height}px · ${formatSize(origSize)}`;
   }

   if (window._adImgLoadSeq !== mySeq) return;
   window._upProdImageFailed = false;

  } catch (error) {
   console.error('Image processing error:', error);
   window._upProdImageFailed = true;
   if (window._adImgLoadSeq !== mySeq) return;

   const saveBtn = document.getElementById('saveImageBtn');
   if (saveBtn) saveBtn.disabled = true;

   const fileInfo = document.getElementById('upFileInfo');
   const uploadZone = document.getElementById('upUploadZone');
   if (fileInfo && uploadZone) {
    fileInfo.style.display = 'none';
    uploadZone.style.display = 'block';
   }

   let host = '';
   try { host = new URL(url).hostname; } catch (e) { host = ''; }
   const msg = host ? host + " doesn't allow using this URL" : 'Failed';

   for (let i = 1; i <= total; i++) {
    const previewEl = document.getElementById(pfx + 'CataPopImagePreviewContent' + i);
    if (previewEl) {
     previewEl.innerHTML = '<div class="text-center text-danger py-2"><i class="fas fa-exclamation-circle fa-2x mb-1 d-block"></i><span class="small">' + msg + '</span></div>';
    }
   }
  }
 };

 // Handle file upload
 window.handleFileUpload = async function (fileInput, prefix) {
  const file = fileInput.files[0];
  if (!file) return;

  const pfx = prefix || 'up';

  if (!file.type.match('image.*')) {
   alert('Please select an image file');
   return;
  }

  if (file.size > 10 * 1024 * 1024) {
   alert('Image size should be less than 10MB');
   return;
  }

  // Show file info immediately
  document.getElementById('upFileInfo').style.display = 'block';
  document.getElementById('upUploadZone').style.display = 'none';
  document.getElementById('upFileName').textContent = file.name;
  document.getElementById('upFileSize').textContent = formatSize(file.size);

  const reader = new FileReader();
  reader.onload = async function (e) {
   await window.handleImageUrlInput(e.target.result, pfx);
  };
  reader.readAsDataURL(file);
 };

 // Handle URL input in the modal (like ed_prod.js)
 window.upImgUrlInput = function (el) {
  const v = (el.value || '').trim();
  if (!v || v.startsWith('data:')) return;

  const fi = document.getElementById('upCataPopFileInput');
  if (fi) fi.value = '';
  const ui = document.getElementById('upFileInfo');
  if (ui) ui.style.display = 'none';
  const uz = document.getElementById('upUploadZone');
  if (uz) uz.style.display = 'block';

  window.handleImageUrlInput(v, 'up');
 };

 // Open inline crop/zoom editor for a specific preview (exact fixed WxH frame)
 window.openCropEditor = function (idx) {
  const dims = Array.isArray(window._imgObjDimensRqd) ? window._imgObjDimensRqd : [];
  const spec = parseDimSpec(dims[idx - 2]);
  const img = window._adOrigImg;
  const pv = document.getElementById('upCataPopImagePreviewContent' + idx);
  if (!spec || !img || !pv) return;
  pv.onclick = null;

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const cw = spec.w, ch = spec.h;
  const baseScale = Math.max(cw / iw, ch / ih);
  const zMin = 1;

  if (!window._adCropStates) window._adCropStates = {};
  let st = window._adCropStates[idx];
  if (!st) {
   st = { z: zMin, cx: iw / 2, cy: ih / 2 };
   window._adCropStates[idx] = st;
  }

  const prevHTML = pv.innerHTML;
  const cardBody = pv.closest('.card-body');
  const prevBodyCss = cardBody ? cardBody.style.cssText : '';

  pv.innerHTML = `
            <div class="crop-editor w-100" data-crop-idx="${idx}">
                <div class="crop-frame" style="margin:0 auto;border:2px solid #6c757d;border-radius:6px;overflow:hidden;background:#fff;touch-action:none;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                    <canvas id="cropCanvas_${idx}" style="display:block;cursor:grab;touch-action:none;"></canvas>
                </div>
                <div class="d-flex flex-wrap justify-content-center gap-1 mt-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary crop-zoom-out" title="Zoom out"><i class="fas fa-minus"></i></button>
                    <button type="button" class="btn btn-sm btn-outline-secondary crop-reset" title="Reset"><i class="fas fa-undo"></i></button>
                    <button type="button" class="btn btn-sm btn-outline-secondary crop-zoom-in" title="Zoom in"><i class="fas fa-plus"></i></button>
                    <button type="button" class="btn btn-sm btn-outline-primary crop-cancel">Cancel</button>
                    <button type="button" class="btn btn-sm btn-primary crop-apply"><i class="fas fa-check me-1"></i>Apply</button>
                </div>
                <small class="d-block text-muted mt-1" style="font-size:0.7rem;">Drag or arrow keys to move · Scroll / +/- to zoom</small>
            </div>`;

  if (cardBody) {
   cardBody.style.maxHeight = 'none';
   cardBody.style.overflowY = 'auto';
  }

  const editor = pv.querySelector('.crop-editor');
  const frame = pv.querySelector('.crop-frame');
  const canvas = pv.querySelector('#cropCanvas_' + idx);
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  // Fit the frame inside the card without overlapping borders
  function layoutFrame() {
   const maxW = Math.max(80, Math.min(360, (cardBody ? cardBody.clientWidth : 360) - 12));
   const maxH = 200;
   const ratio = ch / cw;
   let dw = maxW;
   let dh = Math.round(dw * ratio);
   if (dh > maxH) { dh = maxH; dw = Math.round(dh / ratio); }
   frame.style.width = dw + 'px';
   frame.style.height = dh + 'px';
   canvas.style.width = '100%';
   canvas.style.height = '100%';
  }
  layoutFrame();

  function draw() {
   const effScale = baseScale * st.z;
   st.cx = Math.max(0, Math.min(iw, st.cx));
   st.cy = Math.max(0, Math.min(ih, st.cy));

   ctx.clearRect(0, 0, cw, ch);
   ctx.fillStyle = '#ffffff';
   ctx.fillRect(0, 0, cw, ch);

   const iwPx = iw * effScale;
   const ihPx = ih * effScale;
   ctx.drawImage(img, cw / 2 - st.cx * effScale, ch / 2 - st.cy * effScale, iwPx, ihPx);
  }

  // Nudge the image with arrow keys
  function onKey(e) {
   if (!e.key.startsWith('Arrow')) return;
   e.preventDefault();
   const effScale = baseScale * st.z;
   const step = 24 / effScale;
   if (e.key === 'ArrowUp') st.cy -= step;
   else if (e.key === 'ArrowDown') st.cy += step;
   else if (e.key === 'ArrowLeft') st.cx -= step;
   else if (e.key === 'ArrowRight') st.cx += step;
   draw();
  }
  document.addEventListener('keydown', onKey);
  window._adCropCleanup = function () {
   document.removeEventListener('keydown', onKey);
   if (cardBody) cardBody.style.cssText = prevBodyCss;
  };

  function restorePreview(html) {
   document.removeEventListener('keydown', onKey);
   pv.innerHTML = html;
   pv.style.cursor = 'pointer';
   pv.onclick = function () { window.openCropEditor(idx); };
   if (cardBody) cardBody.style.cssText = prevBodyCss;
   window._adCropCleanup = null;
  }

  // Pan by dragging anywhere on the frame (mouse + touch)
  let dragging = false, lastX = 0, lastY = 0;
  frame.addEventListener('pointerdown', function (e) {
   dragging = true;
   lastX = e.clientX; lastY = e.clientY;
   frame.setPointerCapture(e.pointerId);
   e.preventDefault();
  });
  frame.addEventListener('pointermove', function (e) {
   if (!dragging) return;
   const rect = frame.getBoundingClientRect();
   const pxScale = canvas.width / rect.width;
   const effScale = baseScale * st.z;
   st.cx -= (e.clientX - lastX) * pxScale / effScale;
   st.cy -= (e.clientY - lastY) * pxScale / effScale;
   lastX = e.clientX; lastY = e.clientY;
   draw();
  });
  frame.addEventListener('pointerup', function () { dragging = false; });
  frame.addEventListener('pointercancel', function () { dragging = false; });

  // Zoom with mouse wheel (keep the point under the cursor stable)
  frame.addEventListener('wheel', function (e) {
   e.preventDefault();
   const rect = frame.getBoundingClientRect();
   const px = (e.clientX - rect.left) / rect.width * cw;
   const py = (e.clientY - rect.top) / rect.height * ch;
   const effScale = baseScale * st.z;
   const sx = st.cx + (px - cw / 2) / effScale;
   const sy = st.cy + (py - ch / 2) / effScale;
   st.z = Math.max(zMin, Math.min(8, st.z * (e.deltaY < 0 ? 1.15 : 0.87)));
   const effScale2 = baseScale * st.z;
   st.cx = sx - (px - cw / 2) / effScale2;
   st.cy = sy - (py - ch / 2) / effScale2;
   draw();
  }, { passive: false });

  editor.querySelector('.crop-zoom-in').addEventListener('click', function () {
   st.z = Math.min(8, st.z * 1.2); draw();
  });
  editor.querySelector('.crop-zoom-out').addEventListener('click', function () {
   st.z = Math.max(zMin, st.z / 1.2); draw();
  });
  editor.querySelector('.crop-reset').addEventListener('click', function () {
   st.z = zMin; st.cx = iw / 2; st.cy = ih / 2; draw();
  });
  editor.querySelector('.crop-cancel').addEventListener('click', function () {
   delete window._adCropStates[idx];
   restorePreview(prevHTML);
  });
  editor.querySelector('.crop-apply').addEventListener('click', function () {
   const btn = editor.querySelector('.crop-apply');
   btn.disabled = true;
   btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Applying...';
   const outCrop = { z: Math.max(st.z, 1), cx: st.cx, cy: st.cy };
   convertToSpec(window._adOrigDataUrl, spec, spec.sizeKB || 0, outCrop).then(function (result) {
    window._adCropStates[idx] = outCrop;
    const gInput = document.getElementById('upCataPopG' + (idx - 1) + 'Input');
    if (gInput) gInput.value = result.dataUrl;
    const pi = document.getElementById('upCataPopImagePreviewInfo' + idx);
    if (pi) pi.textContent = result.width + '×' + result.height + 'px · ' + formatSize(result.size);
    restorePreview(`<div class="text-center"><img src="${result.dataUrl}" class="rounded" style="max-width:100%;max-height:140px;object-fit:contain;" title="Click to zoom / reposition"></div>`);
   }).catch(function (err) {
    console.error('Crop apply error:', err);
    alert('Failed to apply crop');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check me-1"></i>Apply';
   });
  });

  draw();
 };

 // Open add image modal
 window.open_addimage = function (arg, arg2) {
  console.log('open_addimage called');

  window._afterImageSet = typeof arg === 'function' ? arg : null;
  window._imgObjDimensRqd = Array.isArray(arg2) ? arg2.slice() : null;

  // Remove existing modal if any
  const existingModal = document.getElementById('addImageModal');
  if (existingModal) {
   existingModal.remove();
  }

  const existingImgUrl = document.getElementById('dpLinkHidden')?.value || '';

  const dims = Array.isArray(window._imgObjDimensRqd) ? window._imgObjDimensRqd : [];
  const previewCount = dims.length ? 1 + dims.length : 3;

  let hiddenInputsHTML = '<input type="hidden" id="upCataPopFinalImageUrl" value="' + existingImgUrl + '">';
  for (let j = 1; j < previewCount; j++) {
   hiddenInputsHTML += '<input type="hidden" id="upCataPopG' + j + 'Input" value="">';
  }

  function defaultInfoText(i) {
   if (i === 1) return '-';
   if (dims.length) {
    const spec = parseDimSpec(dims[i - 2]);
    return spec ? spec.w + '×' + spec.h + 'px' + (spec.sizeKB ? ' · max ' + spec.sizeKB + 'KB' : '') : (dims[i - 2] || '');
   }
   return i === 2 ? 'max ' + DISP_MAX_WIDTH + 'px' : 'max ' + THMP_MAX_WIDTH + 'px';
  }

  let previewsHTML = '';
  for (let i = 1; i <= previewCount; i++) {
   let title, icon, color, infoText;
   if (i === 1) {
    title = 'Original';
    icon = 'fa-image';
    color = 'text-primary';
    infoText = '-';
   } else if (dims.length) {
    const spec = parseDimSpec(dims[i - 2]);
    title = spec ? spec.w + '×' + spec.h + 'px' + (spec.sizeKB ? ' · max ' + spec.sizeKB + 'KB' : '') : (dims[i - 2] || '');
    icon = 'fa-image';
    color = 'text-primary';
    infoText = title;
   } else {
    if (i === 2) {
     title = 'Display';
     icon = 'fa-desktop';
     color = 'text-success';
     infoText = 'max ' + DISP_MAX_WIDTH + 'px';
    } else {
     title = 'Thumbnail';
     icon = 'fa-th';
     color = 'text-warning';
     infoText = 'max ' + THMP_MAX_WIDTH + 'px';
    }
   }
   previewsHTML += `
                            <div class="col-12 border border-dark">
                                <div class="card border rounded-3">
                                    <div class="card-header bg-light py-2 px-3 d-flex align-items-center justify-content-between">
                                        <span class="fw-bold small"><i class="fas ${icon} me-1 ${color}"></i> ${title}</span> ${i !== 1 ? '<span>Click for Drag/Crop</span>' : ''}
                                    </div>
                                    <div class="card-body p-2 text-center" style="min-height:120px;max-height:200px;overflow:hidden;background:#fafafa;">
                                        <div id="upCataPopImagePreviewContent${i}" class="d-flex align-items-center justify-content-center h-100">
                                            <div class="text-muted small"><i class="fas ${icon} fa-2x mb-1 d-block" style="opacity:0.3"></i><span>No image</span></div>
                                        </div>
                                    </div>
                                    <span id="upCataPopImagePreviewInfo${i}" class="text-muted" style="font-size:0.75rem;">${infoText}</span>
                                </div>
                            </div>`;
  }

  // Create modal HTML
  const modalHTML = `
        <div class="modal fade" id="addImageModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content shadow-lg border-0 rounded-4">
                    <div class="modal-header border-bottom bg-light rounded-top-4 px-4 py-3">
                        <h5 class="modal-title fw-bold"><i class="fas fa-camera me-2 text-primary"></i>Add Profile Photo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body px-4 py-4">
                        <div class="mb-3">
                            <ul class="nav nav-pills mb-2" id="upInputTabs" role="tablist" style="font-size: 12px;">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="upUrlTab" data-bs-toggle="pill" data-bs-target="#upUrlPane" type="button" role="tab">
                                        <i class="fas fa-link me-1"></i>Image URL
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="upUploadTab" data-bs-toggle="pill" data-bs-target="#upUploadPane" type="button" role="tab">
                                        <i class="fas fa-cloud-upload-alt me-1"></i>Upload File
                                    </button>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane fade show active" id="upUrlPane" role="tabpanel">
                                    <input type="url" name="h" id="upCataPopImageUrlInput"
                                           class="form-control form-control-sm border border-dark"
                                           value="${existingImgUrl}" placeholder="https://example.com/image.jpg"
                                           oninput="if(this.value && !this.value.startsWith('data:')) { upImgUrlInput(this); }">
                                </div>
                                <div class="tab-pane fade border border-dark" id="upUploadPane" role="tabpanel">
                                    <input type="file" id="upCataPopFileInput" accept="image/*" style="display: none;" onchange="window.handleFileUpload(this, 'up')">
                                    <div class="border rounded p-3 text-center bg-light upload-zone" style="border-style: dashed !important;">
                                        <div id="upUploadZone" style="cursor: pointer;">
                                            <button type="button" class="btn btn-outline-primary" id="upBrowseBtn">
                                                <i class="fas fa-folder-open me-2"></i>Browse Files
                                            </button>
                                            <p class="text-muted small mt-1 mb-0">or drag & drop image here</p>
                                        </div>
                                        <div id="upFileInfo" style="display: none;">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center gap-2">
                                                    <i class="fas fa-file-image text-primary me-2" style="font-size: 24px;"></i>
                                                    <div class="text-start">
                                                        <span id="upFileName" class="fw-bold small"></span><br>
                                                        <span id="upFileSize" class="text-muted" style="font-size: 11px;"></span>
                                                    </div>
                                                </div>
                                                <button type="button" class="btn btn-sm btn-outline-danger" id="upRemoveFileBtn"><i class="fas fa-times"></i></button>
                                            </div>
                                            <button type="button" class="btn btn-outline-primary btn-sm w-100 mt-2" id="upChangeBtn">
                                                <i class="fas fa-exchange-alt me-1"></i> Change Image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Hidden fields -->
                        ${hiddenInputsHTML}
                        
                        <!-- Previews -->
                        <div class="row g-3 mt-2">
                            ${previewsHTML}
                        </div>
                    </div>
                    <div class="modal-footer border-top bg-light rounded-bottom-4 px-4 py-3">
                        <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success rounded-pill px-4" id="saveImageBtn" onclick="saveProfileImage()" disabled>
                            <i class="fas fa-check me-1"></i> Use This Image
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

  // Add custom styles if not already present
  if (!document.getElementById('adImgCustomStyles')) {
   const styleEl = document.createElement('style');
   styleEl.id = 'adImgCustomStyles';
   styleEl.textContent = `
                .border-dashed { border-style: dashed !important; }
                #upUploadZone:hover { border-color: #0d6efd !important; background-color: #f0f7ff !important; }
                #upUploadZone { transition: all 0.2s ease; }
                #upInputTabs .nav-link:not(.active) { color: #000 !important; }
                #upInputTabs .nav-link:not(.active) i { color: #000 !important; }
            `;
   document.head.appendChild(styleEl);
  }

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Initialize and show modal
  const modalElement = document.getElementById('addImageModal');
  const modal = new bootstrap.Modal(modalElement, {
   backdrop: 'static',
   keyboard: false
  });
  modal.show();

  modalElement.style.zIndex = '1080';

  setTimeout(() => {
   const md = modalElement.querySelector('.modal-dialog');
   if (md) {
    md.style.marginTop = '30px';
    md.style.maxWidth = '700px';
   }
   const mc = modalElement.querySelector('.modal-content');
   if (mc) {
    mc.style.borderRadius = '8px';
    mc.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
    mc.style.border = '1px solid black';
   }
   const mb = modalElement.querySelector('.modal-body');
   if (mb) {
    mb.style.maxHeight = '65vh';
    mb.style.overflowY = 'auto';
    mb.style.padding = '15px 20px';
   }
  }, 50);

  // Setup handlers after modal is shown
  modalElement.addEventListener('shown.bs.modal', function () {
   const fileInput = document.getElementById('upCataPopFileInput');
   const uploadZone = document.getElementById('upUploadZone');
   const changeBtn = document.getElementById('upChangeBtn');
   const removeBtn = document.getElementById('upRemoveFileBtn');

   // Click upload zone to trigger file input
   if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
   }

   // Change button
   if (changeBtn && fileInput) {
    changeBtn.addEventListener('click', (e) => {
     e.preventDefault();
     fileInput.click();
    });
   }

   // Remove button
   if (removeBtn && fileInput) {
    removeBtn.addEventListener('click', (e) => {
     e.preventDefault();
     fileInput.value = '';
     window._adOrigImg = null;
     window._adCropStates = {};
     document.getElementById('upFileInfo').style.display = 'none';
     document.getElementById('upUploadZone').style.display = 'block';
     document.getElementById('saveImageBtn').disabled = true;

     // Clear previews
     for (let i = 1; i <= previewCount; i++) {
      const previewEl = document.getElementById('upCataPopImagePreviewContent' + i);
      const infoEl = document.getElementById('upCataPopImagePreviewInfo' + i);
      if (previewEl) {
       previewEl.innerHTML = '<div class="text-muted small"><i class="fas fa-image fa-2x mb-1 d-block" style="opacity:0.3"></i><span>No image</span></div>';
      }
      if (infoEl) {
       infoEl.textContent = defaultInfoText(i);
      }
     }
    });
   }

   // Drag and drop
   if (uploadZone && fileInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt =>
     uploadZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); })
    );
    uploadZone.addEventListener('drop', function (e) {
     const files = e.dataTransfer.files;
     if (files.length > 0 && files[0].type.startsWith('image/')) {
      const dt = new DataTransfer(); dt.items.add(files[0]);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
     }
    });
   }

   // File input change
   if (fileInput) {
    fileInput.addEventListener('change', function () {
     if (this.files && this.files.length > 0) {
      window.handleFileUpload(this, 'up');
     }
    });
   }

   // Process existing image if present
   if (existingImgUrl && existingImgUrl !== '') {
    setTimeout(() => {
     window.handleImageUrlInput(existingImgUrl, 'up');
    }, 300);
   }
  });

  // Clean up on modal hide
  modalElement.addEventListener('hidden.bs.modal', function () {
   if (typeof window._adCropCleanup === 'function') {
    window._adCropCleanup();
    window._adCropCleanup = null;
   }
   modal.dispose();
   modalElement.remove();
  });
 };

 // Save profile image
 window.saveProfileImage = function () {
  const finalImageUrl = document.getElementById('upCataPopFinalImageUrl')?.value || '';

  const gValues = [];
  let gi = 1;
  while (document.getElementById('upCataPopG' + gi + 'Input')) {
   gValues.push(document.getElementById('upCataPopG' + gi + 'Input').value || '');
   gi++;
  }

  const imgObj = { "url": finalImageUrl };
  gValues.forEach(function (v, i) {
   imgObj['g' + (i + 1)] = v;
  });

  if (!finalImageUrl && !gValues.some(function (v) { return v; })) {
   alert('Please add an image first');
   return;
  }

  // Store in hidden fields on main form
  const dpLinkHidden = document.getElementById('dpLinkHidden');
  if (dpLinkHidden) {
   dpLinkHidden.value = finalImageUrl || gValues[0] || gValues[1] || '';
  }

  const dpG1Hidden = document.getElementById('dpG1Hidden');
  const dpG2Hidden = document.getElementById('dpG2Hidden');
  if (dpG1Hidden) dpG1Hidden.value = gValues[0] || '';
  if (dpG2Hidden) dpG2Hidden.value = gValues[1] || '';

  // Show preview on main form
  const previewContainer = document.getElementById('dpPreviewContainer');
  const previewThumb = document.getElementById('dpPreviewThumb');
  if (previewContainer && previewThumb && (gValues[1] || finalImageUrl)) {
   previewThumb.src = gValues[1] || finalImageUrl;
   previewContainer.style.display = 'block';
  }

  // Hide add button
  const btn = document.querySelector('.section-card .btn-outline-secondary');
  if (btn) {
   btn.style.display = 'none';
  }

  if (typeof window._afterImageSet === 'function') {
   window._afterImageSet(imgObj);
  }

  // Close modal
  const modalElement = document.getElementById('addImageModal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
   modal.hide();
  }

  // const logObj = { url: String(finalImageUrl).substring(0, 50) + '...' };
  // gValues.forEach(function (v, i) {
  //     logObj['g' + (i + 1)] = String(v || '').substring(0, 50) + (v ? '...' : '');
  // });
  // console.log('Image saved:', logObj);
 };

 window.removeProfileImage = function () {
  const dpLinkHidden = document.getElementById('dpLinkHidden');
  const dpG1Hidden = document.getElementById('dpG1Hidden');
  const dpG2Hidden = document.getElementById('dpG2Hidden');
  if (dpLinkHidden) dpLinkHidden.value = '';
  if (dpG1Hidden) dpG1Hidden.value = '';
  if (dpG2Hidden) dpG2Hidden.value = '';

  const previewContainer = document.getElementById('dpPreviewContainer');
  if (previewContainer) previewContainer.style.display = 'none';

  const btn = document.querySelector('.section-card .btn-outline-secondary');
  if (btn) btn.style.display = '';

  console.log('Profile image removed');
 };

 console.log('ad_img.js loaded successfully');

})();