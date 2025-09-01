/* eslint-disable class-methods-use-this */

import React from 'react';
import BaseClass from 'components/BaseClass';
import {
    Flex, Text, Box, Icon, Link
} from 'components/ui';
import { wrapComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import { colors, space } from 'style/config';
import userLocationUtils from 'utils/UserLocation';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class ZipCodeLocator extends BaseClass {
    state = {
        isSDUAvailable: false,
        zipCodeUpdated: null,
        hasPreferredZipCode: false
    };

    openZipCodeLocator = () => {
        this.props.showShippingDeliveryLocationModal({
            isOpen: true,
            options: { skipZipCodeUpdate: !this.props.fromChooseOptionsModal },
            callback: ({ sameDayAvailable, zipCode }) => {
                this.setState({
                    isSDUAvailable: sameDayAvailable,
                    zipCodeUpdated: zipCode,
                    hasPreferredZipCode: true
                });

                this.props.updateZipCodeEligible({ sameDayAvailable, zipCode });
            },
            sduZipcodeModal: true,
            isUserSDUTrialEligible: this.props.isUserSDUTrialEligible
        });

        digitalData.page.attributes.previousPageData.pageName = 'same-day unlimited:enter zip code:n/a:*';
    };

    checkZipCodeEligibility = zipCode => {
        userLocationUtils.updatePreferredZipCode({ postalCode: zipCode, skipZipCodeUpdate: true }).then(res => {
            this.setState({
                isSDUAvailable: res.sameDayAvailable,
                zipCodeUpdated: res.zipCode,
                hasPreferredZipCode: true
            });

            this.props.updateZipCodeEligible({ sameDayAvailable: res.sameDayAvailable, zipCode });

            if (!this.state.isSDUAvailable) {
                this.fireAnalytics('unavailable');
            }
        });
    };

    analyticsMap = {
        unavailable: () => ({
            method: anaConsts.LINK_TRACKING_EVENT,
            prop55: `${anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED}:${anaConsts.PAGE_DETAIL.ZIP_CODE_UNAVAILABLE}`
        })
    };

    fireAnalytics = type => {
        const { method, prop55 } = this.analyticsMap[type](this.state);
        processEvent.process(method, {
            data: {
                ...(method === anaConsts.LINK_TRACKING_EVENT && {
                    actionInfo: prop55
                })
            }
        });
    };

    componentDidMount() {
        const { preferredZipCode, zipCode } = this.props;
        preferredZipCode && this.checkZipCodeEligibility(zipCode);
        this.setState({
            hasPreferredZipCode: !!preferredZipCode
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.preferredZipCode && (prevProps.preferredZipCode === undefined || prevProps.preferredZipCode !== this.props.preferredZipCode)) {
            this.checkZipCodeEligibility(this.props.zipCode);
        }
    }

    render() {
        const {
            SDUAvailable, SDUUnavailable, noSephoraLocations, checkOtherZipCode, tapToSeeAvailability, yourLocation
        } = this.props;
        const { zipCodeUpdated, hasPreferredZipCode, isSDUAvailable } = this.state;

        const link = (
            <Link
                css={styles.bold}
                onClick={this.openZipCodeLocator}
                arrowDirection='down'
                children={hasPreferredZipCode ? zipCodeUpdated : yourLocation}
            />
        );

        return (
            <Box css={styles.container}>
                <div
                    css={`
                        ${hasPreferredZipCode ? { ...styles.zipCodeContainer } : { ...styles.zipCodeContainer, ...styles.noPreferredZipCode }}
                    `}
                >
                    <Flex
                        css={`
                            ${hasPreferredZipCode && !isSDUAvailable && styles.spacer}
                        `}
                    >
                        {isSDUAvailable ? (
                            <Flex alignItems='center'>
                                <Flex css={{ ...styles.checkmark, ...styles.icon }}>
                                    <Icon
                                        css={styles.checkmarkIcon}
                                        name='checkmark'
                                    />
                                </Flex>
                                <Box
                                    ml={2}
                                    mr={1}
                                >
                                    {SDUAvailable}
                                </Box>
                                {link}
                            </Flex>
                        ) : (
                            <Flex alignItems='center'>
                                {hasPreferredZipCode && (
                                    <Icon
                                        name='alert'
                                        css={{ ...styles.icon, ...styles.warning }}
                                    />
                                )}
                                <Box
                                    ml={hasPreferredZipCode ? 2 : 0}
                                    mr={1}
                                >
                                    {hasPreferredZipCode ? SDUUnavailable : tapToSeeAvailability}
                                </Box>
                                {link}
                            </Flex>
                        )}
                    </Flex>
                </div>
                {!hasPreferredZipCode || isSDUAvailable || (
                    <Text
                        is='p'
                        css={styles.subtitle}
                    >
                        {`${noSephoraLocations} `}
                        <Link
                            onClick={this.openZipCodeLocator}
                            children={checkOtherZipCode}
                            underline={true}
                            color='blue'
                        />
                    </Text>
                )}
            </Box>
        );
    }
}

const styles = {
    container: {
        padding: `${space[3]}px`,
        border: `${space[2]}px`,
        borderColor: `${colors.midGray}`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: `${space[1]}px`
    },
    zipCodeContainer: {
        position: 'relative',
        padding: '0 0 0 25px'
    },
    noPreferredZipCode: {
        padding: '0'
    },
    spacer: {
        marginBottom: `${space[2]}px`
    },
    icon: {
        borderRadius: '50%'
    },
    checkmarkIcon: {
        fontSize: '1.25em',
        padding: `${space[1]}px`,
        size: '0.65em'
    },
    checkmark: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'full',
        backgroundColor: `${colors.green}`,
        color: `${colors.white}`,
        lineHeight: '1em'
    },
    warning: {
        fontSize: '1.25em',
        color: `${colors.red}`
    },
    bold: {
        fontWeight: 'bold'
    },
    subtitle: {
        display: 'block',
        color: `${colors.gray}`
    }
};

ZipCodeLocator.defaultProps = {};

ZipCodeLocator.propTypes = {
    SDUAvailable: PropTypes.string.isRequired,
    SDUUnavailable: PropTypes.string.isRequired,
    yourLocation: PropTypes.string.isRequired,
    noSephoraLocations: PropTypes.string.isRequired,
    preferredZipCode: PropTypes.string,
    zipCode: PropTypes.string.isRequired,
    fromChooseOptionsModal: PropTypes.bool
};

export default wrapComponent(ZipCodeLocator, 'ZipCodeLocator');
