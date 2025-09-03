import React, { useEffect, useRef, useState } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Chiclet from 'components/Chiclet';
import { Container, Divider, Flex } from 'components/ui';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import mediaUtils from 'utils/Media';
import { breakpoints } from 'style/config';

const { Media } = mediaUtils;

export const MOBILE_HEADER_HEIGHT = 53;

function SimpleChicletNav(props) {
    const { dispatch, handle, menuItems } = props;

    if (!menuItems) {
        return null;
    }

    const { navigateTo } = useNavigateTo(dispatch);

    const sentinelRef = useRef(null);
    const mobileNavRef = useRef(null);
    const desktopNavRef = useRef(null);

    const [isFixed, setIsFixed] = useState(false);
    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        // Determine current screen size and measure nav height
        const isMobile = window.matchMedia(breakpoints.smMax).matches;
        const headerOffset = isMobile ? MOBILE_HEADER_HEIGHT : 0;

        const navRef = isMobile ? mobileNavRef : desktopNavRef;

        if (navRef.current) {
            setNavHeight(navRef.current.getBoundingClientRect().height);
        }

        // Observer setup
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFixed(!entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
                rootMargin: `-${headerOffset}px 0px 0px 0px`
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);

    const handleChicletClick = async (event, link) => {
        event.preventDefault();

        const basePath = `/creators/${handle}`;
        const targetURL = link === '/' ? basePath : `${basePath}/${String(link).replace(/^\//, '')}`;

        await navigateTo(targetURL, false, true);
    };

    // Shared chiclet content renderer
    const renderChicletContent = () => (
        <>
            <Divider />
            <Container>
                <Flex
                    alignItems='center'
                    gap={2}
                    paddingY={'7px'}
                    overflowX='auto'
                    css={styles.chicletWrap}
                    data-at={Sephora.debug.dataAt('category_chiclets')}
                >
                    {menuItems.map((item, index) => (
                        <Chiclet
                            key={index.toString()}
                            variant='outline'
                            onClick={event => handleChicletClick(event, item.link)}
                            children={item.title}
                            isActive={item.isActive}
                            customPaddingX='10px'
                            isLarge
                        />
                    ))}
                </Flex>
            </Container>
            <Divider />
        </>
    );

    return (
        <>
            {/* Invisible marker above the nav to track when it's at the top */}
            <div
                ref={sentinelRef}
                css={{ height: 1 }}
            />

            {/* Mobile version */}
            <Media lessThan='md'>
                {isFixed && <div css={{ height: navHeight }} />}
                <div
                    ref={mobileNavRef}
                    css={isFixed ? styles.mobileNavFixed : styles.navRelative}
                >
                    {renderChicletContent()}
                </div>
            </Media>

            {/* Desktop version */}
            <Media greaterThanOrEqual='md'>
                <>
                    {/* Fixed nav with transition – only shown once scrolled */}
                    {isFixed && (
                        <>
                            <div css={{ height: navHeight }} />
                            <div css={styles.desktopNavFixed}>{renderChicletContent()}</div>
                        </>
                    )}

                    {/* Default nav in flow – shown only when not fixed */}
                    {!isFixed && (
                        <div
                            ref={desktopNavRef}
                            css={styles.navRelative}
                        >
                            {renderChicletContent()}
                        </div>
                    )}
                </>
            </Media>
        </>
    );
}

const styles = {
    chicletWrap: {
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
    },
    navRelative: {
        position: 'relative',
        top: 'auto',
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#fff',
        width: '100%',
        transition: 'box-shadow 0.3s ease'
    },
    mobileNavFixed: {
        position: 'fixed',
        top: `${MOBILE_HEADER_HEIGHT}px`,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#fff',
        width: '100%',
        transition: 'box-shadow 0.3s ease'
    },
    desktopNavFixed: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#fff',
        width: '100%',
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'transform 0.3s ease, opacity 0.3s ease'
    }
};

export default wrapFunctionalComponent(SimpleChicletNav, 'SimpleChicletNav');
