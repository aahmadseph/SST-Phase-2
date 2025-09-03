import apiUtil from 'utils/Api';
import localeUtils from 'utils/LanguageLocale';

class BazarVoiceClient {
    constructor(settings) {
        this.settings = settings;

        // will use readConfig for POSTs if writeConfig is not present
        if (!settings.writeConfig) {
            settings.writeConfig = settings.readConfig;
        }
    }

    request(options) {
        const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');

        if (!this.settings.isEnabled) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ error: getText('bazaarVoiceApiRequestFailureReason') });
        }

        const config = options.method === 'POST' ? this.settings.writeConfig : this.settings.readConfig;
        const qsParams = Object.assign({}, options.qsParams, {
            passkey: config.token,
            apiversion: config.version,
            Locale: localeUtils.getCurrentLanguageCountryCode()
        });

        const opts = Object.assign({}, options, {
            url: 'https://' + config.host + options.url,
            qsParams
        });

        return new Promise((resolve, reject) => {
            apiUtil
                .request(opts)
                .then(response => response.json())
                .then(data => {
                    if (data.HasErrors) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject({ errors: [].concat(data.Errors) });
                    } else {
                        resolve(data);
                    }
                })
                .catch(error => {
                    reject(Object.assign({}, error, { apiFailed: true }));
                });
        });
    }
}

export default BazarVoiceClient;
