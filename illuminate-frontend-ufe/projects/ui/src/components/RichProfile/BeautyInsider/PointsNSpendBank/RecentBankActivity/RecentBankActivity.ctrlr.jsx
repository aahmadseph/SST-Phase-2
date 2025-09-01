import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import profileActions from 'actions/ProfileActions';

import {
    Box, Flex, Text, Link
} from 'components/ui';

import PointsNSpendGrid from 'components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid';
import BankActivityTabs from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BankActivityTabs';
import BIPointsWarnings from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BIPointsWarnings';
import BIPointsDisclaimer from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BIPointsDisclaimer';

import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getAccountHistorySlice } = profileActions;
const NUMBER_OF_ACTIVITIES = 5;
const POINTS_EARNED_TAB = 0;
const POINTS_SPEND_TAB = 1;

class RecentBankActivity extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: POINTS_EARNED_TAB,
            activities: [],
            shouldShowMore: false
        };
    }

    componentDidMount() {
        const profileId = this.props.user.profileId;

        if (profileId) {
            // The API does not offer a property to know if there are next pages,
            // so we have to get NUMBER_OF_ACTIVITIES + 1 to know if there are next pages
            store.dispatch(getAccountHistorySlice(profileId, 0, NUMBER_OF_ACTIVITIES + 1));
        }

        store.setAndWatch('profile.accountHistorySlice', this, data => {
            const activities = data.accountHistorySlice && data.accountHistorySlice.activities;

            if (activities && activities.length) {
                const activitiesToDisplay = activities.slice(0, NUMBER_OF_ACTIVITIES);

                this.setState({
                    activities: this.state.activities.concat(activitiesToDisplay),
                    shouldShowMore: activities.length > NUMBER_OF_ACTIVITIES
                });
            }
        });
    }

    setActiveTab = tab => () => {
        this.setState({ activeTab: tab });
    };

    render() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile(
                'components/RichProfile/BeautyInsider/PointsNSpendBank/RecentBankActivity/locales',
                'RecentBankActivity'
            )
        );

        let TabContent = null;

        switch (this.state.activeTab) {
            case 0:
                TabContent = (
                    <PointsNSpendGrid
                        activities={this.state.activities}
                        type='earned'
                        typeLabel={getText('earnedLabel')}
                    />
                );

                break;
            case 1:
                TabContent = (
                    <PointsNSpendGrid
                        activities={this.state.activities}
                        type='spent'
                        typeLabel={getText('spendLabel')}
                    />
                );

                break;
            default:
                TabContent = null;
        }

        return (
            <div>
                <Flex
                    justifyContent='space-between'
                    alignItems='baseline'
                >
                    <Text
                        is='h2'
                        fontSize='xl'
                        lineHeight='tight'
                        fontFamily='serif'
                        marginBottom={Sephora.isDesktop() ? 5 : 4}
                    >
                        {getText('recentActivityText')}
                    </Text>
                    {this.state.shouldShowMore && (
                        <Link
                            href='/profile/BeautyInsider/MyPoints'
                            color='blue'
                            padding={2}
                            margin={-2}
                        >
                            {getText('viewAllActivityLink')}
                        </Link>
                    )}
                </Flex>
                {this.state.activities.length ? (
                    <div>
                        <BankActivityTabs>
                            <Box
                                disabled={this.state.activeTab === POINTS_EARNED_TAB}
                                onClick={this.setActiveTab(POINTS_EARNED_TAB)}
                            >
                                Points
                            </Box>
                            <Box
                                disabled={this.state.activeTab === POINTS_SPEND_TAB}
                                onClick={this.setActiveTab(POINTS_SPEND_TAB)}
                            >
                                {getText('spendText')}
                            </Box>
                        </BankActivityTabs>
                        {TabContent}
                    </div>
                ) : (
                    <BIPointsWarnings noPoints />
                )}
                <BIPointsDisclaimer />
            </div>
        );
    }
}

export default wrapComponent(RecentBankActivity, 'RecentBankActivity', true);
