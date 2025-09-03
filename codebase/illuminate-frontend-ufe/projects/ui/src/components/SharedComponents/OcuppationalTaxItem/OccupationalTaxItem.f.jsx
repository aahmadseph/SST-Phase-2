import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function OccupationalTaxItem({ occupationalTaxItems }) {
    const taxItemsLen = occupationalTaxItems.length;

    return taxItemsLen > 0 ? (
        <>
            {occupationalTaxItems.map((item, index) => (
                <Grid
                    key={item.taxItemText || index}
                    columns='1fr auto'
                    marginY={2}
                >
                    <span>{item.taxItemText}</span>
                    <strong
                        data-at={Sephora.debug.dataAt('ropis_enterprise_tax')}
                        children={item.value}
                    />
                </Grid>
            ))}
        </>
    ) : null;
}

OccupationalTaxItem.propTypes = {
    occupationalTaxItems: PropTypes.array.isRequired
};

export default wrapFunctionalComponent(OccupationalTaxItem, 'OccupationalTaxItem');
