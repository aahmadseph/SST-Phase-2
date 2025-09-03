import React from 'react';
import { Box } from 'components/ui';
import marketingFlagsUtil from 'utils/MarketingFlags';
import { wrapFunctionalComponent } from 'utils/framework';

function MarketingFlags(fullProps) {
    const { sku, ...props } = fullProps;

    const flags = marketingFlagsUtil.getAllValidFlagsArray(sku);

    return flags.length > 0 ? (
        <Box {...props}>
            {flags.map((flag, index) => (
                <React.Fragment key={index.toString()}>
                    {index > 0 && ' · '}
                    {flag.toLowerCase()}
                </React.Fragment>
            ))}
        </Box>
    ) : null;
}

MarketingFlags.shouldUpdatePropsOn = ['sku.skuId', 'sku.actionFlags'];

MarketingFlags.defaultProps = {
    fontSize: 'sm',
    lineHeight: 'tight',
    fontWeight: 'var(--font-weight-bold)'
};

export default wrapFunctionalComponent(MarketingFlags, 'MarketingFlags');
