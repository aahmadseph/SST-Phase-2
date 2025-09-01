/*eslint-disable class-methods-use-this*/
import React from 'react';
import store from 'store/Store';
import { wrapComponent } from 'utils/framework';
import BankActivityTabs from 'components/RichProfile/BeautyInsider/PointsNSpendBank/BankActivityTabs';
import PointsNSpendGrid from 'components/RichProfile/BeautyInsider/PointsNSpendBank/PointsNSpendGrid/PointsNSpendGrid';

import BaseClass from 'components/BaseClass';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import {
    Grid, Text, Flex, Box, Image, Divider, Link
} from 'components/ui';
import profileActions from 'actions/ProfileActions';

const { getAccountHistorySlice } = profileActions;
const NUMBER_OF_ACTIVITIES = 3;
const POINTS_EARNED_TAB = 0;
const POINTS_SPEND_TAB = 1;

class RecentPointsActivity extends BaseClass {
    state = {
        activeTab: POINTS_EARNED_TAB,
        hasPoints: false,
        activities: [],
        hasMore: false
    };

    componentDidMount() {
        const profileId = this.props.user.profileId;

        if (profileId) {
            store.dispatch(getAccountHistorySlice(profileId, 0, NUMBER_OF_ACTIVITIES));
        }

        store.setAndWatch('profile.accountHistorySlice', this, data => {
            const { accountHistorySlice } = data;
            const activities = accountHistorySlice && accountHistorySlice.activities;

            if (activities && activities.length) {
                const activitiesToDisplay = activities.slice(0, NUMBER_OF_ACTIVITIES);
                const totalItems = accountHistorySlice && accountHistorySlice.meta && accountHistorySlice.meta.totalItems;

                this.setState({
                    hasPoints: true,
                    activities: activitiesToDisplay,
                    hasMore: activitiesToDisplay.length < totalItems
                });
            }
        });
    }

    setActiveTab = tab => () => {
        this.setState({ activeTab: tab });
    };

    render() {
        const { hasPoints, hasMore } = this.state;

        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/RecentPointsActivity/locales', 'RecentPointsActivity')
        );

        return (
            <React.Fragment>
                <Grid
                    alignItems='baseline'
                    lineHeight='tight'
                    marginBottom={[4, 6]}
                    columns={['1fr auto', '1fr auto 1fr']}
                >
                    <Box display={['none', 'block']} />
                    <Text
                        is='h2'
                        fontFamily='serif'
                        fontSize={['xl', '2xl']}
                        children={getText('pointsActivity')}
                    />
                    <Flex justifyContent='flex-end'>
                        {hasMore && (
                            <Link
                                padding={2}
                                margin={-2}
                                arrowDirection='right'
                                href='/profile/BeautyInsider/MyPoints'
                                children={getText('viewAll')}
                            />
                        )}
                    </Flex>
                </Grid>
                {hasPoints ? (
                    this.renderPointsActivity()
                ) : (
                    <Box textAlign='center'>
                        <Image
                            display='block'
                            size={128}
                            marginX='auto'
                            marginBottom={4}
                            src='/img/ufe/no-points.svg'
                        />
                        <Text is='p'>
                            {getText('noPoints')}
                            <br />
                            {getText('doNotSeePoints')}
                        </Text>
                    </Box>
                )}
            </React.Fragment>
        );
    }
    renderPointsActivity() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/RecentPointsActivity/locales', 'RecentPointsActivity')
        );
        const activities = this.state.activities;
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
            <Box marginTop={[2, 0]}>
                <Divider
                    display={['none', 'block']}
                    thick={true}
                    marginBottom={2}
                />
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
                <Text
                    is='p'
                    marginTop={[4, 5]}
                    color='gray'
                    lineHeight='tight'
                >
                    {getText('doNotSeePoints')}
                </Text>
            </Box>
        );
    }
}

export default wrapComponent(RecentPointsActivity, 'RecentPointsActivity', true);
