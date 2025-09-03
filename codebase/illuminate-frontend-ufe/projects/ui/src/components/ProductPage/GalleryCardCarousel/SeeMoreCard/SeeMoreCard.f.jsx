import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import languageLocale from 'utils/LanguageLocale';

const { getLink } = urlUtils;

const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/GalleryCardCarousel/SeeMoreCard/locales', 'SeeMoreCard')(text);

const SeeMoreCard = props => {
    const { style } = props;

    return (
        <button
            data-at={Sephora.debug.dataAt('see_more_in_the_gallery_btn')}
            onClick={e => {
                const targetUrl = getLink('/community/gallery');
                Location.navigateTo(e, targetUrl);
            }}
            css={[style, styles.root]}
        >
            <span css={styles.inner}>
                {getText('seeMore')}
                <br />
                {getText('inTheGallery')}
                <svg css={styles.icon}>
                    <path d='M44 0v22H30v11H0V11h14V0h30zM28 13H2v18h26V13zM42 2H16v9h14v9h12V2z' />
                </svg>
            </span>
        </button>
    );
};

const styles = {
    root: {
        position: 'relative',
        paddingBottom: '100%',
        backgroundColor: colors.lightGray,
        alignSelf: 'flex-start'
    },
    inner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 'var(--font-weight-bold)'
    },
    icon: {
        width: 44,
        height: 33,
        marginTop: '1em'
    }
};

export default wrapFunctionalComponent(SeeMoreCard, 'SeeMoreCard');
