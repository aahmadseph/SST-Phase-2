// TODO: Change this to export an object rather than a function to facilitate stubbing

export default {
    loadScripts: function (list, callback, asyncload) {
        const waiting = list.slice();

        const loaded = [];

        const done = src => {
            loaded.push(src);

            if (callback && loaded.length === list.length) {
                callback();
            }
        };

        const load = src => {
            const script = Sephora.isNodeRender ? global.document.createElement('script') : document.createElement('script');

            script.src = src;

            if (asyncload) {
                script.async = true;
            }

            script.onload = () => {
                done(src);

                if (waiting.length) {
                    load(waiting.shift());
                }
            };

            const firstScript = Sephora.isNodeRender ? global.document.getElementsByTagName('script')[0] : document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(script, firstScript);
        };

        load(waiting.shift());
    },

    SCRIPTS: {
        GOOGLE: '//maps.googleapis.com/maps/api/js?key=' + Sephora.configurationSettings.googleMapsApiKey + '&v=3.exp&sensor=false&libraries=places'
    }
};
