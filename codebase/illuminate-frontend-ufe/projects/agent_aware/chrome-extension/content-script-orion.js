function handleResponse(message) {
    const event = new CustomEvent('submitMirrorForm');
    window.dispatchEvent(event);
}

function handleError(error) {
    console.error(`Error: ${error}`);
}

function sendMessage(e) {
    const sending = chrome.runtime.sendMessage({ type: 'buttonClicked', agentDetails: e.detail });
    sending.then(handleResponse, handleError);
}

window.addEventListener('mirrorButtonClicked', sendMessage);
