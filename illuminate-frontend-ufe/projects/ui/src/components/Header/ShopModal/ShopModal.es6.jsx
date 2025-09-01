import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    colors, space, modal, radii
} from 'style/config';
import Modal from 'components/Modal/Modal';
import {
    Link, Icon, Image, Text
} from 'components/ui';
import Action from 'components/Content/Action';

import localeUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';

const ActionLink = Action(Link);

const getText = text => localeUtils.getLocaleResourceFile('components/Header/ShopModal/locales', 'ShopModal')(text);

class ShopModal extends BaseClass {
    state = {
        active: null,
        activeChild: null,
        isPlusExpanded: false
    };

    navItems = ['bottom nav', 'shop'];

    modalBody = React.createRef();

    render() {
        const { items, onDismiss, featuredLinks } = this.props;
        const { active } = this.state;
        const activeItems = active?.items;
        const LinkComponent = ActionLink;

        return (
            <Modal
                isFlyout={true}
                isOpen={true}
                onDismiss={onDismiss}
            >
                <Modal.Header>
                    {active && (
                        <Modal.Back
                            onClick={() => {
                                if (this.state.isPlusExpanded) {
                                    this.navItems.pop();
                                }

                                this.setState(
                                    {
                                        active: null,
                                        activeChild: null,
                                        isPlusExpanded: false
                                    },
                                    () => {
                                        this.resetScroll();
                                        this.navItems.pop();
                                    }
                                );
                            }}
                        />
                    )}
                    <Modal.Title children={active ? active.label : this.props.title} />
                </Modal.Header>
                <Modal.Body
                    ref={this.modalBody}
                    paddingX={null}
                    paddingTop={null}
                    lineHeight='tight'
                >
                    {active &&
                        activeItems.map((childItem, childIndex) => {
                            const childItemProps = { children: childItem.label, action: childItem.link, dontUseInternalTracking: true };

                            if (childItem.titleText === 'COLUMN' || childItem.altText || childItem.type === 'MenuItemColumn' || childItem.media) {
                                return null; // no banners or columns
                            } else if (childItem.componentList || childItem.items) {
                                const isOpenedChild = this.state.activeChild === childIndex;
                                const listId = `shop_nav${childIndex}`;
                                const buttonId = `shop_nav_button${childIndex}`;

                                return (
                                    <React.Fragment key={childIndex.toString()}>
                                        <button
                                            id={buttonId}
                                            aria-controls={listId}
                                            aria-expanded={isOpenedChild}
                                            onClick={() => {
                                                if (this.state.isPlusExpanded || this.navItems.length > 3) {
                                                    this.navItems.pop();
                                                }

                                                this.setState(
                                                    {
                                                        activeChild: isOpenedChild ? null : childIndex,
                                                        isPlusExpanded: !isOpenedChild
                                                    },
                                                    () => {
                                                        this.navItems.push(childItemProps.children.toLowerCase());
                                                        document.getElementById(buttonId).scrollIntoView({
                                                            block: 'start',
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                );
                                            }}
                                            data-at={Sephora.debug.dataAt('shop_cat_lvl_2')}
                                            css={styles.item}
                                        >
                                            {childItemProps.children}
                                            <Icon
                                                name={isOpenedChild ? 'caretUp' : 'caretDown'}
                                                size={24}
                                                css={styles.toggleIcon}
                                            />
                                        </button>
                                        <ul
                                            id={listId}
                                            aria-labelledby={buttonId}
                                            css={styles.nthList}
                                            style={isOpenedChild ? { display: 'block' } : null}
                                        >
                                            {(childItem.componentList || childItem.items).map((nthChild, nthChildIndex) => {
                                                const nthChildProps = {
                                                    children: nthChild.label,
                                                    action: nthChild.link,
                                                    dontUseInternalTracking: true
                                                };

                                                return (
                                                    <li key={nthChildIndex.toString()}>
                                                        <LinkComponent
                                                            {...nthChildProps}
                                                            onClick={() => {
                                                                onDismiss();
                                                                this.navItems.push(nthChildProps.children.toLowerCase());
                                                                this.setNextPageData(5);
                                                            }}
                                                            data-at={Sephora.debug.dataAt('shop_cat_lvl_3')}
                                                            css={[styles.item, styles.itemNth]}
                                                        />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </React.Fragment>
                                );
                            } else {
                                return (
                                    <LinkComponent
                                        {...childItemProps}
                                        key={childIndex.toString()}
                                        onClick={() => {
                                            onDismiss();
                                            this.navItems.push(childItemProps.children.toLowerCase());
                                            this.setNextPageData(4);
                                        }}
                                        data-at={Sephora.debug.dataAt('shop_cat_lvl_2')}
                                        css={styles.item}
                                    />
                                );
                            }
                        })}

                    <div
                        css={styles.categories}
                        style={active ? { display: 'none' } : null}
                    >
                        {items &&
                            items.map((item, index) => {
                                const cardProps = {
                                    key: index.toString(),
                                    ['data-at']: Sephora.debug.dataAt('shop_cat_lvl_1'),
                                    children: (
                                        <>
                                            <span
                                                css={styles.cardLabel}
                                                children={item.titleText || item.label}
                                            />
                                            {(item.imageSource || item.media?.src) && (
                                                <Image
                                                    src={item.imageSource || item.media.src}
                                                    css={styles.cardImage}
                                                />
                                            )}
                                        </>
                                    )
                                };

                                cardProps.action = item.link;
                                cardProps.dontUseInternalTracking = true;

                                if (item.componentList || item.items) {
                                    return (
                                        <button
                                            css={styles.card}
                                            onClick={() => {
                                                this.setState({ active: item }, () => {
                                                    this.resetScroll();
                                                    this.navItems.push((item.titleText || item.label).toLowerCase());
                                                });
                                            }}
                                            {...cardProps}
                                        />
                                    );
                                } else {
                                    return (
                                        <LinkComponent
                                            css={styles.card}
                                            onClick={() => {
                                                onDismiss();
                                                this.navItems.push((item.titleText || item.label).toLowerCase());
                                                this.setNextPageData(3);
                                            }}
                                            {...cardProps}
                                        />
                                    );
                                }
                            })}
                    </div>
                    {featuredLinks?.length && (
                        <div
                            css={styles.featuredLinks}
                            style={active ? { display: 'none' } : null}
                        >
                            <Text
                                children={getText('featured')}
                                is='h2'
                                fontWeight='bold'
                                fontSize='md'
                                marginBottom={4}
                            />
                            {featuredLinks.map((item, index) => {
                                const featuredLinkProps = {
                                    key: index.toString(),
                                    children: (
                                        <>
                                            <Text children={item.titleText || item.label} />
                                        </>
                                    ),
                                    action: item.link
                                };

                                return (
                                    <LinkComponent
                                        css={[styles.featuredLink, index !== item.length - 1 && { marginBottom: '12px' }]}
                                        onClick={onDismiss}
                                        {...featuredLinkProps}
                                    />
                                );
                            })}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        );
    }

    setNextPageData = currentLevel => {
        if (currentLevel !== this.navItems.length) {
            this.navItems.splice(this.navItems.length - 2, 1);
        }

        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(this.navItems)
        });
    };

    resetScroll = () => {
        setTimeout(() => {
            this.modalBody.current.scrollTop = 0;
        });
    };
}

const styles = {
    categories: {
        display: 'grid',
        gap: space[3],
        gridTemplateColumns: 'repeat(2,1fr)',
        marginLeft: modal.paddingX[0],
        marginRight: modal.paddingX[0],
        marginTop: modal.paddingSm
    },
    featuredLinks: {
        marginLeft: modal.paddingX[0],
        marginRight: modal.paddingX[0],
        marginTop: modal.paddingLg
    },
    featuredLink: {
        boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)',
        borderRadius: radii[2],
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        paddingLeft: space[3],
        paddingTop: space[3],
        paddingBottom: space[3]
    },
    item: {
        display: 'flex',
        width: '100%',
        padding: space[4],
        fontWeight: 'var(--font-weight-bold)',
        alignItems: 'center',
        borderBottom: `1px solid ${colors.lightGray}`
    },
    card: {
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: space[2],
        paddingLeft: space[4],
        paddingRight: space[2],
        paddingBottom: space[2],
        borderRadius: radii[2],
        justifyContent: 'space-between',
        fontWeight: 'var(--font-weight-bold)',
        height: 72,
        gap: space[2],
        boxShadow: '0 0 6px rgba(0, 0, 0, 0.2)'
    },
    cardLabel: {
        position: 'relative'
    },
    cardImage: {
        right: 0,
        bottom: 0,
        objectFit: 'contain',
        width: 56,
        height: 56
    },
    nthList: {
        display: 'none',
        borderBottom: `1px solid ${colors.lightGray}`
    },
    itemNth: {
        paddingLeft: space[5],
        borderBottomWidth: 0,
        fontWeight: 'var(--font-weight-normal)'
    },
    toggleIcon: {
        marginLeft: 'auto',
        flexShrink: 0
    }
};

export default wrapComponent(ShopModal, 'ShopModal');
