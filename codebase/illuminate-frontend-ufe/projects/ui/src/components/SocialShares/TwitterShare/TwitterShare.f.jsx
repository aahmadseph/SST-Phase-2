import React from 'react';
import urlUtils from 'utils/Url';
import { Image } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 450;

function TwitterShare({ link = '', text = '' }) {
    const twitterShareLink = `https://twitter.com/share?url=${link}&text=${encodeURIComponent(text)}`;

    const onClick = e => {
        e.preventDefault();

        const screenWidth = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
                ? document.documentElement.clientWidth
                : screen.width;

        const screenHeight = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
                ? document.documentElement.clientHeight
                : screen.height;

        const left = (screenWidth - POPUP_WIDTH) / 2;
        const top = (screenHeight - POPUP_HEIGHT) / 2;

        urlUtils.openLinkInNewTab(twitterShareLink, `scrollbars=yes,width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left}`);
    };

    return (
        <a
            href={twitterShareLink}
            target='_blank'
            onClick={onClick}
        >
            <Image
                display='block'
                src='/img/ufe/icons/x.svg'
                disableLazyLoad={true}
            />
        </a>
    );
}

export default wrapFunctionalComponent(TwitterShare, 'TwitterShare');
