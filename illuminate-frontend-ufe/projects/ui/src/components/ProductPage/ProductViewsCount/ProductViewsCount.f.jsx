import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import { colors } from 'style/config';

const ProductViewsCount = props => {
    const {
        peopleViewing, thresholdForViews, localization, formatViewCount, setAnalytics, lookBackWindowForViews
    } = props;

    if (!peopleViewing || !thresholdForViews || peopleViewing < thresholdForViews) {
        return null;
    }

    setAnalytics(lookBackWindowForViews);

    return (
        <Box
            marginTop={4}
            backgroundColor={colors.black}
            borderRadius={2}
            paddingLeft={2}
            width='343px'
            height='24px'
        >
            <Text
                is='p'
                lineHeight='24px'
                fontSize='sm'
                color={colors.white}
            >
                <Text paddingRight={1}>🤩</Text>
                {localization.popularNow} <strong>{formatViewCount(peopleViewing)}+</strong> {localization.peopleViewed}
            </Text>
        </Box>
    );
};

export default wrapFunctionalComponent(ProductViewsCount, 'ProductViewsCount');
