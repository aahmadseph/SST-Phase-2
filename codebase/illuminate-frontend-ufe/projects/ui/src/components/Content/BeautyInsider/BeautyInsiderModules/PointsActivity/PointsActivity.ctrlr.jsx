/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Text, Flex, Divider, Link, Image
} from 'components/ui';
import mediaUtils from 'utils/Media';
import BeautyInsiderModuleLayout from 'components/Content/BeautyInsider/BeautyInsiderModuleLayout/BeautyInsiderModuleLayout';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderModules/PointsActivity/locales', 'PointsActivity');

const { Media } = mediaUtils;

class PointsActivity extends BaseClass {
    state = {
        activeActivityType: 'points'
    };

    ActivityTypeSelector = () => {
        const options = ['Points', 'Spend'];

        return (
            <Flex
                backgroundColor='lightGray'
                borderRadius='full'
                fontSize='sm'
                width='fit-content'
            >
                {options.map((option, index) => {
                    const isActive = this.state.activeActivityType === option.toLowerCase();

                    return (
                        <Box
                            key={index}
                            disabled={isActive}
                            position='relative'
                            height='24px'
                            paddingX={'1em'}
                            borderRadius='full'
                            border={1}
                            zIndex={isActive && 0}
                            borderColor={isActive ? 'midGray' : 'transparent'}
                            backgroundColor={isActive && 'white'}
                            css={[
                                { outline: 0 },
                                isActive || {
                                    '.no-touch &:hover': {
                                        textDecoration: 'underline'
                                    }
                                }
                            ]}
                            onClick={e => {
                                e.preventDefault();
                                this.setState({
                                    activeActivityType: option.toLowerCase()
                                });
                            }}
                            children={option}
                        />
                    );
                })}
            </Flex>
        );
    };

    renderDateSection = item => {
        return (
            <>
                <Text
                    is='p'
                    children={dateUtils.formatDateMDY(item.activityDate, true)}
                />
                <Text
                    is='p'
                    children={item.location}
                />
            </>
        );
    };

    renderInfoSection = item => {
        return (
            <>
                <Text
                    is='p'
                    children={item.activityType}
                />
                <Text
                    is='p'
                    children={item.description}
                />
                <Text is='p'>
                    {`${getText('orderNumber')}: `}
                    <Link
                        color='blue'
                        underline={true}
                        children={item.orderID}
                        href={`/profile/orderdetail/${item.orderID}`}
                    />
                </Text>
            </>
        );
    };

    renderpointsEarnedOrRedeemedSection = (item, isSmui = false) => {
        return (
            <>
                <Text
                    is='p'
                    children={`${item.pointsUpdate < 0 ? getText('pointsRedeemed') : getText('pointsearned')}:`}
                    {...(isSmui ? { display: 'inline' } : {})}
                />
                <Text
                    is='p'
                    fontWeight='bold'
                    children={item.pointsUpdate > 0 ? ` +${item.pointsUpdate}` : ` ${item.pointsUpdate}`}
                    color={item.pointsUpdate < 0 ? 'red' : 'green'}
                    {...(isSmui ? { display: 'inline' } : {})}
                />
            </>
        );
    };

    renderPointsOrSpentToDateSection = (item, isSmui = false) => {
        return (
            <>
                <Text
                    is='p'
                    children={`${this.state.activeActivityType === 'points' ? getText('totalPoints') : getText('spentToDate')}:`}
                    {...(isSmui ? { display: 'inline' } : {})}
                />
                <Text
                    is='p'
                    fontWeight='bold'
                    children={this.state.activeActivityType === 'points' ? ` ${item.pointsBalance}` : ` $${item.ytdSpend}`}
                    {...(isSmui ? { display: 'inline' } : {})}
                />
            </>
        );
    };

    renderLGUI = item => {
        return (
            <>
                <Flex marginTop={5}>
                    <Box flex={1}>{this.renderDateSection(item)}</Box>
                    <Box flex={1}>{this.renderInfoSection(item)}</Box>
                    <Box flex={1}>{this.renderpointsEarnedOrRedeemedSection(item)}</Box>
                    <Box flex={1}>{this.renderPointsOrSpentToDateSection(item)}</Box>
                </Flex>
                <Divider marginTop={4} />
            </>
        );
    };

    renderSMUI = item => {
        return (
            <>
                <Flex
                    marginTop={4}
                    justifyContent='space-between'
                >
                    <Box>
                        <Box marginBottom={4}>{this.renderDateSection(item)}</Box>
                        <Box marginBottom={4}>{this.renderInfoSection(item)}</Box>
                        {this.renderpointsEarnedOrRedeemedSection(item, true)}
                    </Box>
                    <Box>{this.renderPointsOrSpentToDateSection(item, true)}</Box>
                </Flex>
                <Divider marginTop={4} />
            </>
        );
    };

    contentZone = itemsToRender => {
        if (!itemsToRender?.length) {
            return (
                <Box>
                    <Image
                        display='block'
                        size={[48, 120]}
                        marginBottom={[3, 4]}
                        src='/img/ufe/no-points.svg'
                    />
                    <Text
                        is='p'
                        marginBottom={3}
                        children={getText('noPoints')}
                    />
                    <Text
                        is='p'
                        children={getText('doNotSeePoints')}
                    />
                </Box>
            );
        }

        return (
            <>
                {this.ActivityTypeSelector()}
                <Divider marginTop={5} />
                <Media greaterThan='sm'>{itemsToRender.map(item => this.renderLGUI(item))}</Media>
                <Media lessThan='md'>{itemsToRender.map(item => this.renderSMUI(item))}</Media>
            </>
        );
    };

    render() {
        const headerCtaTitle = () => {
            if (this.props.content?.meta?.totalItems <= this.props.content?.activities?.length) {
                return null;
            } else {
                return (
                    <Link
                        color='blue'
                        children={getText('viewAll')}
                        href='/profile/BeautyInsider/MyPoints'
                    />
                );
            }
        };

        return (
            <BeautyInsiderModuleLayout
                title={getText('title')}
                isSingleContentZone={true}
                headerCtaTitle={headerCtaTitle()}
                content={this.contentZone(this.props.content?.activities)}
            />
        );
    }
}

export default wrapComponent(PointsActivity, 'PointsActivity');
