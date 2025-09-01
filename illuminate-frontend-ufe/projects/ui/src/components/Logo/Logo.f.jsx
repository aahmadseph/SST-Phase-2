import anaUtils from 'analytics/utils';
import urlUtils from 'utils/Url';
import { Image } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

const { getLink } = urlUtils;

function Logo() {
    return (
        <a
            href={getLink('/')}
            onClick={() =>
                anaUtils.setNextPageData({
                    navigationInfo: anaUtils.buildNavPath(['top nav', 'sephora icon'])
                })
            }
            css={{ display: 'block' }}
        >
            <Image
                display='block'
                alt='Sephora'
                src='/img/ufe/logo.svg'
                disableLazyLoad={true}
                width={[85, 216]}
                height={[11, 28]}
                data-at={Sephora.debug.dataAt('sephora_logo_ref')}
            />
        </a>
    );
}

export default wrapFunctionalComponent(Logo, 'Logo');
