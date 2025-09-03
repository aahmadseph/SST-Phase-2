/* eslint-disable no-console */

const setupFingerprint = callback => {
    if (typeof callback !== 'function') {
        return;
    }

    FingerprintJS.load()
        .then(fp => {
            fp.get()
                .then(result => {
                    // Exclude fonts from identifier
                    const { ...components } = result.components;
                    const fingerPrint = FingerprintJS.hashComponents({ ...components });

                    return callback(fingerPrint);
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
        });
};

export default { setupFingerprint };
