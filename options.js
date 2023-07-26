// Get the stored minWordCount value from storage
chrome.storage.sync.get(['minWordCount'], function (result) {
    // Set the value of the input field and the span to the stored value
    let minWordCount = result.minWordCount || 30;
    document.getElementById('minWordCount').value = minWordCount;
    document.getElementById('currentMinWordCount').innerText = minWordCount;
});

document.getElementById('saveButton').addEventListener('click', function() {
    let minWordCount = document.getElementById('minWordCount').value;
    chrome.storage.sync.set({minWordCount: minWordCount}, function() {
        console.log('Value is set to ' + minWordCount);
        // Update the text of the span tag immediately after saving
        document.getElementById('currentMinWordCount').innerText = minWordCount;

        // Send a message to the background service worker
        chrome.runtime.sendMessage({action: "refresh"});
    });
});
