import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import profileActions from 'actions/ProfileActions';

import { Box, Text, Link } from 'components/ui';
import PointsNSpendGrid from 'components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid';
import BankActivityTabs from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BankActivityTabs';
import BIPointsWarnings from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BIPointsWarnings';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';

import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getAccountHistorySlice } = profileActions;

const NUMBER_OF_ACTIVITIES = 10;
const POINTS_EARNED_TAB = 0;
const POINTS_SPEND_TAB = 1;
const MAX_ACTIVITIES = 150;

class AllBankActivity extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: POINTS_EARNED_TAB,
            activities: [],
            offset: 0,
            shouldShowMore: false
        };
    }

    componentDidMount() {
        this.getAccountHistorySlice();

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

    getAccountHistorySlice = () => {
        const profileId = this.props.user.profileId;

        if (profileId) {
            // The API does not offer a property to know if there are next pages,
            // so we have to get NUMBER_OF_ACTIVITIES + 1 to know if there are next pages
            store.dispatch(getAccountHistorySlice(profileId, this.state.offset, NUMBER_OF_ACTIVITIES + 1));
        }
    };

    showMoreActivities = e => {
        e.preventDefault();

        this.setState({ offset: this.state.offset + NUMBER_OF_ACTIVITIES }, () => {
            this.getAccountHistorySlice();
        });
    };

    setActiveTab = tab => () => {
        this.setState({ activeTab: tab });
    };

    render() {
        const isMobile = Sephora.isMobile();
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/PointsNSpendBank/AllBankActivity/locales', 'AllBankActivity')
        );

        let activities = this.state.activities;

        const hasReachedMaxActivities = activities.length === MAX_ACTIVITIES;

        if (hasReachedMaxActivities) {
            activities = activities.slice(0, MAX_ACTIVITIES);
        }

        let TabContent = null;

        switch (this.state.activeTab) {
            case 0:
                TabContent = (
                    <PointsNSpendGrid
                        activities={activities}
                        type='earned'
                        typeLabel={getText('earnedLabel')}
                        total={getText('earnedTotal')}
                    />
                );

                break;
            case 1:
                TabContent = (
                    <PointsNSpendGrid
                        activities={activities}
                        type='spent'
                        typeLabel={getText('spendLabel')}
                        total={getText('spendTotal')}
                    />
                );

                break;
            default:
                TabContent = null;
        }

        return (
            <LegacyContainer>
                <Link
                    href='/profile/BeautyInsider'
                    paddingY={4}
                    marginBottom={isMobile || -4}
                    arrowDirection='left'
                    arrowPosition='before'
                    children={getText('backLink')}
                />
                <Text
                    is='h1'
                    fontSize={isMobile ? 'xl' : '2xl'}
                    textAlign={isMobile || 'center'}
                    lineHeight='tight'
                    fontFamily='serif'
                    paddingBottom={isMobile ? 4 : 5}
                    borderBottom={2}
                    borderColor='nearWhite'
                    marginBottom={2}
                >
                    {getText('title')}
                </Text>
                {activities.length ? (
                    <div>
                        <BankActivityTabs>
                            <Box
                                disabled={this.state.activeTab === POINTS_EARNED_TAB}
                                onClick={this.setActiveTab(POINTS_EARNED_TAB)}
                            >
                                {getText('pointsText')}
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
                {hasReachedMaxActivities && (
                    <Text
                        is='p'
                        textAlign='center'
                        padding={4}
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginTop={4}
                        fontWeight='medium'
                    >
                        {getText('recentRecordsText', false, MAX_ACTIVITIES)}
                    </Text>
                )}
                {this.state.shouldShowMore && !hasReachedMaxActivities && (
                    <Link
                        fontSize={isMobile && 'sm'}
                        padding={4}
                        display='block'
                        marginX='auto'
                        arrowDirection='down'
                        onClick={this.showMoreActivities}
                    >
                        {getText('viewMoreTransactionsText')}
                    </Link>
                )}
            </LegacyContainer>
        );
    }
}

export default wrapComponent(AllBankActivity, 'AllBankActivity');
