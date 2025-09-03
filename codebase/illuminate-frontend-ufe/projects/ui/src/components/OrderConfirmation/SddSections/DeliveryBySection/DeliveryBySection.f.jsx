import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Text } from 'components/ui';

const DeliveryBySection = props => {
    const { promiseDateRangeLabel, promiseDateRange } = props;

    return (
        <Grid
            columns={['97px 1fr', null, 1]}
            gap={[4, null, 0]}
            marginTop={5}
        >
            <Text fontWeight='bold'>{promiseDateRangeLabel}</Text>
            <Text>{promiseDateRange}</Text>
        </Grid>
    );
};

DeliveryBySection.propTypes = {
    promiseDateRangeLabel: PropTypes.string,
    promiseDateRange: PropTypes.string
};

DeliveryBySection.defaultProps = {
    promiseDateRangeLabel: '',
    promiseDateRange: ''
};

export default wrapFunctionalComponent(DeliveryBySection, 'DeliveryBySection');
