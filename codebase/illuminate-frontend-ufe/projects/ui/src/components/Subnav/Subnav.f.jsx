/* eslint-disable object-curly-newline */
import React from 'react';
import Location from 'utils/Location';
import { Container } from 'components/ui';
import FrameworkUtils from 'utils/framework';
import { buttons, colors, fontSizes, radii, space, mediaQueries } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

function Subnav(props) {
    return (
        <div css={styles.root}>
            <Container>
                <nav
                    aria-label={props.ariaLabel}
                    css={styles.nav}
                >
                    <ul css={styles.list}>
                        {props.links.map(item => {
                            const Item = item.link ? 'a' : 'button';

                            return (
                                <li
                                    key={item.label}
                                    css={styles.listItem}
                                >
                                    <Item
                                        href={item.link}
                                        onClick={event => {
                                            if (item.onClick) {
                                                event.preventDefault();
                                                item.onClick();
                                                Location.navigateTo(event, item.link);
                                            }
                                        }}
                                        css={[styles.link, item.isMain && styles.linkMain, item.isActive ? styles.linkActive : styles.linkHover]}
                                        data-at={Sephora.debug.dataAt(item.dataAt)}
                                        children={item.label}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    <div
                        css={styles.children}
                        children={props.children}
                    />
                </nav>
            </Container>
        </div>
    );
}

const styles = {
    root: {
        backgroundColor: colors.white,
        [mediaQueries.xsMax]: {
            borderBottom: `1px solid ${colors.lightGray}`
        },
        [mediaQueries.sm]: {
            boxShadow: `inset 0 -1px 0 0 ${colors.midGray}`,
            backgroundColor: colors.nearWhite
        }
    },
    nav: {
        display: 'flex',
        [mediaQueries.xsMax]: {
            alignItems: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            margin: `0 -${space.container}px`,
            padding: space[2]
        },
        [mediaQueries.sm]: {
            justifyContent: 'space-between'
        }
    },
    list: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        [mediaQueries.sm]: {
            justifyContent: 'space-between',
            alignItems: 'baseline'
        }
    },
    listItem: {
        marginRight: space[2],
        flexShrink: 0,
        [mediaQueries.sm]: {
            marginRight: space[5]
        }
    },
    link: {
        fontSize: fontSizes.sm,
        [mediaQueries.xsMax]: {
            display: 'flex',
            alignItems: 'center',
            height: buttons.HEIGHT_SM,
            paddingLeft: space[3],
            paddingRight: space[3],
            lineHeight: 1,
            border: `1px solid ${colors.midGray}`,
            borderRadius: radii[3]
        },
        [mediaQueries.sm]: {
            display: 'block',
            paddingTop: space[3],
            paddingBottom: space[3],
            borderBottom: '3px solid transparent'
        }
    },
    linkHover: {
        [mediaQueries.xsMax]: {
            ':hover': {
                borderColor: colors.black
            }
        },
        [mediaQueries.sm]: {
            ':hover': {
                textDecoration: 'underline'
            }
        }
    },
    linkMain: {
        [mediaQueries.sm]: {
            fontSize: fontSizes.base,
            fontWeight: 'var(--font-weight-bold)',
            marginRight: space[4]
        }
    },
    linkActive: {
        cursor: 'default',
        [mediaQueries.xsMax]: {
            fontWeight: 'var(--font-weight-bold)'
        },
        [mediaQueries.sm]: {
            borderColor: 'inherit'
        }
    },
    children: {
        display: 'flex',
        flexShrink: 0
    }
};

export default wrapFunctionalComponent(Subnav, 'Subnav');
