import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import urlUtils from 'utils/Url';
import { Text, Link } from 'components/ui';
import Location from 'utils/Location';

function DisplayName({ product, ...props }) {
    const { brand, displayName } = product;

    return (
        <Text {...props}>
            {brand && brand.displayName && (
                <>
                    <Link
                        data-at={Sephora.debug.dataAt('brand_name')}
                        fontWeight='bold'
                        href={urlUtils.getLink(brand.targetUrl, ['product_link_brand'])}
                        onClick={e => {
                            Location.navigateTo(e, brand.targetUrl);
                        }}
                        children={brand.displayName}
                    />
                    &nbsp;
                    <br />
                </>
            )}
            <Text
                data-at={Sephora.debug.dataAt(props.productDisplayNameDataAt || 'product_name')}
                fontSize='md'
                children={displayName}
            />
        </Text>
    );
}

DisplayName.defaultProps = {
    is: 'h1',
    lineHeight: 'tight',
    marginBottom: [2, 3]
};

export default wrapFunctionalComponent(DisplayName, 'DisplayName');
