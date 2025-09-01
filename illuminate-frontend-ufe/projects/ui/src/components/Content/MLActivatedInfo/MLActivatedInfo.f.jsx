import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Icon, Text
} from 'components/ui';
import { zIndices, breakpoints } from 'style/config';
import MLActivatedDetailBox from 'components/Content/MLActivatedDetailBox';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Content/MLActivatedInfo/locales', 'MLActivatedInfo');

const MLActivatedInfo = ({ personalization, metadata }) => {
    const [isDetailBoxOpen, setIsDetailBoxOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const checkIsMobile = () => {
        setIsMobile(window.matchMedia(breakpoints.smMax).matches);
    };

    useEffect(() => {
        checkIsMobile();

        const handleResize = () => {
            checkIsMobile();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const openDetailBox = () => {
        setIsDetailBoxOpen(true);
    };

    const closeDetailBox = () => {
        setIsDetailBoxOpen(false);
    };

    return (
        <Box
            position='absolute'
            left='0'
            right='0'
            margin='0 auto'
            display='flex'
            justifyContent='center'
            bottom='-24px'
        >
            <Box
                position='relative'
                display='inline-block'
                zIndex={zIndices.header}
            >
                <Button
                    display='flex'
                    backgroundColor='#06E3FF'
                    border='none'
                    paddingX={[3, 2]}
                    paddingY={2}
                    fontSize={'11px'}
                    style={{
                        cursor: 'default',
                        borderRadius: '20px',
                        alignItems: 'center'
                    }}
                    onClick={openDetailBox}
                >
                    <Icon name='personalizedInfoNoOutline' />
                    <Text>{getText('mlActivated')}</Text>
                </Button>
                {!isMobile && isDetailBoxOpen && (
                    <MLActivatedDetailBox
                        personalization={personalization}
                        metadata={metadata}
                        onClose={closeDetailBox}
                        isOpen={isDetailBoxOpen}
                    />
                )}
            </Box>
        </Box>
    );
};

MLActivatedInfo.propTypes = {
    personalization: PropTypes.object,
    metadata: PropTypes.object
};

MLActivatedInfo.defaultProps = {
    personalization: null,
    metadata: null
};

export default MLActivatedInfo;
