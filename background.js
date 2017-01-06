function setPaused(paused) {
  updateBadge(paused);
}

chrome.browserAction.onClicked.addListener(function(tab){
  setPaused(false);
  chrome.tabs.update(tab.id, {url: tab.url});
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name == "isPaused?")
    sendResponse({value: false});
  }
});

chrome.runtime.onInstalled.addListener(function() {
  setPaused(false);
});