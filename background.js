let status;

chrome.webRequest.onHeadersReceived.addListener((details) => {
  if (details.type === 'main_frame') {
    const headers = details.responseHeaders;
    status = null;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.name.toLowerCase().startsWith('x-cache')) {
        if (header.value.toLowerCase().startsWith('hit')) {
          status = 'hit';
        } else if (header.value.toLowerCase().startsWith('miss')) {
          status = 'miss';
        } else if (header.value.toLowerCase().startsWith('error')) {
          status = 'err';
        }
      }
    }
  }
}, {
  urls: [
    'http://*/*',
    'https://*/*',
  ],
}, ['responseHeaders']);

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    if (status) {
      switch (status) {
      case 'hit':
        chrome.browserAction.setBadgeBackgroundColor({
          color: 'lightgreen',
          tabId: details.tabId,
        });
        break;
      case 'miss':
        chrome.browserAction.setBadgeBackgroundColor({
          color: 'lightcoral',
          tabId: details.tabId,
        });
        break;
      case 'err':
        chrome.browserAction.setBadgeBackgroundColor({
          color: 'lightcoral',
          tabId: details.tabId,
        });
        break;
      }
      chrome.browserAction.setBadgeText({
        text: status,
        tabId: details.tabId,
      });
    } else {
      chrome.browserAction.setBadgeText({
        text: '',
        tabId: details.tabId,
      });
    }
  }
});
