/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Flex } from 'components/ui';
import TooltipModal from 'components/Header/BeautyPreferences/TooltipModal';
import InfoButton from 'components/InfoButton/InfoButton';

class BeautyProfileHeadingTitle extends BaseClass {
    state = {
        tooltipModalIsOpen: false
    };

    showTooltipModal = e => {
        if (this.props.expanded) {
            e.stopPropagation();
        }

        this.setState({ tooltipModalIsOpen: true });
    };

    closeTooltipModal = () => {
        this.setState({ tooltipModalIsOpen: false });
    };

    render() {
        const {
            isColorIQ, title, isPostSignupModal, currentPage, ofText, totalPages
        } = this.props;

        return (
            <>
                <Text
                    is='legend'
                    id='filter_test_heading'
                    className='Link-target'
                    fontWeight='bold'
                    fontSize={!isPostSignupModal && [null, null, 'lg']}
                    width={isPostSignupModal && '100%'}
                    display={isPostSignupModal && 'flex'}
                    css={{
                        flex: 1,
                        alignSelf: 'baseline',
                        ...(isPostSignupModal && { justifyContent: 'space-between' })
                    }}
                >
                    <Flex alignItems='center'>
                        {title}
                        {isColorIQ && (
                            <InfoButton
                                marginLeft={1}
                                onClick={this.showTooltipModal}
                                verticalAlign='middle'
                                size={16}
                            />
                        )}
                    </Flex>
                    {isPostSignupModal && <Text children={`${currentPage} ${ofText} ${totalPages}`} />}
                </Text>
                <TooltipModal
                    close={this.closeTooltipModal}
                    isOpen={this.state.tooltipModalIsOpen}
                />
            </>
        );
    }
}

BeautyProfileHeadingTitle.propTypes = {
    expanded: PropTypes.bool,
    isColorIQ: PropTypes.bool,
    isPostSignupModal: PropTypes.bool,
    title: PropTypes.string.isRequired
};

BeautyProfileHeadingTitle.defaultProps = {
    expanded: false,
    isColorIQ: false,
    isPostSignupModal: false
};

export default wrapComponent(BeautyProfileHeadingTitle, 'BeautyProfileHeadingTitle');
