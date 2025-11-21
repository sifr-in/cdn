// drive.js - Google Drive Uploader with enhanced preview functionality for all file types

// Global variables
// Replace all your let declarations with:
window.googleAuth = window.googleAuth || null;
window.googleTokenClient = window.googleTokenClient || null;
window.isGoogleApiLoaded = window.isGoogleApiLoaded || false;
window.isInitializing = window.isInitializing || false;
window.pendingUploads = window.pendingUploads || [];
window.authInProgress = window.authInProgress || false;
window.authContainer = window.authContainer || null;

// Initialize Google APIs
function handleClientLoad() {gapi.load('client', initializeGapiClient);}

// Initialize Google API client
async function initializeGapiClient() {
    try {
        await gapi.client.init({
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
        isGoogleApiLoaded = true;
        isInitializing = false;
        processPendingUploads();
    } catch (error) {
        console.error('Error initializing Google API client:', error);
        isInitializing = false;
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
            loader.style.zIndex = '2147483647';
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
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertBox = document.createElement('div');
    alertBox.className = 'alert alert-danger alert-dismissible fade show custom-alert';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.zIndex = '10000';
    alertBox.style.maxWidth = '80%';
    
    alertBox.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertBox);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(alertBox)) {
            document.body.removeChild(alertBox);
        }
    }, 5000);
}

// Show modal for missing function
function showMissingFunctionModal() {
    const modalHtml = `
        <div class="modal fade" id="missingFunctionModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Configuration Required</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>The <code>funToRunAfterProcess</code> function is required but not defined.</p>
                        <p>Please define a function to handle the uploaded file results.</p>
                        <p><strong>Example:</strong></p>
                        <pre><code>function handleUploadedFiles(fileUrl, fileName, fileType, fileId) {
    // Your code to handle the uploaded file
    console.log('File uploaded:', fileUrl);
}</code></pre>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    const modal = new bootstrap.Modal(document.getElementById('missingFunctionModal'));
    modal.show();
    
    // Remove modal from DOM after hide
    document.getElementById('missingFunctionModal').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modalContainer);
    });
}

// Upload files to Google Drive
async function uploadFilesToDrive(files, folderId, callback) {
    const uploadedUrls = [];
    
    try {
        for (const file of files) {
            const metadata = {
                name: file.name,
                mimeType: file.type || 'application/octet-stream'
            };
            
            // Only add parents if folderId is provided
            if (folderId) {
                metadata.parents = [folderId];
            }
            
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
                    id: responseData.id,
                    type: file.type || 'application/octet-stream'
                });
            } catch (permissionError) {
                console.warn('Error setting permissions:', permissionError);
                uploadedUrls.push({
                    name: responseData.name,
                    url: `https://drive.google.com/file/d/${responseData.id}/view`,
                    id: responseData.id,
                    type: file.type || 'application/octet-stream'
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
    
    // Create auth container using Bootstrap modal
    const modalHtml = `
        <div class="modal fade" id="googleAuthModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Google Drive Authentication</h5>
                    </div>
                    <div class="modal-body text-center">
                        <p>Sign in with Google to upload files to Google Drive</p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-primary" id="googleSignInBtn">
                                Sign In with Google
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    authContainer = document.createElement('div');
    authContainer.innerHTML = modalHtml;
    document.body.appendChild(authContainer);
    
    const modal = new bootstrap.Modal(document.getElementById('googleAuthModal'));
    modal.show();
    
    // Add event listeners
    document.getElementById('googleSignInBtn').addEventListener('click', () => {
        googleAuth.requestAccessToken();
    });
    
    document.getElementById('googleAuthModal').addEventListener('hidden.bs.modal', () => {
        authInProgress = false;
        hideLoader(loaderId);
        removeAuthContainer();
    });
    
    // Auto trigger auth after a short delay
    setTimeout(() => {
        if (authInProgress) {
            googleAuth.requestAccessToken();
        }
    }, 100);
}

// Create preview container
function createPreviewContainer() {
    const container = document.createElement('div');
    container.className = 'preview-container';
    return container;
}

// Create file info display for any file type
function createFileInfoDisplay(file, title, container) {
    const infoContainer = document.createElement('div');
    infoContainer.className = 'mb-3';
    
    const titleElement = document.createElement('h5');
    titleElement.textContent = title;
    titleElement.className = 'mb-2';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'text-center mb-2';
    
    // Create appropriate preview based on file type
    let previewElement;
    
    if (file.type.startsWith('image/')) {
        // Image preview
        previewElement = document.createElement('img');
        previewElement.src = URL.createObjectURL(file);
        previewElement.className = 'img-fluid rounded border';
        previewElement.style.maxHeight = '200px';
    } else if (file.type.startsWith('video/')) {
        // Video preview
        previewElement = document.createElement('video');
        previewElement.src = URL.createObjectURL(file);
        previewElement.controls = true;
        previewElement.className = 'img-fluid rounded border';
        previewElement.style.maxHeight = '200px';
    } else if (file.type.startsWith('audio/')) {
        // Audio preview
        previewElement = document.createElement('audio');
        previewElement.src = URL.createObjectURL(file);
        previewElement.controls = true;
        previewElement.className = 'w-100 my-2';
    } else if (file.type === 'application/pdf') {
        // PDF preview
        previewElement = document.createElement('div');
        previewElement.className = 'p-3 bg-light rounded text-center';
        previewElement.innerHTML = `
            <div class="fs-1 text-danger">📄</div>
            <div class="fw-bold mt-2">PDF Document</div>
            <div class="text-muted">${file.name}</div>
        `;
    } else {
        // Generic file preview
        previewElement = document.createElement('div');
        previewElement.className = 'p-3 bg-light rounded text-center';
        
        // Get file icon based on type
        const fileIcon = getFileIcon(file.type, file.name);
        previewElement.innerHTML = `
            <div class="fs-1 text-primary">${fileIcon}</div>
            <div class="fw-bold mt-2">${getFileTypeDescription(file.type)}</div>
            <div class="text-muted">${file.name}</div>
        `;
    }
    
    const infoElement = document.createElement('div');
    infoElement.className = 'small text-muted';
    infoElement.innerHTML = `
        <div><strong>Name:</strong> ${file.name}</div>
        <div><strong>Size:</strong> ${formatFileSize(file.size)}</div>
        <div><strong>Type:</strong> ${file.type || 'Unknown'}</div>
    `;
    
    previewContainer.appendChild(previewElement);
    infoContainer.appendChild(titleElement);
    infoContainer.appendChild(previewContainer);
    infoContainer.appendChild(infoElement);
    container.appendChild(infoContainer);
    
    return previewElement;
}

// Get file icon based on type
function getFileIcon(mimeType, fileName) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📝';
    if (mimeType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return '📊';
    if (mimeType.includes('powerpoint') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return '📋';
    if (mimeType.includes('zip') || fileName.endsWith('.zip') || fileName.endsWith('.rar')) return '📦';
    if (mimeType.includes('text') || fileName.endsWith('.txt')) return '📃';
    return '📁';
}

// Get file type description
function getFileTypeDescription(mimeType) {
    if (mimeType.startsWith('image/')) return 'Image File';
    if (mimeType.startsWith('video/')) return 'Video File';
    if (mimeType.startsWith('audio/')) return 'Audio File';
    if (mimeType === 'application/pdf') return 'PDF Document';
    if (mimeType.includes('word')) return 'Word Document';
    if (mimeType.includes('excel')) return 'Excel Spreadsheet';
    if (mimeType.includes('powerpoint')) return 'PowerPoint Presentation';
    if (mimeType.includes('zip')) return 'Compressed Archive';
    if (mimeType.includes('text')) return 'Text File';
    return 'File';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    
    // if (fileId) {
    //     return `https://lh3.googleusercontent.com/d/${fileId}=s0?authuser=0`;
    // }
    if (fileId) {
        // Use the direct download format that bypasses the viewer
        return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
        // return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    }
    
    return url; // fallback to original URL
}

// Create uploaded file preview
function createUploadedFilePreview(url, title, container, fileType, fileName) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'mb-3';
    
    const titleElement = document.createElement('h5');
    titleElement.textContent = title;
    titleElement.className = 'mb-2';

    let previewElement;
    
    if (fileType && fileType.startsWith('image/')) {
        // Image preview
        previewElement = document.createElement('img');
        const previewUrl = getDrivePreviewUrl(url);
        previewElement.src = previewUrl;
        previewElement.className = 'img-fluid rounded border';
        previewElement.style.maxHeight = '200px';
        previewElement.onerror = function() {
            previewElement.src = 'https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png';
        };
    } else {
        // Generic file preview
        previewElement = document.createElement('div');
        previewElement.className = 'p-3 bg-light rounded text-center mb-2';
        
        const fileIcon = getFileIcon(fileType, fileName);
        previewElement.innerHTML = `
            <div class="fs-1 text-primary">${fileIcon}</div>
            <div class="fw-bold mt-2">${getFileTypeDescription(fileType)}</div>
            <div class="text-muted">${fileName}</div>
        `;
    }
    
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.target = '_blank';
    linkElement.className = 'btn btn-outline-primary btn-sm';
    linkElement.textContent = 'Open in Drive';
    
    previewContainer.appendChild(titleElement);
    previewContainer.appendChild(previewElement);
    previewContainer.appendChild(linkElement);
    container.appendChild(previewContainer);
    
    return url; // Return the original URL for form fields
}

// Load script helper function
function loadScript(src, callback) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            if (callback) callback();
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            if (callback) callback();
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.head.appendChild(script);
    });
}

// Initialize Google APIs
function initDriveUploader() {
    if (isInitializing) {
        console.log('Google Drive uploader is already initializing...');
        return;
    }
    
    isInitializing = true;
    
    loadScript('https://accounts.google.com/gsi/client')
        .then(() => {
            initGoogleAuth();
            return loadScript('https://apis.google.com/js/api.js');
        })
        .then(() => {
            handleClientLoad();
        })
        .catch(error => {
            console.error('Failed to initialize Google Drive uploader:', error);
            isInitializing = false;
            customAlert('Failed to initialize Google Drive uploader: ' + error.message);
        });
}

// Check if Google APIs are loaded and initialize if not
function ensureDriveUploaderInitialized() {
    if (!isGoogleApiLoaded && !isInitializing) {
        console.log('Initializing Google Drive uploader...');
        initDriveUploader();
    }
}

// Global upload function for any file type
window.upldAnyFile2drv = function(buttonElementID, loaderId, driveFolderIdForOriginalFile, acceptFileTypes = '*', funToRunAfterProcess) {
    const buttonElement = document.getElementById(buttonElementID);
    // Check if callback function exists
    if (typeof funToRunAfterProcess !== 'string' || typeof window[funToRunAfterProcess] !== 'function') {
        showMissingFunctionModal();
        return;
    }
    
    // Ensure the uploader is initialized
    ensureDriveUploaderInitialized();
    
    // Use root folder if no folder ID provided
    const folderId = driveFolderIdForOriginalFile || null;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = acceptFileTypes;
    fileInput.className = 'd-none';
    document.body.appendChild(fileInput);
    
    // Disable the original button and change its text
    buttonElement.disabled = true;
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Selecting File...';
    
    fileInput.click();
    
    fileInput.addEventListener('change', async () => {
        if (fileInput.files.length === 0) {
            buttonElement.disabled = false;
            buttonElement.textContent = originalText;
            document.body.removeChild(fileInput);
            return;
        }
        
        const originalFile = fileInput.files[0];
        
        // Create modal for file preview and upload
        const modalHtml = `
            <div class="modal fade" id="fileUploadModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Upload File to Google Drive</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="previewContainer"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="uploadButton">Upload to Drive</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        const modal = new bootstrap.Modal(document.getElementById('fileUploadModal'));
        const previewContainer = document.getElementById('previewContainer');
        
        // Show file info
        createFileInfoDisplay(originalFile, 'Selected File', previewContainer);
        
        // Add upload button event listener
        document.getElementById('uploadButton').addEventListener('click', () => {
            const uploadButton = document.getElementById('uploadButton');
            uploadButton.disabled = true;
            uploadButton.textContent = 'Uploading...';
            showLoader(loaderId);
            
            const callback = (error, urls) => {
                hideLoader(loaderId);
                modal.hide();
                
                if (error) {
                    customAlert('Upload failed: ' + (error.message || error.error || 'Unknown error'));
                    buttonElement.disabled = false;
                    buttonElement.textContent = originalText;
                    return;
                }
                
                const uploadedFile = urls[0];
                
                // Call the provided callback function
                try {
                    window[funToRunAfterProcess](uploadedFile.url, uploadedFile.name, uploadedFile.type, uploadedFile.id);
                } catch (callbackError) {
                    console.error('Error in callback function:', callbackError);
                    customAlert('Upload completed but callback function failed: ' + callbackError.message);
                }
                
                // Reset original button
                buttonElement.disabled = false;
                buttonElement.textContent = originalText;
                
                // Remove modal from DOM
                document.body.removeChild(modalContainer);
            };
            
            if (!googleTokenClient) {
                pendingUploads.push({ 
                    files: [originalFile], 
                    folderId: folderId, 
                    callback 
                });
                handleAuth(loaderId);
            } else {
                uploadFilesToDrive([originalFile], folderId, callback);
            }
        });
        
document.getElementById('fileUploadModal').addEventListener('hidden.bs.modal', function() {
    buttonElement.disabled = false;
    buttonElement.textContent = originalText;
    
    // Manually remove modal backdrop if it exists
    var backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
        backdrop.remove();
    });
});
        
        modal.show();
    }, { once: true });
};