import React from 'react';
import { Image, Link } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

function FacebookShare({ link = '' }) {
    // The following requires Facebook SDK is loaded on the page
    // FB SDK is loaded in signal https://hub.signal.co/sites/1nlrtRy/website/libraries/tY3DLG3 on select pages only
    return (
        <Link
            onClick={e => {
                e.preventDefault();
                window.FB?.ui({
                    method: 'share',
                    href: link
                });
            }}
        >
            <Image
                display='block'
                src='/img/ufe/icons/facebook.svg'
                disableLazyLoad={true}
            />
        </Link>
    );
}

export default wrapFunctionalComponent(FacebookShare, 'FacebookShare');
