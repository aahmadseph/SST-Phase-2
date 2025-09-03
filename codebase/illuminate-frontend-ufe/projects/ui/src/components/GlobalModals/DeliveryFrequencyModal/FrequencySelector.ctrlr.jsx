/* eslint-disable no-unused-expressions */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

import Chiclet from 'components/Chiclet';
import { Box, Text } from 'components/ui';
import { screenReaderOnlyStyle, breakpoints } from 'style/config';
import { DebouncedResize } from 'constants/events';

const getTextFreq = text =>
    localeUtils.getLocaleResourceFile('components/GlobalModals/DeliveryFrequencyModal/locales', 'DeliveryFrequencyModal')(text);

class FrequencySelector extends BaseClass {
    state = {
        frequencyNum: '',
        frequencyType: '',
        isSmall: null
    };

    constructor(props) {
        super(props);
    }

    handleResize = () => {
        const { isLargeView } = this.state;
        const isSM = window.matchMedia(breakpoints.smMin).matches;

        if (!isLargeView && isSM) {
            this.setState({ isLargeView: true });
        } else if (isLargeView && !isSM) {
            this.setState({ isLargeView: false });
        }
    };

    componentDidMount() {
        this.handleResize();
        this.setState({
            frequencyNum: this.props.replenishmentFreqNum,
            frequencyType: this.props.replenishmentFreqType
        });
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    componentDidUpdate() {
        this.props.handleFrequency({
            freqNum: this.state.frequencyNum,
            freqType: this.state.frequencyType
        });
    }

    render() {
        return (
            <Box
                is='fieldset'
                overflowX='auto'
                css={{ whiteSpace: 'nowrap' }}
            >
                <Text
                    is='legend'
                    css={screenReaderOnlyStyle}
                >
                    {getTextFreq('frequencyNumber')}
                </Text>
                <Box
                    marginBottom={3}
                    marginTop={0}
                >
                    {this.props.frequencyValues &&
                        this.props.frequencyValues.map(item => {
                            return (
                                <Chiclet
                                    key={item}
                                    fontSize={'14px'}
                                    paddingY={3}
                                    paddingX={4}
                                    marginRight={3}
                                    radioProps={{
                                        name: item,
                                        onChange: () => {
                                            this.setState({
                                                frequencyNum: parseInt(item)
                                            });
                                        },
                                        checked: this.state.frequencyNum === parseInt(item)
                                    }}
                                    isLarge={this.props.isMostCommon && parseInt(item) === this.props.replenishmentFreqNum}
                                    children={
                                        this.props.isMostCommon && parseInt(item) === this.props.replenishmentFreqNum
                                            ? `${item} (${getTextFreq('mostCommon')})`
                                            : item
                                    }
                                />
                            );
                        })}
                    <Text display='inline-block'> {getTextFreq('months')}</Text>
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(FrequencySelector, 'FrequencySelector', true);
