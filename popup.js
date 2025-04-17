// popup.js
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const enableFocusToggle = document.getElementById('enable-focus');
    const blurIntensitySlider = document.getElementById('blur-intensity');
    const blurValueDisplay = document.getElementById('blur-value');
    const thresholdSlider = document.getElementById('threshold');
    const thresholdValueDisplay = document.getElementById('threshold-value');
    const showOverlayToggle = document.getElementById('show-overlay');
    const resetStatsButton = document.getElementById('reset-stats');
    
    // Stats elements
    const focusTimeElement = document.getElementById('focus-time');
    const eduVideosElement = document.getElementById('edu-videos');
    const distractionsElement = document.getElementById('distractions');
    
    // Load saved settings
    chrome.storage.sync.get({
      enableAutoMode: true,
      blurIntensity: 10,
      showOverlay: true,
      threshold: 0.6,
      stats: {
        totalFocusTime: 0,
        educationalVideosClicked: 0,
        distractionsAvoided: 0
      }
    }, function(items) {
      // Update UI with saved settings
      enableFocusToggle.checked = items.enableAutoMode;
      blurIntensitySlider.value = items.blurIntensity;
      blurValueDisplay.textContent = items.blurIntensity + 'px';
      thresholdSlider.value = Math.round(items.threshold * 100);
      thresholdValueDisplay.textContent = Math.round(items.threshold * 100) + '%';
      showOverlayToggle.checked = items.showOverlay;
      
      // Update stats display
      updateStatsDisplay(items.stats);
    });
    
    // Save settings when changed
    enableFocusToggle.addEventListener('change', function() {
      chrome.storage.sync.set({ enableAutoMode: enableFocusToggle.checked });
      // Send message to content script to update settings
      sendSettingsToActiveTab();
    });
    
    blurIntensitySlider.addEventListener('input', function() {
      blurValueDisplay.textContent = blurIntensitySlider.value + 'px';
      chrome.storage.sync.set({ blurIntensity: parseInt(blurIntensitySlider.value) });
      sendSettingsToActiveTab();
    });
    
    thresholdSlider.addEventListener('input', function() {
      const thresholdValue = parseInt(thresholdSlider.value) / 100;
      thresholdValueDisplay.textContent = thresholdSlider.value + '%';
      chrome.storage.sync.set({ threshold: thresholdValue });
      sendSettingsToActiveTab();
    });
    
    showOverlayToggle.addEventListener('change', function() {
      chrome.storage.sync.set({ showOverlay: showOverlayToggle.checked });
      sendSettingsToActiveTab();
    });
    
    resetStatsButton.addEventListener('click', function() {
      const stats = {
        totalFocusTime: 0,
        educationalVideosClicked: 0,
        distractionsAvoided: 0
      };
      chrome.storage.sync.set({ stats: stats });
      updateStatsDisplay(stats);
    });
    
    // Helper function to update stats display
    function updateStatsDisplay(stats) {
      // Convert total focus time from milliseconds to hours/minutes
      const totalHours = Math.floor(stats.totalFocusTime / (60 * 60 * 1000));
      const totalMinutes = Math.floor((stats.totalFocusTime % (60 * 60 * 1000)) / (60 * 1000));
      focusTimeElement.textContent = `${totalHours}h ${totalMinutes}m`;
      
      eduVideosElement.textContent = stats.educationalVideosClicked;
      distractionsElement.textContent = stats.distractionsAvoided;
    }
    
    // Send current settings to active tab
    function sendSettingsToActiveTab() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0] && tabs[0].url.includes('youtube.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'updateSettings',
            settings: {
              enableAutoMode: enableFocusToggle.checked,
              blurIntensity: parseInt(blurIntensitySlider.value),
              threshold: parseInt(thresholdSlider.value) / 100,
              showOverlay: showOverlayToggle.checked
            }
          });
        }
      });
    }
  });