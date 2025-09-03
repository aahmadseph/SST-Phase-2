import React from 'react';
import framework from 'utils/framework';
const { wrapHOC, wrapHOCComponent } = framework;

const withKillSwitch = wrapHOC(function withKillSwitch(WrappedComponent, killSwitchName) {
    const KillSwitch = props => {
        const killSwitchEnabled = Sephora.configurationSettings[killSwitchName] === true;

        return killSwitchEnabled ? <WrappedComponent {...props} /> : null;
    };

    return wrapHOCComponent(KillSwitch, 'KillSwitch', arguments);
});

export { withKillSwitch };
