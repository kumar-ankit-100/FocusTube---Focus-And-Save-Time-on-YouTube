// content.js - Main script that runs on YouTube pages

// Educational keywords to identify learning content
const EDUCATIONAL_KEYWORDS = [
    "tutorial", "learn", "course", "education", "programming", 
    "python", "javascript", "coding", "html", "css", "development",
    "lesson", "training", "guide", "how to", "explained"
  ];
  
  // Entertainment keywords to identify distracting content
  const ENTERTAINMENT_KEYWORDS = [
    "funny", "meme", "prank", "gaming", "gameplay", "reaction", 
    "vlog", "celebrity", "music video", "comedy", "challenge"
  ];
  
  // Educational channels (example - you would expand this)
  const EDUCATIONAL_CHANNELS = [
    "freeCodeCamp.org", "Traversy Media", "Academind", 
    "CS Dojo", "Khan Academy", "MIT OpenCourseWare"
  ];
  
  // Configuration object - could be loaded from extension settings
  let config = {
    blurIntensity: 10,    // How blurry to make non-educational content (px)
    showOverlay: true,    // Show "Focus Mode" overlay on blurred content
    enableAutoMode: true, // Automatically blur content vs. manual mode
    threshold: 0.6        // Confidence threshold for classification
  };
  
  // Track user session data
  let sessionData = {
    startTime: Date.now(),
    educationalVideosClicked: 0,
    entertainmentVideosClicked: 0,
    lastActivity: Date.now()
  };
  
  // Main function to process YouTube page
  function processYouTubePage() {
    console.log("YouTube Focus: Processing page...");
    
    // Different handling depending on the page type
    if (window.location.pathname === "/") {
      processHomePage();
    } else if (window.location.pathname.startsWith("/results")) {
      processSearchResults();
    } else if (window.location.pathname.startsWith("/watch")) {
      processVideoPage();
    }
    
    // Set up a mutation observer to handle dynamic content loading
    setupMutationObserver();
  }
  
  // Process YouTube homepage
  function processHomePage() {
    const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
    videoElements.forEach(processVideoElement);
  }
  
  // Process YouTube search results
  function processSearchResults() {
    const videoElements = document.querySelectorAll('ytd-video-renderer');
    videoElements.forEach(processVideoElement);
  }
  
  // Process a video page (recommendations)
  function processVideoPage() {
    const recommendedVideos = document.querySelectorAll('ytd-compact-video-renderer');
    recommendedVideos.forEach(processVideoElement);
  }
  
  // Process an individual video element
  function processVideoElement(videoElement) {
    // Extract video information
    const titleElement = videoElement.querySelector('#video-title, .title');
    if (!titleElement) return;
    
    const title = titleElement.textContent.trim();
    const channelElement = videoElement.querySelector('#channel-name, .ytd-channel-name');
    const channel = channelElement ? channelElement.textContent.trim() : '';
    
    // Determine if this is educational content
    const isEducational = classifyContent(title, channel);
    
    if (!isEducational && config.enableAutoMode) {
      // Apply blur effect to non-educational content
      videoElement.classList.add('yt-focus-blurred');
      
      // Add overlay if enabled
      if (config.showOverlay) {
        addFocusOverlay(videoElement, title);
      }
    }
  }
  
  // Simple classification function based on keywords
  function classifyContent(title, channel) {
    title = title.toLowerCase();
    channel = channel.toLowerCase();
    
    // Check if it's from a known educational channel
    for (const eduChannel of EDUCATIONAL_CHANNELS) {
      if (channel.includes(eduChannel.toLowerCase())) {
        return true;
      }
    }
    
    // Count educational keywords in title
    let eduKeywordCount = 0;
    for (const keyword of EDUCATIONAL_KEYWORDS) {
      if (title.includes(keyword.toLowerCase())) {
        eduKeywordCount++;
      }
    }
    
    // Count entertainment keywords in title
    let entKeywordCount = 0;
    for (const keyword of ENTERTAINMENT_KEYWORDS) {
      if (title.includes(keyword.toLowerCase())) {
        entKeywordCount++;
      }
    }
    
    // Simple scoring system
    const totalKeywords = eduKeywordCount + entKeywordCount;
    if (totalKeywords === 0) return false; // Default to blurring if no keywords match
    
    const eduScore = eduKeywordCount / totalKeywords;
    return eduScore >= config.threshold;
  }
  
  // Add an overlay to blurred content with a button to reveal
  function addFocusOverlay(videoElement, title) {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'yt-focus-overlay';
    overlay.innerHTML = `
      <div class="yt-focus-message">
        <span>Potentially distracting content</span>
        <button class="yt-focus-show-btn">Show Anyway</button>
      </div>
    `;
    
    // Add to the DOM
    videoElement.style.position = 'relative';
    videoElement.appendChild(overlay);
    
    // Add event listener to show button
    const showBtn = overlay.querySelector('.yt-focus-show-btn');
    showBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoElement.classList.remove('yt-focus-blurred');
      overlay.remove();
      
      // Track this decision in session data
      sessionData.entertainmentVideosClicked++;
      sessionData.lastActivity = Date.now();
    });
  }
  
  // Set up mutation observer to handle dynamic content loading
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          shouldProcess = true;
        }
      });
      
      if (shouldProcess) {
        // Debounce processing to avoid excessive CPU usage
        clearTimeout(window.ytFocusDebounce);
        window.ytFocusDebounce = setTimeout(() => {
          processYouTubePage();
        }, 500);
      }
    });
    
    // Start observing the DOM for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize when the page loads
  window.addEventListener('load', () => {
    processYouTubePage();
    
    // Listen for navigation events (YouTube is a SPA)
    const pushStateOriginal = history.pushState;
    history.pushState = function() {
      pushStateOriginal.apply(this, arguments);
      processYouTubePage();
    };
    
    window.addEventListener('popstate', () => {
      processYouTubePage();
    });
  });