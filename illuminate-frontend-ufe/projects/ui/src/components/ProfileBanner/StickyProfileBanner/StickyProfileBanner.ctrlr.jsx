/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import { Box, Image, Text } from 'components/ui';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import {
    colors, mediaQueries, space, zIndices, site
} from 'style/config';
import { DebouncedScroll } from 'constants/events';

const BI_TYPES = userUtils.types;
const getText = localeUtils.getLocaleResourceFile('components/ProfileBanner/locale', 'ProfileBanner');

class StickyProfileBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: 0,
            showBanner: false
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener(DebouncedScroll, this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedScroll, this.handleScroll);
    }

    handleScroll = () => {
        if (this.state.initialPosition === 0) {
            this.setState({ initialPosition: this.scrollRef.current.offsetTop });
        }

        if (this.scrollRef.current.offsetTop > this.state.initialPosition) {
            if (!this.state.showBanner) {
                this.setState({ showBanner: true });
            }
        } else {
            if (this.state.showBanner) {
                this.setState({ showBanner: false });
            }
        }
    };
    render() {
        const { netBeautyBankPointsAvailable } = this.props;
        const biStatus = userUtils.getBiStatus();
        const statusDisplay = userUtils.displayBiStatus(biStatus);
        const statusText = biStatus === BI_TYPES.BI ? 'insiderText' : 'vibText';
        const logoProps = {
            src: `/img/ufe/bi/new-logo-${statusDisplay.toLowerCase()}.svg`,
            height: 11,
            alt: statusDisplay
        };

        return (
            <Box
                paddingX={4}
                paddingY={3}
                boxShadow={'light'}
                css={[styles.stickyBanner, !this.state.showBanner && styles.hide]}
                ref={this.scrollRef}
            >
                <Text
                    is='p'
                    lineHeight={'tight'}
                >
                    {getText(statusText)}
                    <Image
                        {...logoProps}
                        marginX={1}
                    />
                    {getText('with')}
                    <strong>{netBeautyBankPointsAvailable}</strong>
                    {getText('points')}
                </Text>
            </Box>
        );
    }
}

const styles = {
    stickyBanner: {
        display: 'block',
        position: 'sticky',
        top: site.headerHeight,
        marginLeft: -space.container,
        marginTop: -space.container,
        marginBottom: '-26px', //account for size of banner minus negative top margin since it needs to stay in DOM
        backgroundColor: colors.white,
        width: '100vw',
        zIndex: zIndices.fixedBar,
        [mediaQueries.sm]: {
            display: 'none'
        }
    },
    hide: {
        opacity: 0
    }
};

StickyProfileBanner.propTypes = {
    netBeautyBankPointsAvailable: PropTypes.number
};

StickyProfileBanner.defaultProps = {
    netBeautyBankPointsAvailable: 0
};

export default wrapComponent(StickyProfileBanner, 'StickyProfileBanner', true);
