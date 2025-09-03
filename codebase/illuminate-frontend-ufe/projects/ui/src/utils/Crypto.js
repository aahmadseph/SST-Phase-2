class Crypto {
    static createRandomUUID = () => {
        let id;

        if (crypto?.randomUUID) {
            id = crypto.randomUUID();
        } else {
            // eslint-disable-next-line no-bitwise
            id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                // eslint-disable-next-line no-bitwise
                (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
            );
        }

        return id;
    };
    static createHmacSha1(key, data) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        const encodedKey = encoder.encode(key);

        if (typeof window === 'undefined') {
            return null;
        }

        return window.crypto.subtle.importKey('raw', encodedKey, { name: 'HMAC', hash: { name: 'SHA-1' } }, false, ['sign']).then(cryptoKey => {
            return window.crypto.subtle.sign('HMAC', cryptoKey, encodedData).then(signatureBuffer => {
                return window.btoa(String.fromCharCode.apply(null, new Uint8Array(signatureBuffer)));
            });
        });
    }
}

export default Crypto;
