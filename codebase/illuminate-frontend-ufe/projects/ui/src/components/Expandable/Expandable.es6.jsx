import { Box, Grid, Text } from 'components/ui';
import BaseClass from 'components/BaseClass';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import Chevron from 'components/Chevron';
import { colors } from 'style/config';

class Expandable extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { expanded: this.props.expanded };
    }

    render() {
        const {
            id, children, titleTag, title, customCSS
        } = this.props;

        const { expanded } = this.state;

        return (
            <Box
                borderRadius={2}
                borderWidth={1}
                borderColor='midGray'
                css={
                    expanded
                        ? customCSS
                        : {
                            '&:hover': { borderColor: colors.black },
                            ...customCSS
                        }
                }
            >
                <Grid
                    onClick={this.toggle}
                    columns='1fr auto'
                    alignItems='center'
                    paddingX={4}
                    paddingY={[3, 4]}
                    aria-expanded={expanded}
                    aria-controls={id}
                    lineHeight='tight'
                    css={expanded && { '&:hover': { textDecoration: 'underline' } }}
                >
                    <Text
                        is={titleTag}
                        fontWeight='bold'
                        children={title}
                    />
                    <Chevron direction={expanded ? 'up' : 'down'} />
                </Grid>
                <Box
                    id={id}
                    paddingX={4}
                    paddingBottom={[3, 4]}
                    style={!expanded ? { display: 'none' } : null}
                    children={children}
                />
            </Box>
        );
    }

    toggle = () => this.setState(({ expanded }) => ({ expanded: !expanded }));
}

Expandable.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleTag: PropTypes.string,
    expanded: PropTypes.bool
};
Expandable.defaultProps = {
    titleTag: 'h3',
    expanded: false
};

export default wrapComponent(Expandable, 'Expandable');
