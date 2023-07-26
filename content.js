function getStorageData(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, function (result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            return resolve(result);
        });
    });
}

let minWordCount;

// Declare the function outside of the promise.
function boldFirstLetters(node) {
    // Use minWordCount value here
    if (node.textContent.split(/\s+/).length < minWordCount) {
        return;
    }

    let nodesArray = Array.from(node.childNodes);
    nodesArray.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            var htmlContent = child.textContent.replace(/\b(\w{2,3})\w*\b/g, function (match, p1) {
                return `<b>${p1}</b>` + match.slice(p1.length);
            });
            child.textContent = ''; // Clear the current text
            let newChild = document.createElement('span'); // Create a new node
            newChild.innerHTML = htmlContent; // Set the new text (with HTML tags)
            node.insertBefore(newChild, child); // Insert the new node before the old text node
            node.removeChild(child); // Remove the old text node
        }
    });
}

function observerCallback(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(newNode => {
                if (newNode.nodeName === 'DIV' || newNode.nodeName === 'P') {
                    boldFirstLetters(newNode);
                }
            });
        }
    }
}

const observer = new MutationObserver(observerCallback);

getStorageData('minWordCount').then(result => {
    minWordCount = result.minWordCount || 30; // Use the stored value, or default to 30
    observer.observe(document.body, { childList: true, subtree: true });
    let tags = Array.from(document.querySelectorAll('div, p'));
    tags.forEach(tag => boldFirstLetters(tag));

}).catch(error => {
    console.log('Failed to get storage data:', error);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        let storageChange = changes[key];
        if (key === 'minWordCount') {
            minWordCount = storageChange.newValue;
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "refresh") {
        // Send a message to the background script to refresh the page
        chrome.runtime.sendMessage({action: "refresh"});
    }
});
