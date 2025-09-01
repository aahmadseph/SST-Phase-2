/* eslint-disable ssr-friendly/no-dom-globals-in-react-cc-render */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Button, Text, Flex, Divider, Image
} from 'components/ui';
import { DebouncedResize } from 'constants/events';
import { breakpoints, zIndices } from 'style/config';
import userUtils from 'utils/User';
import ReactDOM from 'react-dom';
import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import Pagination from 'components/ProductPage/Pagination/Pagination';

const getText = localeUtils.getLocaleResourceFile('components/PersonalizedPreviewPlacements/VariationCarousel/locales', 'VariationCarousel');

class VariationCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: false,
            isLoading: true
        };
        this.modalRef = React.createRef();
    }

    get isNonTargetedContent() {
        return this.props.nonTargettedPreviewIndex > -1;
    }

    formatDateRange = (startDate, endDate) => {
        if (!startDate) {
            return '';
        }

        try {
            return `${dateUtils.getDateInDMYwithTimeFormat(startDate)} - ${endDate ? dateUtils.getDateInDMYwithTimeFormat(endDate) : ''}`;
        } catch (error) {
            return '';
        }
    };

    get currentNonTargetedVariationDates() {
        const currentVariation = this.props.variations?.[this.props.activePage - 1];

        return {
            startDate: currentVariation?.cxsSD,
            endDate: currentVariation?.cxsED
        };
    }

    getRuleDates = rule => {
        return rule?.dates || {};
    };

    formatExclude = () => {
        const currentVariation = this.props.variations?.[this.props.activePage - 1];

        const excludeItems = [];

        if (currentVariation?.excludeCountries?.length > 0) {
            excludeItems.push(`countries: [${currentVariation?.excludeCountries.join(', ')}]`);
        }

        if (currentVariation?.excludeChannels?.length > 0) {
            excludeItems.push(`channels: [${currentVariation?.excludeChannels.join(', ')}]`);
        }

        if (currentVariation?.excludeLanguages?.length > 0) {
            excludeItems.push(`languages: [${currentVariation?.excludeLanguages.join(', ')}]`);
        }

        return excludeItems.length > 0 ? `[Exclude { ${excludeItems.join(', ')} }]` : '';
    };

    checkIsMobile = () => {
        this.setState({
            isMobile: window.matchMedia(breakpoints.smMax).matches,
            isLoading: false
        });
    };

    componentDidMount() {
        this.checkIsMobile();
        window.addEventListener(DebouncedResize, this.checkIsMobile);
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.checkIsMobile);
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (!this.modalRef.current?.contains(event.target)) {
            this.props.onClose();
        }
    };

    renderRuleConditions = rule => {
        const conjuction = rule?.conj === 'any' ? 'ANY (OR)' : 'ALL (AND)';
        const isAnonymous = userUtils.isAnonymous();

        if (!isAnonymous) {
            return <Box>{getText('mlActivated')}</Box>;
        }

        return (
            <Box marginTop={2}>
                {rule.isPrioritizationTypeStandard && (
                    <Text
                        is='p'
                        children={conjuction}
                    />
                )}
                {rule?.conditions?.map(item => (
                    <Text
                        is='p'
                        marginTop={2}
                        marginLeft={4}
                        children={item.replace(/[@#$%^"&*()]/g, '')}
                    />
                ))}
            </Box>
        );
    };

    renderNumberedCarousel = (variations, dividerIndex, top, left) => {
        return (
            <Box
                position='absolute'
                top={`${top}px`}
                left={`${left}px`}
                zIndex={zIndices.max}
            >
                <Box
                    height={'fit-content'}
                    border={1}
                    backgroundColor='#06E3FF'
                    width={'375px'}
                >
                    <Flex
                        justifyContent='space-between'
                        padding={4}
                    >
                        <Text
                            children={this.props.sid}
                            fontWeight='bold'
                            fontSize='md'
                            maxWidth={'300px'}
                        />
                        <button
                            type='button'
                            onClick={this.props.onClose}
                        >
                            <Image
                                src='/img/ufe/x-button.svg'
                                alt='close'
                            />
                        </button>
                    </Flex>
                    <Divider color='white' />
                    <Box margin={4}>
                        <Pagination
                            totalPages={variations?.length}
                            dividerIndex={dividerIndex}
                            currentPage={this.props.activePage}
                            customPageNumberStyle={{
                                backgroundColor: '#FFFFFF'
                            }}
                            justifyContent='space-around'
                            handlePageClick={this.props.onClick}
                            minNumberOfPages={0}
                        />
                        <Flex justifyContent='space-between'>
                            <Button
                                children={getText('reset')}
                                variant='secondary'
                                marginTop={4}
                                width={'164px'}
                                onClick={this.props.resetVariation}
                                disabled={this.props.activePage === 0}
                            />
                            <Button
                                children={getText(this.props.isNBCEnabled ? 'showInfo' : 'viewRule')}
                                variant='primary'
                                marginTop={4}
                                width={'164px'}
                                onClick={this.props.viewRuleClick}
                                disabled={this.props.activePage === 0}
                            />
                        </Flex>
                    </Box>
                </Box>
            </Box>
        );
    };

    renderRuleDetailBox = (rule, top, left) => {
        return (
            <Box
                position={this.state.isMobile ? 'fixed' : 'absolute'}
                top={!this.state.isMobile && `${top}px`}
                bottom={this.state.isMobile && '0px'}
                left={!this.state.isMobile && `${left + (userUtils.isAnonymous() ? 400 : 0)}px`}
                zIndex={zIndices.max}
            >
                <Box
                    height={'fit-content'}
                    backgroundColor='#FFFFFF'
                    width={['100vw', '375px']}
                    css={{
                        boxShadow: '0 0 4px 0 rgba(0,0,0,0.2)'
                    }}
                >
                    <Flex
                        justifyContent='space-between'
                        padding={4}
                    >
                        <Text
                            children={getText('componentInfo')}
                            fontWeight='bold'
                            fontSize='md'
                            maxWidth={'300px'}
                        />
                        <button
                            type='button'
                            onClick={this.props.OnRuleClose}
                        >
                            <Image
                                src='/img/ufe/x-button.svg'
                                alt='close'
                            />
                        </button>
                    </Flex>
                    <Divider />
                    <Box padding={4}>
                        <Text
                            children={this.props.sid}
                            is='p'
                            fontSize='md'
                            maxWidth={'300px'}
                        />
                        {this.props.isNBCEnabled ? (
                            this.isNonTargetedContent ? null : (
                                <>
                                    <Text
                                        is='p'
                                        children={getText('performanceAndRules')}
                                        fontWeight='bold'
                                        marginTop={4}
                                    />

                                    {this.renderRuleConditions(rule)}
                                </>
                            )
                        ) : (
                            <>
                                <Text
                                    children={getText('performanceAndRules')}
                                    fontWeight='bold'
                                    marginTop={4}
                                />

                                {this.renderRuleConditions(rule)}
                            </>
                        )}

                        {this.formatExclude() && (
                            <>
                                <Text
                                    is='p'
                                    children={getText('globalContentGuardrails')}
                                    fontWeight='bold'
                                    marginTop={this.props.isNBCEnabled && (this.isNonTargetedContent ? 1 : 4)}
                                />
                                <Text
                                    is='p'
                                    children={this.formatExclude()}
                                    marginTop={2}
                                />
                            </>
                        )}
                        {this.isNonTargetedContent && this.currentNonTargetedVariationDates.startDate && (
                            <Box>
                                <Text
                                    is='p'
                                    marginTop={4}
                                    children={getText('startEndDates')}
                                    fontWeight='bold'
                                />
                                <Text
                                    is='p'
                                    children={this.formatDateRange(
                                        this.currentNonTargetedVariationDates.startDate,
                                        this.currentNonTargetedVariationDates.endDate
                                    )}
                                    marginTop={2}
                                />
                            </Box>
                        )}
                        {!this.isNonTargetedContent && (
                            <Box>
                                <Text
                                    is='p'
                                    marginTop={4}
                                    children={getText('startEndDates')}
                                    fontWeight='bold'
                                />
                                <Text
                                    is='p'
                                    children={this.formatDateRange(this.getRuleDates(rule).startDate, this.getRuleDates(rule).endDate)}
                                    marginTop={2}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    renderModal = () => {
        const {
            position, variations, dividerIndex, isRuleDetailBoxOpen, rule
        } = this.props;

        let top, left;
        const isPromotionType = this.props.contentType === 'promotionList';

        // we need to calc window.scrollY and scrollX as we need to display the modal
        // rendered right below the info icon placement.
        if (this.state.isMobile) {
            left = 4;
            top = position?.top + position?.height + window?.scrollY + 10;
        } else {
            top = position?.top + position?.height + window?.scrollY + 10;
            left = position.left + window?.scrollX;
            left = isPromotionType ? left - 350 : left;
            top = isPromotionType ? top + 200 : top;
        }

        return (
            <div ref={this.modalRef}>
                {userUtils.isAnonymous() && !isPromotionType && this.renderNumberedCarousel(variations, dividerIndex, top + 200, left)}

                {isRuleDetailBoxOpen && this.renderRuleDetailBox(rule, top, left)}
            </div>
        );
    };

    render() {
        if (this.state.isLoading) {
            return null;
        }

        return <div>{ReactDOM.createPortal(this.renderModal(), document.querySelector('body'))}</div>;
    }
}

export default wrapComponent(VariationCarousel, 'VariationCarousel');
