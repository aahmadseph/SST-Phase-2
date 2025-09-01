import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { mediaQueries, space, site } from 'style/config';
import { Link, Icon } from 'components/ui';
import Action from 'components/Content/Action';

/* utils */
import mediaUtils from 'utils/Media';
import uiUtils from 'utils/UI';
import anaUtils from 'analytics/utils';

const { Media } = mediaUtils;
const ActionLink = Action(Link);
const SOURCE = 'footer';

class FooterLinks extends BaseClass {
    state = {
        openGroup: null
    };

    render() {
        const { links, parentStyles } = this.props;

        return links ? (
            <React.Fragment>
                {links.map((link, index) => {
                    const listId = `footer_nav${index}`;
                    const headingId = `footer_nav_heading${index}`;
                    const isOpen = index === this.state.openGroup;
                    const linkLabel = link.label;
                    const heading = isSmallUi => (
                        <h2
                            id={isSmallUi ? headingId : null}
                            css={[parentStyles.heading, styles.heading]}
                            children={linkLabel}
                        />
                    );
                    const footerItems = link.items;

                    return (
                        <div
                            key={`footerLinkSet_${index}`}
                            css={parentStyles.gridCol}
                        >
                            <Media lessThan='md'>
                                <hr css={parentStyles.divider} />
                            </Media>
                            <Media lessThan='md'>
                                <Link
                                    data-at={Sephora.debug.dataAt('footer_section_title')}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    width='100%'
                                    paddingY={5}
                                    marginY={-5}
                                    aria-controls={listId}
                                    aria-expanded={isOpen}
                                    onClick={() => {
                                        this.setState(
                                            {
                                                openGroup: isOpen ? null : index
                                            },
                                            !isOpen
                                                ? () => {
                                                    window.scrollTo({
                                                        top:
                                                              document.getElementById(headingId).offsetTop -
                                                              ((uiUtils.getBreakpoint() === 'xs' ? site.headerHeight : 0) + space[5]),
                                                        behavior: 'smooth'
                                                    });
                                                }
                                                : null
                                        );
                                    }}
                                >
                                    {heading(true)}
                                    <Icon
                                        name={isOpen ? 'caretUp' : 'caretDown'}
                                        size={24}
                                    />
                                </Link>
                            </Media>
                            <Media greaterThan='sm'>{heading()}</Media>
                            {Boolean(footerItems?.length) &&
                                footerItems.map((item, subIndex) => {
                                    const Component = ActionLink;
                                    const componentSpecificProps = {
                                        action: item.link,
                                        seoSource: SOURCE,
                                        children: item.label,
                                        dontUseInternalTracking: true
                                    };
                                    const navInfo = anaUtils.buildNavPath(['footer nav', linkLabel, componentSpecificProps.children]);
                                    const prop55 = `footer nav:${componentSpecificProps.children} click`.toLowerCase();

                                    return (
                                        <ul
                                            key={`footerLinkList_${listId}_item_${subIndex}`}
                                            id={listId}
                                            aria-labelledby={headingId}
                                            css={styles.list}
                                            data-at={Sephora.debug.dataAt('footer_links')}
                                            style={isOpen ? { display: 'block' } : null}
                                        >
                                            <li
                                                key={`footerLink_${subIndex}`}
                                                css={{ ':empty': { display: 'none' } }}
                                            >
                                                <Component
                                                    fontSize='sm'
                                                    display='block'
                                                    paddingY={1}
                                                    onClick={() =>
                                                        anaUtils.setNextPageData({
                                                            navigationInfo: navInfo,
                                                            linkData: prop55,
                                                            internalCampaign: componentSpecificProps.children.toLowerCase()
                                                        })
                                                    }
                                                    {...componentSpecificProps}
                                                />
                                            </li>
                                        </ul>
                                    );
                                })}
                        </div>
                    );
                })}
            </React.Fragment>
        ) : null;
    }
}

const styles = {
    list: {
        marginTop: space[1],
        [mediaQueries.smMax]: {
            display: 'none'
        }
    },
    heading: {
        marginBottom: space[2]
    }
};

export default wrapComponent(FooterLinks, 'FooterLinks');
