export const listenExtensionMessages = callback => {
    // eslint-disable-next-line no-undef
    chrome.runtime.onMessage.addListener(callback);
};
