import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import IconLock from 'components/LegacyIcon/IconLock';

function BeautyPreferencesContentHeading({
    parens, isMyProfile, isExpanded, isModal, isRedirect, desc
}) {
    return (
        <React.Fragment>
            {desc && (
                <Text
                    is='p'
                    marginTop={3}
                >
                    {desc}
                </Text>
            )}
            {parens && isExpanded && !isModal && !isRedirect && (
                <Text
                    is='p'
                    color='gray'
                    children={`${parens}:`}
                    marginBottom={2}
                />
            )}
            {isMyProfile && (
                <Text
                    is='p'
                    fontSize='sm'
                    marginTop={3}
                    color='gray'
                >
                    <IconLock
                        marginRight='.5em'
                        fontSize='1.25em'
                    />
                </Text>
            )}
        </React.Fragment>
    );
}

BeautyPreferencesContentHeading.propTypes = {
    parens: PropTypes.string,
    isMyProfile: PropTypes.bool,
    isExpanded: PropTypes.bool,
    isModal: PropTypes.bool,
    isRedirect: PropTypes.bool,
    desc: PropTypes.string
};

BeautyPreferencesContentHeading.defaultProps = {
    parens: '',
    isMyProfile: false,
    isExpanded: false,
    isModal: false,
    isRedirect: false,
    desc: ''
};

export default wrapFunctionalComponent(BeautyPreferencesContentHeading, 'BeautyPreferencesContentHeading');
