import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { space } from 'style/config';
import {
    Box, Flex, Text, Icon, Divider
} from 'components/ui';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import { DebouncedResize } from 'constants/events';

class Accordion extends BaseClass {
    state = {
        isOpen: false,
        height: 0,
        width: 0
    };

    heightRef = React.createRef();
    widthRef = React.createRef();

    handleClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
        const currentEventData = anaUtils.getLastAsyncPageLoadData();
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'D=c55',
                actionInfo: `product:${this.props.title.toLowerCase()}`,
                eventStrings: [anaConsts.Event.EVENT_71],
                ...currentEventData
            }
        });
    };

    handleResize = () => {
        const height = this.heightRef.current?.scrollHeight;
        const width = this.widthRef.current?.offsetWidth;

        if (this.state.width !== width) {
            this.setState({ width });
        }

        if (this.state.height !== height) {
            this.setState({ height });
        }
    };

    openAnchorContent = () => {
        const hash = window.location.hash;

        if (hash !== '' && hash.indexOf(this.props.id) > -1) {
            this.setState({ isOpen: true });
        }
    };

    componentDidUpdate() {
        this.handleResize();
    }

    componentDidMount() {
        this.handleResize();
        this.openAnchorContent();
        window.addEventListener('hashchange', this.openAnchorContent);
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        window.removeEventListener('hashchange', this.openAnchorContent);
    }

    render() {
        const { title, id, dataAt, children } = this.props;
        const { isOpen } = this.state;

        return (
            <React.Fragment>
                <Divider />
                <Flex
                    data-at={dataAt}
                    ref={this.widthRef}
                    onClick={this.handleClick}
                    width='100%'
                    alignItems='center'
                    aria-controls={id}
                    aria-expanded={isOpen}
                    css={{
                        outline: 0,
                        ':focus .Accordion-icon': {
                            outline: '1px dashed',
                            outlineOffset: space[1]
                        }
                    }}
                >
                    <Text
                        id={`${id}_heading`}
                        is='h2'
                        lineHeight='tight'
                        paddingY='1em'
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        children={title}
                    />
                    <Icon
                        className='Accordion-icon'
                        name={isOpen ? 'caretUp' : 'caretDown'}
                        size={24}
                        marginLeft={this.state.width > 650 ? 1 : 'auto'}
                    />
                </Flex>

                <div
                    id={id}
                    aria-labelledby={`${id}_heading`}
                    css={{
                        transition: 'height .3s',
                        overflow: 'hidden'
                    }}
                    style={{
                        height: isOpen ? this.state.height : 0
                    }}
                >
                    <Box
                        ref={this.heightRef}
                        paddingBottom={[5, 7]}
                        marginLeft={[null, null, 212]}
                        lineHeight={[null, 'relaxed']}
                        maxWidth={824}
                        children={children}
                    />
                </div>
            </React.Fragment>
        );
    }
}

Accordion.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default wrapComponent(Accordion, 'Accordion', true);
