import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { fontWeights } from 'style/config';
import { Grid, Text } from 'components/ui';
import Address from 'components/Addresses/Address';

const DeliverToSection = ({ address, title }) => (
    <Grid
        columns={['97px 1fr', null, 1]}
        data-at={Sephora.debug.dataAt('deliver_to_container')}
        gap={[4, null, 0]}
    >
        <Text
            is='h2'
            css={styles.title}
        >
            {title}
        </Text>
        <Address address={address} />
    </Grid>
);

const styles = { title: { fontWeight: fontWeights.bold } };

DeliverToSection.defaultProps = {};
DeliverToSection.propTypes = {
    address: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(DeliverToSection, 'DeliverToSection');
