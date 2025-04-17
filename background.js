chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: blurDistractions,
      });
    }
  });
  
  function blurDistractions() {
    const keywords = ["entertainment", "music", "comedy", "funny", "vlog", "prank"];
    document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer").forEach((video) => {
      let title = video.innerText.toLowerCase();
      if (keywords.some(keyword => title.includes(keyword))) {
        video.style.filter = "blur(8px)";
        video.style.opacity = "0.5";
      }
    });
  }
  