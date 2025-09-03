import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { fontSizes, lineHeights } from 'style/config';
import { Text, Link } from 'components/ui';
import Markdown from 'components/Markdown/Markdown';

class Ellipsis extends BaseClass {
    state = {
        showEllipsis: false,
        height: null
    };

    rootRef = React.createRef();

    render() {
        const {
            numberOfLines, overflowText = '', isLink, isToggle, isFixedHeight, children, markdown, htmlContent, ...props
        } = this.props;

        const dotText = '…' + overflowText;
        const containerHeight = this.state.height;

        return (
            <Text
                ref={this.rootRef}
                baseCss={[
                    { position: 'relative' },
                    isFixedHeight
                        ? {
                            height: containerHeight
                        }
                        : {
                            maxHeight: containerHeight
                        }
                ]}
                {...props}
            >
                {htmlContent ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : markdown ? <Markdown content={markdown} /> : children}
                {this.state.showEllipsis && (
                    <div css={styles.linkWrap}>
                        {isLink || isToggle ? (
                            <Link
                                color='blue'
                                onClick={isToggle ? this.toggle : null}
                                children={dotText}
                            />
                        ) : (
                            dotText
                        )}
                    </div>
                )}
            </Text>
        );
    }

    toggle = () => {
        this.setState({
            showEllipsis: !this.state.showEllipsis,
            height: this.props.isFixedHeight ? 'auto' : 'none'
        });
    };

    componentDidMount() {
        const {
            // NOTE: both fontSize + lineHeight are not inherited
            // if the content does not match the base site settings
            // you need to add these props
            lineHeight,
            fontSize,
            numberOfLines
        } = this.props;

        const contentLineHeight = lineHeights[lineHeight] || lineHeight;
        const contentFontSize = fontSizes[fontSize] || fontSize;

        const height = contentLineHeight * contentFontSize * numberOfLines;

        if (this.rootRef.current.scrollHeight > height) {
            this.setState({
                showEllipsis: true,
                height
            });
        }
    }
}

const styles = {
    linkWrap: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: '100%',
            bottom: 0,
            width: '1em',
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0), #fff)'
        }
    }
};

Ellipsis.propTypes = {
    /** Max number of lines to show */
    numberOfLines: PropTypes.number.isRequired,
    /** Optional text after ellipsis */
    overflowText: PropTypes.string,
    /** Optional display as primary link */
    isLink: PropTypes.bool,
    /** Optional: toggle truncation */
    isToggle: PropTypes.bool,
    /** Optional; set `height` instead of `maxHeight` */
    isFixedHeight: PropTypes.bool
};

Ellipsis.defaultProps = {
    is: 'div',
    overflow: 'hidden',
    fontSize: 'base',
    lineHeight: 'base'
};

export default wrapComponent(Ellipsis, 'Ellipsis', true);
