import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import React from 'react';
import { wrapComponent } from 'utils/framework';

import Chevron from 'components/Chevron';
import {
    Box, Divider, Link, Text
} from 'components/ui';

class ConsumerPrivacyCollapse extends BaseClass {
    scrollTimeout;

    constructor(props) {
        super(props);

        this.toggleRef = React.createRef();
    }

    unsetTimeoutWhenIsDefine = () => {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    };

    scrollToTheElement = () => {
        this.scrollTimeout = setTimeout(() => {
            this.toggleRef.current.scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
        }, 300);
    };

    componentDidUpdate(prevProps) {
        if (this.props.expanded && !prevProps.expanded) {
            this.unsetTimeoutWhenIsDefine();
            this.scrollToTheElement();
        }
    }

    render() {
        const {
            id, title, subtitle, children, onClick, renderDivider, expanded, ...props
        } = this.props;

        const collapseId = `collapse_${id.replace(/\s|-/g, '_')}`;
        const headingId = `${collapseId}_heading`;

        return (
            <div {...props}>
                {renderDivider && <Divider />}
                <Link
                    ref={this.toggleRef}
                    aria-controls={collapseId}
                    aria-expanded={expanded}
                    onClick={e => {
                        e.preventDefault();
                        onClick && onClick();
                    }}
                    hoverSelector='h2'
                    display='flex'
                    alignItems='center'
                    lineHeight='tight'
                    width='100%'
                    paddingY={4}
                >
                    <div css={{ flex: 1 }}>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            children={title}
                        />
                        {subtitle && (
                            <Text
                                is='p'
                                fontSize='sm'
                                color='gray'
                                children={subtitle}
                            />
                        )}
                    </div>
                    <Chevron
                        isThicker={true}
                        direction={expanded ? 'up' : 'down'}
                    />
                </Link>
                <Box
                    id={collapseId}
                    aria-labelledby={headingId}
                    position='relative'
                    overflow='hidden'
                    style={{
                        height: expanded ? null : 0,
                        visibility: expanded ? null : 'hidden'
                    }}
                >
                    <Box
                        paddingBottom={5}
                        children={children}
                    />
                </Box>
            </div>
        );
    }
}

ConsumerPrivacyCollapse.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.any.isRequired,
    renderDivider: PropTypes.bool,
    expanded: PropTypes.bool,
    onClick: PropTypes.func
};

export default wrapComponent(ConsumerPrivacyCollapse, 'ConsumerPrivacyCollapse', true);
