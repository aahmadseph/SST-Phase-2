import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { colors, space } from 'style/config';
import { Container } from 'components/ui';
import TopNavItem from 'components/Header/TopNavItem/TopNavItem';
import keyConsts from 'utils/KeyConstants';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import topNavUtils from 'utils/TopNavigation';

const SOURCE = 'meganav';

class TopNav extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            openIndex: null,
            hasDelay: true
        };
        this.handleTriggerMap = {};
        this.handleTrigger = this.handleTrigger.bind(this);
    }

    reset = () => {
        this.setState(prevState => {
            if (prevState.openIndex !== null || !prevState.hasDelay) {
                return {
                    openIndex: null,
                    hasDelay: true
                };
            }

            return null;
        });
    };

    handleKeyDown = e => {
        if (e.key === keyConsts.ESC) {
            this.reset();
        }
    };

    // to avoid re-creating the function on every render we use a map
    handleTrigger(index) {
        if (!this.handleTriggerMap[index]) {
            this.handleTriggerMap[index] = (e, isOpen) => {
                if (isOpen) {
                    this.setState({
                        openIndex: index,
                        hasDelay: false
                    });
                } else {
                    this.setState({
                        openIndex: null
                    });
                }
            };
        }

        return this.handleTriggerMap[index];
    }

    render() {
        const { openIndex, hasDelay } = this.state;
        const { items, p13n, user } = this.props;
        const itemsToModify = JSON.parse(JSON.stringify(items));
        const filteredItems = topNavUtils.removeItemsWithAllLabel(itemsToModify);

        return (
            <div css={styles.root}>
                {(!p13n.isInitialized && !p13n.headData) || !user.isInitialized ? (
                    <SkeletonBanner height={44} />
                ) : (
                    <>
                        <div
                            css={styles.backdrop}
                            onClick={this.reset}
                            onTouchStart={this.reset}
                            onMouseEnter={this.reset}
                            onMouseLeave={this.reset}
                            style={
                                openIndex
                                    ? {
                                        opacity: 0.25,
                                        height: '100vh'
                                    }
                                    : null
                            }
                        />
                        <Container>
                            <nav
                                onMouseLeave={this.reset}
                                onKeyDown={this.handleKeyDown}
                                css={styles.inner}
                                data-at={Sephora.debug.dataAt('cat_nav')}
                            >
                                {filteredItems?.map((item, i) => {
                                    const index = i.toString();

                                    return (
                                        <TopNavItem
                                            key={index}
                                            source={SOURCE}
                                            onTrigger={this.handleTrigger(index)}
                                            isOpen={index === openIndex}
                                            hasDelay={hasDelay}
                                            index={index}
                                            item={item}
                                        />
                                    );
                                })}
                            </nav>
                        </Container>
                    </>
                )}
            </div>
        );
    }
}

const styles = {
    root: {
        position: 'relative',
        background: colors.black,
        color: colors.white
    },
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: -space.container,
        marginRight: -space.container,
        overflow: 'hidden',
        minHeight: 44
    },
    backdrop: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        height: 0,
        opacity: 0,
        backgroundColor: colors.black,
        transition: 'opacity .2s'
    }
};

export default wrapComponent(TopNav, 'TopNav');
