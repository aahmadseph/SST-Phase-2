/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import anaUtils from 'analytics/utils';

import { colors, space } from 'style/config';

import Dropdown from 'components/Dropdown/Dropdown';
import CommunityContent from 'components/Header/CommunityContent/CommunityContent';
import { Icon } from 'components/ui';

import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';

const { getCommunityUrl } = communityUtils;
const getText = text => localeUtils.getLocaleResourceFile('components/Header/locales', 'Header')(text);

class CommunityDrop extends BaseClass {
    state = {
        isOpen: false
    };

    render() {
        const { isOpen } = this.state;
        const { showBlackSearchHeader } = this.props;

        return (
            <Dropdown
                id='community_drop'
                hasMaxHeight={true}
                onTrigger={(e, isDropdownOpen) => {
                    this.setState({
                        isOpen: isDropdownOpen
                    });
                }}
            >
                <Dropdown.Trigger
                    href={getCommunityUrl()}
                    display='flex'
                    alignItems='center'
                    paddingX={4}
                    height='100%'
                    data-at={Sephora.debug.dataAt('community_header')}
                    onClick={() => {
                        anaUtils.setNextPageData({
                            navigationInfo: anaUtils.buildNavPath(['top nav', 'community', 'community home'])
                        });
                    }}
                >
                    <Icon
                        name={isOpen ? 'communityActive' : 'community'}
                        size={24}
                        marginRight={3}
                        style={{ opacity: !isOpen && !showBlackSearchHeader ? 0.6 : null }}
                    />
                    <span
                        css={isOpen && (showBlackSearchHeader ? styles.triggerLabelActiveWhite : styles.triggerLabelActive)}
                        children={getText('community')}
                    />
                </Dropdown.Trigger>
                <Dropdown.Menu
                    width={this.props.dropWidth}
                    align='center'
                    paddingY={4}
                    data-at={Sephora.debug.dataAt('community_flyout_menu')}
                >
                    <CommunityContent
                        items={this.props.items}
                        firstLevel='top nav'
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const styles = {
    triggerLabel: {
        marginLeft: space[3]
    },
    triggerLabelActive: {
        boxShadow: `0 2px 0 0 ${colors.black}`
    },
    triggerLabelActiveWhite: {
        boxShadow: `0 2px 0 0 ${colors.white}`
    }
};

export default wrapComponent(CommunityDrop, 'CommunityDrop');
