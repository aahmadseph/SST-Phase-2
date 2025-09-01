import React from 'react';
import { Text } from 'components/ui';
import FramworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FramworkUtils;

function SpecialHours({ storeHoursDisplay, hasBoldedDay }) {
    const tag = hasBoldedDay ? 'b' : 'span';

    return (
        <div>
            {storeHoursDisplay &&
                storeHoursDisplay.length &&
                storeHoursDisplay.map(storeDisplay => (
                    <div key={storeDisplay.dateRange}>
                        <Text
                            is={tag}
                            width={65}
                        >
                            {storeDisplay.dateRange}
                        </Text>
                        : <Text color={storeDisplay.textColor}>{storeDisplay.storeHours ? storeDisplay.storeHours : storeDisplay.reason} </Text>
                    </div>
                ))}
        </div>
    );
}

SpecialHours.defaultProps = {
    hasBoldedDay: true
};

export default wrapFunctionalComponent(SpecialHours, 'SpecialHours');
