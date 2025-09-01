/* eslint-disable object-curly-newline */
import React from 'react';
import framework from 'utils/framework';
import { Grid } from 'components/ui';
import HoursRow from 'components/Content/Happening/StoreDetails/HoursInformation/HoursGrid/HoursRow';

const { wrapFunctionalComponent } = framework;

const HoursGrid = ({ timeRange, ...restProps }) => {
    return (
        <Grid
            gap={[1]}
            {...restProps}
            width='auto'
            gridTemplateColumns={['repeat(2,1fr)']}
        >
            {timeRange.map(({ label, value, valueColor = '', isTitle = false }, index) => (
                <HoursRow
                    key={index}
                    firstColProps={{
                        children: label,
                        ...(isTitle && {
                            fontWeight: 'bold',
                            lineHeight: 'tight',
                            fontSize: 'md',
                            paddingBottom: [1]
                        })
                    }}
                    secondColProps={{
                        children: value,
                        ...(!!valueColor && { color: valueColor })
                    }}
                />
            ))}
        </Grid>
    );
};

export default wrapFunctionalComponent(HoursGrid, 'HoursGrid');
