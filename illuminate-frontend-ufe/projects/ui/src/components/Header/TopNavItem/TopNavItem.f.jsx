import React, { useCallback } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    breakpoints, lineHeights, radii, space
} from 'style/config';
import { Container, Box, Image } from 'components/ui';
import Dropdown from 'components/Dropdown/Dropdown';
import Arrow from 'components/Arrow/Arrow';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import imageUtils from 'utils/Image';
import anaUtils from 'analytics/utils';
import Action from 'components/Content/Action';
import Banner from 'components/Content/Banner';
import Link from 'components/Link/Link';

const ActionBox = Action(Box);
const ActionLink = Action(Link);
const ActionDropdownTrigger = Action(Dropdown.Trigger);

const { getImageSrc } = imageUtils;

function getNavInfo(navLevel, navLevel1, navLevel2) {
    const navInfoArr = ['top nav', navLevel.toLowerCase()];

    if (navLevel1) {
        navInfoArr.push(navLevel1.toLowerCase());
    }

    if (navLevel2) {
        navInfoArr.push(navLevel2.toLowerCase());
    }

    return navInfoArr;
}

const renderItem = (link, isBold, navLevel, navLevel1, navLevel2, source, handleClickRenderItem) => {
    const isLink = link.targetUrl || link.link;
    const Component = isLink ? ActionLink : ActionBox;
    const componentSpecificProps = {
        action: link.link,
        seoSource: source,
        children: link.label,
        dontUseInternalTracking: true,
        arrowDirection: isLink && isBold && 'right',
        arrowPosition: isLink && isBold && 'after'
    };

    return (
        <Component
            css={[styles.item, isLink && styles.hover, isBold && styles.bold]}
            onClick={() => handleClickRenderItem(navLevel, navLevel1, navLevel2, isLink)}
            {...componentSpecificProps}
        />
    );
};

const renderTopLinkWithoutItems = (item, source, handleClickTopLinkWithoutItems) => {
    const Component = ActionBox;
    const componentSpecificProps = { action: item.link, seoSource: source, children: item.label, dontUseInternalTracking: true };

    return (
        <Box
            flexGrow={1}
            display='flex'
        >
            <Component
                key='topNavItemLink'
                css={[styles.topLink, styles.hover]}
                onClick={() => handleClickTopLinkWithoutItems(item.sid, item.label)}
                {...componentSpecificProps}
            />
        </Box>
    );
};

function renderDropdown(item, source, isOpen, handleClickDropdown) {
    const Component = ActionDropdownTrigger;
    const componentSpecificProps = { action: item.link, seoSource: source, dontUseInternalTracking: true };
    const label = item.label;

    return (
        <Component
            key='topNavItemTrigger'
            onClick={() => handleClickDropdown(label)}
            css={styles.topLink}
            style={isOpen ? { zIndex: 2 } : null}
            {...componentSpecificProps}
        >
            {label}
            <div
                css={styles.topLinkArrow}
                style={{
                    transform: `translateY(${isOpen ? 0 : '100%'})`
                }}
            >
                <Arrow
                    size='1.25em'
                    direction='up'
                    css={{ display: 'block' }}
                />
            </div>
        </Component>
    );
}

const renderBanner = (item, link, source, handleClickRenderBanner) => {
    const Component = ActionBox;
    const componentSpecificProps = { action: link.link, seoSource: source };
    const itemLabel = item.label;
    const linkLabel = link.label;
    const imageProps = { src: link.media.src, altText: link.media.altText, width: link.media.width, height: link.media.height };

    return (
        <>
            {link.action ? (
                <Banner
                    {...link}
                    marginTop={0}
                />
            ) : (
                <Component
                    {...componentSpecificProps}
                    onClick={() => handleClickRenderBanner(itemLabel, linkLabel)}
                    css={styles.block}
                >
                    <picture
                        style={{
                            paddingBottom: `${(imageProps.height / imageProps.width) * 100}%`
                        }}
                    >
                        <source
                            media={breakpoints.mdMin}
                            srcSet={getImageSrc(imageProps.src, imageProps.width, true)}
                        />
                        <Image
                            src='/img/ufe/placeholder.png'
                            alt={imageProps.altText}
                            width={imageProps.width}
                            height={imageProps.height}
                            css={styles.bannerImg}
                        />
                    </picture>
                </Component>
            )}
        </>
    );
};

const renderLinks = (item, links, source, handleClickRenderItem, handleClickRenderBanner) => {
    return links.map((link, linkIndex) => {
        const componentProps = { isBanner: link.media, linkItems: link.items, itemLabel: item.label, linkLabel: link.label };

        return (
            <React.Fragment key={`topNavItemLink_${linkIndex}`}>
                {componentProps.isBanner ? (
                    renderBanner(item, link, source, handleClickRenderBanner)
                ) : componentProps.linkItems ? (
                    <>
                        <div css={styles.listHeader}>
                            {renderItem(link, true, componentProps.itemLabel, componentProps.linkLabel, '', source, handleClickRenderItem)}
                        </div>
                        <ul css={styles.list}>
                            {componentProps.linkItems.map((childLink, childIndex) => (
                                <li key={`topNavItemChildLink_${childIndex}`}>
                                    {renderItem(
                                        childLink,
                                        false,
                                        componentProps.itemLabel,
                                        componentProps.linkLabel,
                                        childLink.label,
                                        source,
                                        handleClickRenderItem
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    renderItem(link, true, componentProps.itemLabel, componentProps.linkLabel, '', source, handleClickRenderItem)
                )}
            </React.Fragment>
        );
    });
};

const getMenuSets = items => {
    if (!items) {
        return [];
    }

    return items.reduce((sets, item) => {
        if (item.titleText === 'COLUMN' || item.type === 'MenuItemColumn') {
            sets.push([]);
        } else if (sets.length === 0) {
            sets.push([item]);
        } else {
            sets[sets.length - 1].push(item);
        }

        return sets;
    }, []);
};

const TopNavItem = ({
    index, item, isOpen, source, ...props
}) => {
    const items = item.items;
    const menuSets = getMenuSets(items);

    const handleClickRenderItem = useCallback((navLevel, navLevel1, navLevel2, isLink) => {
        if (isLink) {
            digitalData.page.attributes.productStrings = '';
            const navInfoArr = getNavInfo(navLevel, navLevel1, navLevel2);
            anaUtils.setNextPageData({
                navigationInfo: anaUtils.buildNavPath(navInfoArr),
                internalCampaign: bindingMethods.getInternalCampaign()
            });
        }
    }, []);

    const handleClickRenderBanner = useCallback((itemLabel, linkLabel) => {
        const navInfoArr = getNavInfo(itemLabel, linkLabel, 'image');
        digitalData.page.attributes.productStrings = '';
        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(navInfoArr),
            internalCampaign: bindingMethods.getInternalCampaign() || linkLabel
        });
    }, []);

    const handleClickTopLinkWithoutItems = useCallback((sid, label) => {
        const navInfo = anaUtils.buildNavPath(['top nav', label]);
        digitalData.page.attributes.productStrings = '';
        anaUtils.setNextPageData({
            navigationInfo: navInfo,
            internalCampaign: sid
        });
    }, []);

    const handleClickDropdown = useCallback(label => {
        const navInfo = anaUtils.buildNavPath(['top nav', label]);
        digitalData.page.attributes.productStrings = '';
        anaUtils.setNextPageData({ navigationInfo: navInfo });
    }, []);

    return items ? (
        <Dropdown
            id={`top_nav_drop_${index}`}
            position='static'
            display='flex'
            flexGrow={1}
            {...props}
        >
            {renderDropdown(item, source, isOpen, handleClickDropdown)}
            <Dropdown.Menu
                hasTransition={false}
                paddingY={5}
                borderRadius={null}
                data-at={Sephora.debug.dataAt('cat_dropdown')}
            >
                <Container>
                    <div css={styles.grid}>
                        {menuSets &&
                            menuSets.map((links, menuIndex) => {
                                return (
                                    <div
                                        key={`topNavItemMenu_${menuIndex}`}
                                        css={[styles.col, links[0] && (links[0].altText || links[0].media) && styles.colBanner]}
                                    >
                                        {renderLinks(item, links, source, handleClickRenderItem, handleClickRenderBanner)}
                                    </div>
                                );
                            })}
                    </div>
                </Container>
            </Dropdown.Menu>
        </Dropdown>
    ) : (
        renderTopLinkWithoutItems(item, source, handleClickTopLinkWithoutItems)
    );
};

const styles = {
    topLink: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        lineHeight: lineHeights.tight,
        padding: space[2],
        textAlign: 'center'
    },
    topLinkArrow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transition: 'transform .2s'
    },
    grid: {
        display: 'flex',
        lineHeight: lineHeights.tight,
        marginLeft: -space[3],
        marginRight: -space[3]
    },
    bannerImg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: radii[2]
    },
    col: {
        paddingLeft: space[3],
        paddingRight: space[3],
        width: `${(1 / 6) * 100}%`
    },
    colBanner: {
        width: '25%',
        marginLeft: 'auto',
        '+ *': {
            marginLeft: 0
        }
    },
    listHeader: {
        fontWeight: 'var(--font-weight-bold)',
        ':not(:first-child)': {
            marginTop: space[3]
        }
    },
    list: {
        ':not(:last-child)': {
            marginBottom: space[3]
        }
    },
    item: {
        display: 'inline-block',
        paddingTop: space[2],
        paddingBottom: space[2],
        width: '100%'
    },
    hover: {
        '.no-touch &:hover': {
            textDecoration: 'underline'
        }
    },
    bold: {
        fontWeight: 'var(--font-weight-bold)'
    },
    block: {
        marginBottom: '10px',
        display: 'flex',
        position: 'relative',
        width: '100%'
    }
};

export default wrapFunctionalComponent(TopNavItem, 'TopNavItem');
