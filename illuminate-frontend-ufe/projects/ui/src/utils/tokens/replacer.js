const replacedValues = {};

export default {
    getTokenValue(value, replacer) {
        return new Promise((resolve, reject) => {
            if (!replacedValues[value]) {
                replacer(value)
                    .then(result => {
                        replacedValues[value] = result;

                        resolve(result);
                    })
                    .catch(error => reject(error));
            } else {
                resolve(replacedValues[value]);
            }
        });
    }
};
