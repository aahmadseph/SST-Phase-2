import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { lineHeights, fontSizes } from 'style/config';
import { Box, Link, Text } from 'components/ui';
import BccRwdCopy from 'components/Bcc/BccRwdCopy/BccRwdCopy';
import RichText from 'components/Content/RichText';

import localeUtils from 'utils/LanguageLocale';
import keyConsts from 'utils/KeyConstants';
import { DebouncedResize } from 'constants/events';

const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');

class SeoText extends BaseClass {
    state = {
        hasOverflow: false,
        showMore: false
    };

    textRef = React.createRef();

    handleResize = () => {
        if (!this.state.showMore) {
            const desc = this.textRef.current;
            this.setState({
                hasOverflow: desc.scrollHeight > desc.offsetHeight
            });
        }
    };

    handleFocusWithin = e => {
        if (!this.state.showMore) {
            switch (e.key) {
                case keyConsts.UP:
                case keyConsts.DOWN:
                case keyConsts.LEFT:
                case keyConsts.RIGHT:
                case keyConsts.TAB:
                    this.toggleOverflow();

                    break;
                default:
                    break;
            }
        }
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
        this.textRef.current.addEventListener('keyup', this.handleFocusWithin);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        this.textRef.current.removeEventListener('keyup', this.handleFocusWithin);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.contextId !== this.props.contextId) {
            this.setState({ showMore: false }, this.handleResize);
        }
    }

    toggleOverflow = () => {
        const currentScroll = window.scrollY;
        this.setState({ showMore: !this.state.showMore }, () => {
            window.scroll(0, currentScroll);
        });
    };

    render() {
        const { showMore } = this.state;
        const lineHeight = lineHeights.relaxed * fontSizes.base;
        const { content, text } = this.props;

        return (
            <>
                <Box
                    ref={this.textRef}
                    lineHeight='relaxed'
                    overflow='hidden'
                    maxWidth='74em'
                    maxHeight={showMore || [lineHeight * 2, lineHeight * 3.5]}
                >
                    {text ? <RichText content={text} /> : <BccRwdCopy content={content} />}
                </Box>
                {this.state.hasOverflow && (
                    <Text
                        is='p'
                        lineHeight='relaxed'
                    >
                        <Link
                            onClick={this.toggleOverflow}
                            color='blue'
                            padding={2}
                            margin={-2}
                            children={getText(showMore ? 'showLess' : 'showMore')}
                        />
                    </Text>
                )}
            </>
        );
    }
}

SeoText.propTypes = {
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // BCC (object or string)
    text: PropTypes.object, // Contentful
    contextId: PropTypes.string.isRequired
};

SeoText.defaultProps = {
    content: null,
    text: null
};

export default wrapComponent(SeoText, 'SeoText', true);
