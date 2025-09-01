/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import TargetedLandingContent from 'components/Content/TargetedLandingPromotion/TargetedLandingContent';
import TargetedLandingErrorContent from 'components/Content/TargetedLandingPromotion/TargetedLandingErrorContent';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import { ERROR_TYPES } from 'constants/targetedLandingPromotionConstants';
import sdnApi from 'services/api/sdn';
import { getContent } from 'services/api/Content/getContent';
import targetedLandingPromotionPageBindings from 'analytics/bindingMethods/pages/targetedLandingPromotion/targetedLandingPromotionPageBindings';

const { validatePromo } = sdnApi;

class TargetedLandingPromotion extends BaseClass {
    state = {
        hasErrors: false,
        errorType: null,
        isLoading: true,
        startDate: null,
        endDate: null,
        content: null
    };

    getContentfulContent = () => {
        const { country, language } = Sephora.renderQueryParams;

        getContent({
            language,
            country,
            path: `/promotion/${urlUtils.getParamsByName('promocode')?.[0]}`
        })
            .then(({ data }) => {
                if (data) {
                    if (data.legacy) {
                        this.setState({
                            isLoading: false,
                            hasErrors: true,
                            errorType: ERROR_TYPES.PROMOTION_NOT_FOUND
                        });
                    } else {
                        this.setState(
                            {
                                content: data
                            },
                            () => {
                                if (this.props.user.isInitialized && !userUtils.isAnonymous()) {
                                    this.promoValidation();
                                }
                            }
                        );
                    }
                } else {
                    this.setState({
                        isLoading: false,
                        hasErrors: true,
                        errorType: ERROR_TYPES.PROMOTION_NOT_FOUND
                    });
                }
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    hasErrors: true,
                    errorType: ERROR_TYPES.PROMOTION_NOT_FOUND
                });
            });
    };

    componentDidMount() {
        if (this.props.user?.isInitialized && !userUtils.isAnonymous()) {
            this.getContentfulContent();
        }

        targetedLandingPromotionPageBindings.setPageLoadAnaytics();
    }

    promoValidation = () => {
        const { biAccountId, beautyInsiderAccount = {} } = this.props.user || {};
        validatePromo({
            customerID: biAccountId || beautyInsiderAccount?.biAccountId,
            promoId: this.state.content?.promotionId
        })
            .then(data => {
                if (data.success) {
                    this.setState({
                        isLoading: false,
                        hasErrors: false,
                        errorType: null,
                        startDate: data.startDate,
                        endDate: data.endDate
                    });
                } else if (!data.success && data.messageType === 'ERROR') {
                    let errorType, isEndDateInPast;

                    if (data.endDate) {
                        const date = new Date(data.endDate);
                        date.setDate(date.getDate() + 14);
                        isEndDateInPast = date.getTime() < new Date().getTime();
                    }

                    if (
                        (data.message === ERROR_TYPES.PROMOTION_NOT_ACTIVE || data.message === ERROR_TYPES.SEGMENT_NOT_ACTIVE) &&
                        (!data.endDate || isEndDateInPast)
                    ) {
                        errorType = ERROR_TYPES.PROMOTION_NOT_ACTIVE;
                    } else {
                        errorType = ERROR_TYPES.CUSTOMER_IS_NOT_IN_SEGMENT;
                    }

                    this.setState({
                        isLoading: false,
                        hasErrors: true,
                        errorType
                    });
                }
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    hasErrors: true,
                    errorType: ERROR_TYPES.PROMOTION_NOT_FOUND
                });
            });
    };

    componentDidUpdate(prevProps) {
        if (this.props.user?.isInitialized && (!prevProps.user.isInitialized || this.props.auth.profileStatus !== prevProps.auth.profileStatus)) {
            if (userUtils.isAnonymous()) {
                this.setState({
                    hasErrors: true,
                    errorType: ERROR_TYPES.ANONYMOUS,
                    isLoading: false
                });
            } else {
                this.getContentfulContent();
            }
        }
    }

    render() {
        if (!this.props.user?.isInitialized || this.state.isLoading) {
            return null;
        }

        return this.state.hasErrors ? (
            <TargetedLandingErrorContent errorType={this.state.errorType} />
        ) : (
            <TargetedLandingContent
                data={this.state.content}
                promoStartDate={this.state.startDate}
                promoEndDate={this.state.endDate}
            />
        );
    }
}

export default wrapComponent(TargetedLandingPromotion, 'TargetedLandingPromotion', true);
