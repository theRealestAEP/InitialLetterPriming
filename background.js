chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "refresh") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // This will refresh the active tab
            chrome.tabs.reload(tabs[0].id);
        });
    }
});