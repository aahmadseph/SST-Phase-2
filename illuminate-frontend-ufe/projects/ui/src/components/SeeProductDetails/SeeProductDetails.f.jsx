import React from 'react';
import { Button } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function SeeProductDetails({
    url, seeDetails, variant, size, block = false
}) {
    return (
        <Button
            block={block}
            size={size}
            variant={variant}
            onClick={
                url
                    ? e => {
                        Location.navigateTo(e, url);
                    }
                    : null
            }
            href={url}
            children={seeDetails}
        />
    );
}

export default wrapFunctionalComponent(SeeProductDetails, 'SeeProductDetails');
