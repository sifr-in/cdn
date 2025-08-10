// drive.js - Google Drive Uploader with enhanced preview functionality

// Global variables
let googleAuth;
let googleTokenClient;
let isGoogleApiLoaded = false;
let pendingUploads = [];
let authInProgress = false;
let authContainer = null;

// Initialize Google APIs
function handleClientLoad() {
    gapi.load('client', initializeGapiClient);
}

// Initialize Google API client
async function initializeGapiClient() {
    try {
        await gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        isGoogleApiLoaded = true;
        processPendingUploads();
    } catch (error) {
        console.error('Error initializing Google API client:', error);
        customAlert('Failed to initialize Google API: ' + error.message);
    }
}

// Initialize Google Auth
function initGoogleAuth() {
    googleAuth = google.accounts.oauth2.initTokenClient({
        client_id: '182768883887-ncmtqihir0d65hveg0rvser6m5lkaomo.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
            googleTokenClient = tokenResponse;
            authInProgress = false;
            removeAuthContainer();
            processPendingUploads();
        },
        error_callback: (error) => {
            console.error('Google Auth error:', error);
            hideLoader();
            authInProgress = false;
            removeAuthContainer();
            if (error.error === 'popup_closed_by_user') {
                customAlert('Please complete the Google sign-in to upload files.');
            } else {
                customAlert('Google sign-in failed: ' + error.error);
            }
        }
    });
}

// Remove auth container if exists
function removeAuthContainer() {
    if (authContainer && document.body.contains(authContainer)) {
        document.body.removeChild(authContainer);
        authContainer = null;
    }
}

// Process pending uploads
function processPendingUploads() {
    if (isGoogleApiLoaded && googleTokenClient) {
        while (pendingUploads.length) {
            const { files, folderId, callback } = pendingUploads.shift();
            uploadFilesToDrive(files, folderId, callback);
        }
    }
}

// Show loader
function showLoader(loaderId) {
    if (loaderId) {
        const loader = document.getElementById(loaderId);
        if (loader) {
            loader.style.display = 'block';
            loader.style.zIndex = '2147483647'; // or '2147483647' for maximum z-index
        }
    }
}

// Hide loader
function hideLoader(loaderId) {
    if (loaderId) {
        const loader = document.getElementById(loaderId);
        if (loader) loader.style.display = 'none';
    }
}

// Custom alert function
function customAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.backgroundColor = '#ff4444';
    alertBox.style.color = 'white';
    alertBox.style.padding = '15px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.zIndex = '10000';
    alertBox.style.maxWidth = '80%';
    alertBox.style.textAlign = 'center';
    alertBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
    alertBox.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 15px';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.color = '#ff4444';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.onclick = () => {
        document.body.removeChild(alertBox);
    };
    
    alertBox.appendChild(document.createElement('br'));
    alertBox.appendChild(closeButton);
    document.body.appendChild(alertBox);
}

// Upload files to Google Drive
async function uploadFilesToDrive(files, folderId, callback) {
    const uploadedUrls = [];
    
    try {
        for (const file of files) {
            const metadata = {
                name: file.name,
                mimeType: file.type || 'application/octet-stream',
                parents: [folderId]
            };
            
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('file', file);
            
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + googleTokenClient.access_token
                }),
                body: formData
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                throw responseData;
            }
            
            try {
                await gapi.client.drive.permissions.create({
                    fileId: responseData.id,
                    resource: {
                        role: 'reader',
                        type: 'anyone'
                    },
                    fields: 'id'
                });
                
                const fileInfo = await gapi.client.drive.files.get({
                    fileId: responseData.id,
                    fields: 'webViewLink'
                });
                
                uploadedUrls.push({
                    name: responseData.name,
                    url: fileInfo.result.webViewLink || `https://drive.google.com/file/d/${responseData.id}/view`,
                    id: responseData.id
                });
            } catch (permissionError) {
                console.warn('Error setting permissions:', permissionError);
                uploadedUrls.push({
                    name: responseData.name,
                    url: `https://drive.google.com/file/d/${responseData.id}/view`,
                    id: responseData.id
                });
            }
        }
        
        callback(null, uploadedUrls);
    } catch (error) {
        console.error('Upload error:', error);
        callback(error, null);
    }
}

// Handle authentication
function handleAuth(loaderId) {
    if (authInProgress) return;
    
    authInProgress = true;
    showLoader(loaderId);
    removeAuthContainer();
    
    // Create auth container
    authContainer = document.createElement('div');
    authContainer.style.position = 'fixed';
    authContainer.style.top = '0';
    authContainer.style.left = '0';
    authContainer.style.width = '100%';
    authContainer.style.height = '100%';
    authContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    authContainer.style.zIndex = '9999';
    authContainer.style.display = 'flex';
    authContainer.style.justifyContent = 'center';
    authContainer.style.alignItems = 'center';
    
    const authBox = document.createElement('div');
    authBox.style.backgroundColor = 'white';
    authBox.style.padding = '20px';
    authBox.style.borderRadius = '8px';
    authBox.style.textAlign = 'center';
    
    const authMessage = document.createElement('p');
    authMessage.textContent = 'Sign in with Google to upload files';
    authBox.appendChild(authMessage);
    
    const authButton = document.createElement('button');
    authButton.textContent = 'Sign In with Google';
    authButton.style.padding = '10px 20px';
    authButton.style.marginTop = '10px';
    authButton.style.cursor = 'pointer';
    
    authButton.onclick = () => {
        googleAuth.requestAccessToken();
    };
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.style.padding = '8px 16px';
    closeButton.style.marginTop = '10px';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.backgroundColor = '#f0f0f0';
    closeButton.style.border = '1px solid #ccc';
    
    closeButton.onclick = () => {
        authInProgress = false;
        hideLoader(loaderId);
        removeAuthContainer();
    };
    
    authBox.appendChild(authButton);
    authBox.appendChild(closeButton);
    authContainer.appendChild(authBox);
    document.body.appendChild(authContainer);
    
    setTimeout(() => {
        if (authInProgress) {
            googleAuth.requestAccessToken();
        }
    }, 100);
}

// Create form group container
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

// Create preview container
function createPreviewContainer() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '20px';
    return container;
}

// Create image info display
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

// Get preview URL for Google Drive file
function getDrivePreviewUrl(url) {
    // First extract the file ID from any Google Drive URL format
    let fileId = '';
    
    // Standard file URL pattern
    const filePattern = /\/file\/d\/([^\/]+)/;
    // Open URL pattern
    const openPattern = /open\?id=([^&]+)/;
    // ID parameter pattern
    const idPattern = /id=([^&]+)/;
    // Direct uc pattern
    const ucPattern = /uc\?export=download&id=([^&]+)/;
    
    if (filePattern.test(url)) {
        fileId = url.match(filePattern)[1];
    } else if (openPattern.test(url)) {
        fileId = url.match(openPattern)[1];
    } else if (idPattern.test(url)) {
        fileId = url.match(idPattern)[1];
    } else if (ucPattern.test(url)) {
        fileId = url.match(ucPattern)[1];
    }
    
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}=s0?authuser=0`;
    }
    
    return url; // fallback to original URL
}

// Create uploaded image preview
function createUploadedImagePreview(url, title, container) {
    const previewContainer = document.createElement('div');
    previewContainer.style.margin = '15px 0';
    
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    titleElement.style.margin = '0 0 10px 0';
    titleElement.style.color = '#333';

    const imgElement = document.createElement('img');
    const previewUrl = getDrivePreviewUrl(url);
    imgElement.src = previewUrl;
    imgElement.style.maxWidth = '100%';
    imgElement.style.maxHeight = '200px';
    imgElement.style.borderRadius = '4px';
    imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    imgElement.onerror = function() {
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
    container.appendChild(previewContainer);
    
    return previewUrl;
}

// Resize image to thumbnail
function resizeImageToThumbnail(originalImage, resize2width) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions maintaining aspect ratio
            const ratio = resize2width / img.width;
            const newWidth = resize2width;
            const newHeight = img.height * ratio;
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            canvas.toBlob((blob) => {
                const thumbnailFile = new File([blob], 'thumb_' + originalImage.name, {
                    type: 'image/webp',
                    lastModified: Date.now()
                });
                
                // Add dimensions to the file object for display
                thumbnailFile.width = newWidth;
                thumbnailFile.height = newHeight;
                
                resolve(thumbnailFile);
            }, 'image/webp', 0.85);
        };
        
        img.src = URL.createObjectURL(originalImage);
    });
}

// Global upload function
window.upld2drv = function(buttonElement, loaderId, driveFolderIdForOriginalFile, urlInputIdOfOriginalFile, PreviewDvIdForOriginalUrl, fileSizeLimitOfOriginal, driveFolderIdForThumbnailFile, urlInputIdOfThumbnailFile, PreviewDvIdForThumbnailUrl, resize2width) {
    // Validate required parameters
    if (!buttonElement || !loaderId || !driveFolderIdForOriginalFile || !urlInputIdOfOriginalFile || !PreviewDvIdForOriginalUrl || fileSizeLimitOfOriginal === undefined) {
        customAlert('Missing required parameters!');
        return;
    }
    
    // Validate thumbnail parameters if thumbnail URL input is provided
    if (urlInputIdOfThumbnailFile && (!driveFolderIdForThumbnailFile || !PreviewDvIdForThumbnailUrl)) {
        customAlert('When providing thumbnail URL input, you must also provide thumbnail folder ID and preview DIV ID!');
        return;
    }
    
    // Set default resize width if not provided
    if (urlInputIdOfThumbnailFile && (resize2width === undefined || resize2width === null)) {
        resize2width = 200; // Default thumbnail width if not specified
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Disable the original button and change its text
    buttonElement.disabled = true;
    const originalText = buttonElement.textContent;
    buttonElement.textContent = originalText + ' disabled';
    
    fileInput.click();
    
    fileInput.addEventListener('change', async () => {
        if (fileInput.files.length === 0) {
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
            document.body.removeChild(fileInput);
            return;
        }
        
        const originalFile = fileInput.files[0];
        
        // Check file size limit
        if (originalFile.size > fileSizeLimitOfOriginal * 1024) {
            customAlert(`File size exceeds the limit of ${fileSizeLimitOfOriginal} KB`);
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
            document.body.removeChild(fileInput);
            return;
        }
        
        const img = new Image();
        img.onload = function() {
            // Add dimensions to the file object for display
            originalFile.width = this.width;
            originalFile.height = this.height;
            
            // Create form group for previews
            const previewFormGroup = createFormGroup();
            previewFormGroup.id = 'upload_preview_group';
            
            // Find the item_gu form group and insert preview group after it
            const itemGuGroup = document.getElementById(urlInputIdOfOriginalFile).closest('.form_group');
            if (itemGuGroup) {
                itemGuGroup.insertAdjacentElement('afterend', previewFormGroup);
            } else {
                // Fallback if item_gu form group not found
                buttonElement.insertAdjacentElement('afterend', previewFormGroup);
            }
            
            // Create preview container
            const previewContainer = createPreviewContainer();
            previewFormGroup.appendChild(previewContainer);
            
            // Show original image info
            createImageInfoDisplay(originalFile, 'Selected Image', previewContainer);
            
            // Check if thumbnail should be created
            const hasThumbnailInput = urlInputIdOfThumbnailFile && urlInputIdOfThumbnailFile.trim() !== '';
            
            if (hasThumbnailInput) {
                // Create and show thumbnail if thumbnail input is provided
                resizeImageToThumbnail(originalFile, resize2width).then((thumbnailFile) => {
                    createImageInfoDisplay(thumbnailFile, 'Thumbnail Image', previewContainer);
                    
                    // Create upload button
                    const uploadButton = document.createElement('button');
                    uploadButton.textContent = 'Upload Files';
                    uploadButton.style.marginTop = '15px';
                    uploadButton.style.padding = '10px 20px';
                    uploadButton.style.backgroundColor = '#4CAF50';
                    uploadButton.style.color = 'white';
                    uploadButton.style.border = 'none';
                    uploadButton.style.borderRadius = '4px';
                    uploadButton.style.cursor = 'pointer';
                    
                    uploadButton.onclick = async () => {
                        uploadButton.disabled = true;
                        showLoader(loaderId);
                        
                        // First upload the original file
                        const originalCallback = (error, originalUrls) => {
                            if (error) {
                                hideLoader(loaderId);
                                customAlert('Original upload failed: ' + (error.message || error.error || 'Unknown error'));
                                uploadButton.disabled = false;
                                return;
                            }
                            
                            const originalUrl = originalUrls[0]; // We only uploaded one file
                            
                            // Now upload the thumbnail
                            const thumbnailCallback = (thumbError, thumbnailUrls) => {
                                hideLoader(loaderId);
                                
                                if (thumbError) {
                                    customAlert('Thumbnail upload failed: ' + (thumbError.message || thumbError.error || 'Unknown error'));
                                    
                                    // Still show the original upload result
                                    showUploadResults(originalUrl, null);
                                    return;
                                }
                                
                                const thumbnailUrl = thumbnailUrls[0];
                                showUploadResults(originalUrl, thumbnailUrl);
                            };
                            
                            if (!googleTokenClient) {
                                pendingUploads.push({ 
                                    files: [thumbnailFile], 
                                    folderId: driveFolderIdForThumbnailFile, 
                                    callback: thumbnailCallback 
                                });
                                handleAuth(loaderId);
                            } else {
                                uploadFilesToDrive([thumbnailFile], driveFolderIdForThumbnailFile, thumbnailCallback);
                            }
                        };
                        
                        if (!googleTokenClient) {
                            pendingUploads.push({ 
                                files: [originalFile], 
                                folderId: driveFolderIdForOriginalFile, 
                                callback: originalCallback 
                            });
                            handleAuth(loaderId);
                        } else {
                            uploadFilesToDrive([originalFile], driveFolderIdForOriginalFile, originalCallback);
                        }
                    };
                    
                    // Function to show upload results
                    function showUploadResults(originalUrl, thumbnailUrl) {
                        // Create form group for results
                        const resultFormGroup = createFormGroup();
                        resultFormGroup.id = 'upload_result_group';
                        previewFormGroup.insertAdjacentElement('afterend', resultFormGroup);
                        
                        // Create result container
                        const resultContainer = document.createElement('div');
                        resultContainer.innerHTML = `
                            <h3 style="margin-top: 0;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Upload Results</h3>
                            <p style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><strong>Original Image:</strong></p>
                            <a href="${originalUrl.url}" target="_blank">${originalUrl.name}</a>
                        `;
                        
                        if (thumbnailUrl) {
                            resultContainer.innerHTML += `<p style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><strong>Thumbnail Image:</strong></p>
                            <a href="${thumbnailUrl.url}" target="_blank">${thumbnailUrl.name}</a>`;
                        }
                        
                        // Add previews of uploaded images
                        const previewsContainer = document.createElement('div');
                        previewsContainer.style.marginTop = '15px';
                        const originalPreviewableUrl = createUploadedImagePreview(originalUrl.url, 'Uploaded Original Preview', previewsContainer);
                        let thumbnailPreviewableUrl = "";
                        
                        if (thumbnailUrl) {
                            thumbnailPreviewableUrl = createUploadedImagePreview(thumbnailUrl.url, 'Uploaded Thumbnail Preview', previewsContainer);
                        }
                        
                        resultContainer.appendChild(previewsContainer);
                        
                        const setUrlsButton = document.createElement('button');
                        setUrlsButton.textContent = 'OK, set the URLs';
                        setUrlsButton.style.marginTop = '15px';
                        setUrlsButton.style.padding = '10px 20px';
                        setUrlsButton.style.backgroundColor = '#2196F3';
                        setUrlsButton.style.color = 'white';
                        setUrlsButton.style.border = 'none';
                        setUrlsButton.style.borderRadius = '4px';
                        setUrlsButton.style.cursor = 'pointer';
                        
                        setUrlsButton.onclick = () => {
                            document.getElementById(urlInputIdOfOriginalFile).value = originalPreviewableUrl;
                            if (PreviewDvIdForOriginalUrl && document.getElementById(PreviewDvIdForOriginalUrl)) {
                                let previewEl = document.getElementById(PreviewDvIdForOriginalUrl);
                                previewEl.innerHTML = "";
                                
                                const imgEl = document.createElement('img');
                                imgEl.src = originalPreviewableUrl;
                                imgEl.style.maxWidth = '100%';
                                imgEl.style.maxHeight = '200px';
                                imgEl.style.borderRadius = '4px';
                                imgEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                imgEl.onerror = function() {
                                    imgEl.src = 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png';
                                };
                                previewEl.appendChild(imgEl);
                            }
                            
                            if (thumbnailUrl && urlInputIdOfThumbnailFile && document.getElementById(urlInputIdOfThumbnailFile)) {
                                document.getElementById(urlInputIdOfThumbnailFile).value = thumbnailPreviewableUrl;
                                if (PreviewDvIdForThumbnailUrl && document.getElementById(PreviewDvIdForThumbnailUrl)) {
                                    let thumbPreviewEl = document.getElementById(PreviewDvIdForThumbnailUrl);
                                    thumbPreviewEl.innerHTML = "";
                                    
                                    const thumbImgEl = document.createElement('img');
                                    thumbImgEl.src = thumbnailPreviewableUrl;
                                    thumbImgEl.style.maxWidth = '100%';
                                    thumbImgEl.style.maxHeight = '200px';
                                    thumbImgEl.style.borderRadius = '4px';
                                    thumbImgEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    thumbImgEl.onerror = function() {
                                        thumbImgEl.src = 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png';
                                    };
                                    thumbPreviewEl.appendChild(thumbImgEl);
                                }
                            }
                            
                            // Remove all temporary elements
                            previewFormGroup.remove();
                            resultFormGroup.remove();
                            
                            // Reset original button
                            buttonElement.disabled = false;
                            buttonElement.textContent = originalText;
                            buttonElement.onclick = () => window.upld2drv(
                                buttonElement, 
                                loaderId, 
                                driveFolderIdForOriginalFile, 
                                urlInputIdOfOriginalFile, 
                                PreviewDvIdForOriginalUrl, 
                                fileSizeLimitOfOriginal, 
                                driveFolderIdForThumbnailFile, 
                                urlInputIdOfThumbnailFile, 
                                PreviewDvIdForThumbnailUrl,
                                resize2width
                            );
                        };
                        
                        resultContainer.appendChild(setUrlsButton);
                        resultFormGroup.appendChild(resultContainer);
                    }
                    
                    previewContainer.appendChild(uploadButton);
                });
            } else {
                // Show placeholder for thumbnail info
                const thumbnailPlaceholder = document.createElement('div');
                thumbnailPlaceholder.style.margin = '15px 0';
                thumbnailPlaceholder.style.padding = '10px';
                thumbnailPlaceholder.style.backgroundColor = '#f0f0f0';
                thumbnailPlaceholder.style.borderRadius = '4px';
                thumbnailPlaceholder.innerHTML = '<p style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><strong>Thumbnail Image:</strong><br>No thumbnail input given - only original image will be uploaded</p>';
                previewContainer.appendChild(thumbnailPlaceholder);
                
                // Create upload button (only for original file)
                const uploadButton = document.createElement('button');
                uploadButton.textContent = 'Upload File';
                uploadButton.style.marginTop = '15px';
                uploadButton.style.padding = '10px 20px';
                uploadButton.style.backgroundColor = '#4CAF50';
                uploadButton.style.color = 'white';
                uploadButton.style.border = 'none';
                uploadButton.style.borderRadius = '4px';
                uploadButton.style.cursor = 'pointer';
                
                uploadButton.onclick = async () => {
                    uploadButton.disabled = true;
                    showLoader(loaderId);
                    
                    const callback = (error, urls) => {
                        hideLoader(loaderId);
                        
                        if (error) {
                            customAlert('Upload failed: ' + (error.message || error.error || 'Unknown error'));
                            uploadButton.disabled = false;
                            return;
                        }
                        
                        const originalUrl = urls[0];
                        
                        // Create form group for results
                        const resultFormGroup = createFormGroup();
                        resultFormGroup.id = 'upload_result_group';
                        previewFormGroup.insertAdjacentElement('afterend', resultFormGroup);
                        
                        // Create result container
                        const resultContainer = document.createElement('div');
                        resultContainer.innerHTML = `
                            <h3 style="margin-top: 0;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">Upload Results</h3>
                            <p style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><strong>Original Image:</strong></p>
                            <a href="${originalUrl.url}" target="_blank">${originalUrl.name}</a>
                        `;
                        
                        // Add preview of uploaded original image
                        const previewsContainer = document.createElement('div');
                        previewsContainer.style.marginTop = '15px';
                        const originalPreviewableUrl = createUploadedImagePreview(originalUrl.url, 'Uploaded Original Preview', previewsContainer);
                        
                        resultContainer.appendChild(previewsContainer);
                        
                        const setUrlsButton = document.createElement('button');
                        setUrlsButton.textContent = 'OK, set the URL';
                        setUrlsButton.style.marginTop = '15px';
                        setUrlsButton.style.padding = '10px 20px';
                        setUrlsButton.style.backgroundColor = '#2196F3';
                        setUrlsButton.style.color = 'white';
                        setUrlsButton.style.border = 'none';
                        setUrlsButton.style.borderRadius = '4px';
                        setUrlsButton.style.cursor = 'pointer';
                        
                        setUrlsButton.onclick = () => {
                            document.getElementById(urlInputIdOfOriginalFile).value = originalPreviewableUrl;
                            if (PreviewDvIdForOriginalUrl && document.getElementById(PreviewDvIdForOriginalUrl)) {
                                let previewEl = document.getElementById(PreviewDvIdForOriginalUrl);
                                previewEl.innerHTML = "";
                                
                                const imgEl = document.createElement('img');
                                imgEl.src = originalPreviewableUrl;
                                imgEl.style.maxWidth = '100%';
                                imgEl.style.maxHeight = '200px';
                                imgEl.style.borderRadius = '4px';
                                imgEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                imgEl.onerror = function() {
                                    imgEl.src = 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png';
                                };
                                previewEl.appendChild(imgEl);
                            }
                            
                            // Remove all temporary elements
                            previewFormGroup.remove();
                            resultFormGroup.remove();
                            
                            // Reset original button
                            buttonElement.disabled = false;
                            buttonElement.textContent = originalText;
                            buttonElement.onclick = () => window.upld2drv(
                                buttonElement, 
                                loaderId, 
                                driveFolderIdForOriginalFile, 
                                urlInputIdOfOriginalFile, 
                                PreviewDvIdForOriginalUrl, 
                                fileSizeLimitOfOriginal, 
                                driveFolderIdForThumbnailFile, 
                                urlInputIdOfThumbnailFile, 
                                PreviewDvIdForThumbnailUrl,
                                resize2width
                            );
                        };
                        
                        resultContainer.appendChild(setUrlsButton);
                        resultFormGroup.appendChild(resultContainer);
                    };
                    
                    if (!googleTokenClient) {
                        pendingUploads.push({ 
                            files: [originalFile], 
                            folderId: driveFolderIdForOriginalFile, 
                            callback 
                        });
                        handleAuth(loaderId);
                    } else {
                        uploadFilesToDrive([originalFile], driveFolderIdForOriginalFile, callback);
                    }
                };
                
                previewContainer.appendChild(uploadButton);
            }
        };
        
        img.onerror = function() {
            customAlert('The selected file is not a valid image.');
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
            document.body.removeChild(fileInput);
        };
        
        img.src = URL.createObjectURL(originalFile);
    }, { once: true });
};

// Initialize Google APIs
function initDriveUploader() {
    loadScript('https://accounts.google.com/gsi/client', function() {
        initGoogleAuth();
        loadScript('https://apis.google.com/js/api.js', handleClientLoad);
    });
}