import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { colors } from 'style/config';

const DOT_SIZE = 6;
const SMALL_DOT_SIZE = 4;
const DOT_MARGIN = 4;
const SMALL_DOT_MARGIN = 3;

class Dots extends BaseClass {
    state = {
        scrolledIndex: 0,
        selectedIndex: 0
    };

    rootRef = React.createRef();

    handleClick = (e, index, preventCallback) => {
        const { scrolledIndex } = this.state;
        const { qty, dotsShown } = this.props;
        const newScrollIndex =
            index <= scrolledIndex
                ? Math.max(index - 1, 0)
                : index >= scrolledIndex + dotsShown - 1
                    ? Math.min(index - dotsShown + 2, qty - dotsShown)
                    : scrolledIndex;

        this.setState(
            {
                selectedIndex: index,
                scrolledIndex: newScrollIndex
            },
            () => {
                this.rootRef && this.rootRef.current.scrollTo(newScrollIndex * (DOT_SIZE + DOT_MARGIN), 0);

                if (this.props.onClick && !preventCallback) {
                    this.props.onClick(e, index);
                }
            }
        );
    };

    scrollTo = index => {
        if (index !== this.state.selectedIndex) {
            this.handleClick(null, index, true);
        }
    };

    shouldScrollLeft = index => {
        const { scrolledIndex } = this.state;

        return !!scrolledIndex && index === scrolledIndex;
    };

    shouldScrollRight = index => {
        const { scrolledIndex } = this.state;
        const { qty, dotsShown } = this.props;

        return qty > scrolledIndex + dotsShown && index === scrolledIndex + 4;
    };

    getDotStyle = index => {
        const { selectedIndex } = this.state;
        const scrollable = this.shouldScrollLeft(index) || this.shouldScrollRight(index);

        return {
            width: scrollable ? SMALL_DOT_SIZE : null,
            height: scrollable ? SMALL_DOT_SIZE : null,
            margin: scrollable ? `0 ${SMALL_DOT_MARGIN}px` : null,
            backgroundColor: index === selectedIndex ? colors.gray : null
        };
    };

    render() {
        const { qty, dotsShown } = this.props;

        return (
            <div
                aria-hidden
                ref={this.rootRef}
                css={[styles.root, { width: dotsShown * (DOT_SIZE + DOT_MARGIN) }]}
            >
                <div
                    css={[
                        styles.container,
                        qty < dotsShown && {
                            justifyContent: 'flex-end'
                        }
                    ]}
                >
                    {new Array(qty).fill().map((item, index) => (
                        <button
                            type='button'
                            key={index.toString()}
                            tabIndex={-1}
                            onClick={e => this.handleClick(e, index)}
                            css={styles.dot}
                            style={this.getDotStyle(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

Dots.propTypes = {
    qty: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    dotsShown: PropTypes.number,
    onClick: PropTypes.func
};

const styles = {
    root: {
        overflow: 'hidden',
        scrollBehavior: 'smooth'
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    dot: {
        flexShrink: 0,
        backgroundColor: '#e7e7e7',
        borderRadius: 99999,
        margin: `0 ${DOT_MARGIN / 2}px`,
        width: DOT_SIZE,
        height: DOT_SIZE
    }
};

export default wrapComponent(Dots, 'Dots');
