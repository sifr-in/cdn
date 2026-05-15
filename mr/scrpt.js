// Dynamic body construction with inline CSS
(function() {
  // Get the image ID from the global variable
  const imageId = window.img;
  
  // Construct the full image URL using Google Drive format
  const fullImageUrl = `https://lh3.googleusercontent.com/d/${imageId}=s0?authuser=0`;
  
  // Derive parent folder URL and extract ID from current page URL
  const currentUrl = window.location.href;
  const urlParts = currentUrl.split('/');
  // Get the filename (last part) and extract ID without extension
  const filename = urlParts[urlParts.length - 1];
  const fileId = filename.replace('.html', '');
  // Remove the filename and the 'p' directory
  urlParts.pop();
  urlParts.pop();
  // Construct redirect URL with id parameter
  const redirectUrl = urlParts.join('/') + '/?id=' + fileId;
  
  // Get title and extract label
  const titleText = document.title;
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  const ogTitle = ogTitleMeta ? ogTitleMeta.getAttribute('content') : titleText;
  const labelText = ogTitle.split(' - by')[0].trim();

  // Inject minimal CSS
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: #000;
    }

    .fullscreen-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      display: block;
      z-index: 0;
      background: #000;
    }

    .floating-panel {
      position: fixed;
      bottom: 1.8rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
      background: rgba(10, 10, 14, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 2.5rem;
      padding: 0.9rem 2rem 1.2rem 2rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      width: fit-content;
      max-width: calc(100vw - 2.5rem);
      text-align: center;
    }

    .label-text {
      color: #ffffff;
      font-weight: 500;
      font-size: 1.15rem;
      letter-spacing: 0.01em;
      line-height: 1.4;
      text-shadow: 0 2px 5px rgba(0,0,0,0.6);
      background: rgba(0,0,0,0.3);
      padding: 0.35rem 1.2rem;
      border-radius: 2rem;
      white-space: nowrap;
    }

    .detail-button {
      border: none;
      border-radius: 3rem;
      padding: 0.8rem 2.2rem;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      border: 1px solid rgba(255,255,255,0.7);
      color: #111;
      white-space: nowrap;
      line-height: 1.2;
    }

    .detail-button:hover {
      background: #ffffff;
      box-shadow: 0 8px 22px rgba(0,0,0,0.45);
      transform: scale(1.02);
    }

    .detail-button:active {
      transform: scale(0.97);
      background: #f0f0f0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    @media (max-width: 480px) {
      .detail-button {
        padding: 0.75rem 1.8rem;
        font-size: 0.95rem;
      }
      .floating-panel {
        padding: 0.8rem 1.5rem 1.1rem 1.5rem;
        bottom: 1.2rem;
      }
      .label-text {
        font-size: 1rem;
        white-space: normal;
        padding: 0.35rem 1rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Construct body content
  const bodyHTML = `
    <img 
      src="${fullImageUrl}" 
      alt="${labelText}" 
      class="fullscreen-bg"
      loading="eager"
    >
    <div class="floating-panel">
      <div class="label-text">${labelText}</div>
      <button class="detail-button" id="profileButton">
        see other details / see other profiles
      </button>
    </div>
  `;

  // Insert content at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', bodyHTML);

  // Add click handler for button
  const profileBtn = document.getElementById('profileButton');
  if (profileBtn) {
    profileBtn.addEventListener('click', function() {
      window.location.href = redirectUrl;
    });
  }
})();