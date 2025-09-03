import LoadScripts from 'utils/LoadScripts';

const CALLBACK_KEY = 'io_bb_callback';
// prettier-ignore
const DEFAULT_OPTIONS = {
    'io_install_flash': false,
    'io_install_stm': false,
    'io_enable_rip': false
};
// prettier-ignore
const DEFAULT_OPTION_REVIEW = {
    'enable_rip': true,
    'enable_flash': false,
    'install_flash': false,
    loader: {
        version: 'general5',
        'fp_static': false
    }
};

export default {
    getBlackboxString: function (options = [], reviewPage = false) {
        return new Promise(resolve => {
            let iovationConfig;

            if (reviewPage) {
                iovationConfig = DEFAULT_OPTION_REVIEW;
            } else {
                iovationConfig = DEFAULT_OPTIONS;
            }

            if (Object.keys(options).length) {
                Object.keys(options).forEach(option => (iovationConfig[option] = options[option]));
            }

            Object.keys(iovationConfig).forEach(option => {
                window[option] = iovationConfig[option];
            });

            if (!window[CALLBACK_KEY]) {
                window[CALLBACK_KEY] = (blackBoxString, isComplete) => {
                    if (isComplete) {
                        resolve(blackBoxString);
                    }
                };
            }
        });
    },
    loadIovationScript: function () {
        // TODO: make CE story to store script URL in Sephora.configurationSettings
        // production URL will be: //mpsnare.iesnare.com/snare.js
        const scriptToLoad = Sephora.UFE_ENV === 'PROD' ? '//mpsnare.iesnare.com/snare.js' : '//ci-mpsnare.iovation.com/snare.js';
        LoadScripts.loadScripts([scriptToLoad]);
    }
};
