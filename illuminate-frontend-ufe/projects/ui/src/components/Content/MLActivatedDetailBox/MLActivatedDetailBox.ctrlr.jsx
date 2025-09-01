import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Flex, Image, Divider
} from 'components/ui';
import { zIndices, breakpoints } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';

const getText = localeUtils.getLocaleResourceFile('components/Content/MLActivatedDetailBox/locales', 'MLActivatedDetailBox');

class MLActivatedDetailBox extends BaseClass {
    constructor() {
        super();
        this.state = {
            isMobile: false
        };
    }

    checkIsMobile = () => {
        this.setState({
            isMobile: window.matchMedia(breakpoints.smMax).matches
        });
    };

    componentDidMount() {
        this.checkIsMobile();
        window.addEventListener('resize', this.checkIsMobile);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkIsMobile);
    }

    render() {
        const { personalization, metadata, onClose, isOpen } = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            <Box
                position={[this.state.isMobile ? 'fixed' : 'absolute']}
                bottom={[this.state.isMobile ? '0' : 'auto']}
                top={[this.state.isMobile ? 'auto' : '100%']}
                left={'0'}
                zIndex={zIndices.max}
                width={['100%', '375px']}
                border='1px solid #000'
                borderRadius={[this.state.isMobile ? '12px 12px 0 0' : '6px']}
                backgroundColor='#FFFFFF'
                marginTop={[0, 2]}
                paddingBottom={4}
            >
                <Flex
                    justifyContent='space-between'
                    padding={4}
                >
                    <Text
                        children={getText('mlActivatedComponent')}
                        fontWeight='bold'
                        fontSize='md'
                        maxWidth={['100%', '300px']}
                    />
                    <button
                        type='button'
                        onClick={onClose}
                        aria-label={getText('closeMlActivatedDetails')}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        <Image
                            src='/img/ufe/x-button.svg'
                            alt='close'
                            width={16}
                            height={16}
                        />
                    </button>
                </Flex>
                <Divider />
                <Flex
                    justifyContent='space-between'
                    padding={4}
                    flexDirection='column'
                    gap={10}
                >
                    {personalization?.isNBCEnabled && (
                        <Box>
                            <Text
                                is='h2'
                                children={getText('placement')}
                                fontWeight='bold'
                            />
                            <Text
                                is='h2'
                                children={`${getText('maxSlots')}: ${Object.keys(personalization?.NBCSlotCounts || {}).length}`}
                            />
                        </Box>
                    )}
                    {(personalization?.isNBCEnabled || personalization?.isNBOEnabled) && (
                        <Box>
                            <Text
                                is='h2'
                                children={getText('modelOutput')}
                                fontWeight='bold'
                            />
                            {personalization?.isNBCEnabled && (
                                <Text
                                    is='h2'
                                    children={'NBC'}
                                />
                            )}
                            {personalization?.isNBOEnabled && (
                                <Text
                                    is='h2'
                                    children={'NBO'}
                                />
                            )}
                        </Box>
                    )}
                    {metadata && metadata?.cxsSD && (
                        <Box>
                            <Text
                                is='h2'
                                children={getText('startEndDates')}
                                fontWeight='bold'
                            />
                            <Text
                                is='h2'
                                children={`${dateUtils.getDateInDMYwithTimeFormat(metadata?.cxsSD)} - ${
                                    metadata?.cxsED ? dateUtils.getDateInDMYwithTimeFormat(metadata?.cxsED) : ''
                                }`}
                            />
                        </Box>
                    )}
                </Flex>
            </Box>
        );
    }
}

MLActivatedDetailBox.propTypes = {
    personalization: PropTypes.object,
    metadata: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};

MLActivatedDetailBox.defaultProps = {
    personalization: {},
    metadata: null
};

export default wrapComponent(MLActivatedDetailBox, 'MLActivatedDetailBox');
