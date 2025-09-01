import { Image } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function BrandLogo(fullProps) {
    return (
        <Image
            width={279}
            height={80}
            display='block'
            {...fullProps}
        />
    );
}

export default wrapFunctionalComponent(BrandLogo, 'BrandLogo');
