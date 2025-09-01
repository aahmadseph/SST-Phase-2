/* eslint-disable no-console */
import store from 'store/Store';
import Events from 'utils/framework/Events';
import Location from 'utils/Location';

/*
    Constructor beacon implementation
    1 - In order to run we check if the current page is a valid page for beacon and also the flag
    2 - We initialized the constructor beacon with the proper data.
    2 - We trigger an Event in order to notify the search.headScript and make the api call in case of search page.
*/
function initializeConstructorBeacon() {
    if (Location.isConstructorEnabledPage() && Sephora.configurationSettings.isNLPInstrumentationEnabled) {
        const testCellValue = Sephora.configurationSettings.isNLPSearchEnabled ? 'constructor' : 'textEndeca';

        const { country, language } = Sephora.renderQueryParams;

        const channel = `${country}-${language.toUpperCase()}`;

        const beaconClientOptions = {
            key: Sephora.configurationSettings.constructorApiKey,
            testCells: { voicesearch: testCellValue },
            [channel]: 'web'
        };

        store.setAndWatch('user', null, user => {
            beaconClientOptions.userId = user && user.user && user.user.profileId;

            if (window.ConstructorioTracker) {
                window.ConstructorioTracker.setClientOptions(beaconClientOptions);
                window.dispatchEvent(new CustomEvent(Events.ConstructorBeaconInitialized));
            } else {
                window.addEventListener('cio.beacon.loaded', function setOptionsOnLoadEvent() {
                    if (window.ConstructorioTracker) {
                        window.ConstructorioTracker.setClientOptions(beaconClientOptions);
                        window.dispatchEvent(new CustomEvent(Events.ConstructorBeaconInitialized));
                    }
                });
            }
        });
    } else {
        window.dispatchEvent(new CustomEvent(Events.ConstructorBeaconDisabled));
    }
}

export { initializeConstructorBeacon };
