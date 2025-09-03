// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
function getHexFromBuffer(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);

    for (let i = 0; i < view.byteLength; i += 4) {
        // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        const value = view.getUint32(i);
        // toString(16) will give the hex representation of the number without padding
        const stringValue = value.toString(16);
        // We use concatenation and slice for padding
        const padding = '00000000';
        const paddedValue = (padding + stringValue).slice(-padding.length);
        hexCodes.push(paddedValue);
    }

    // Join all the hex strings into one
    return hexCodes.join('');
}

function sha256(string) {
    // We transform the string into an arraybuffer.
    const buffer = new TextEncoder('utf-8').encode(string);

    return crypto.subtle.digest('SHA-256', buffer).then(function (hash) {
        return getHexFromBuffer(hash);
    });
}

export default {
    getHexFromBuffer,
    sha256
};
