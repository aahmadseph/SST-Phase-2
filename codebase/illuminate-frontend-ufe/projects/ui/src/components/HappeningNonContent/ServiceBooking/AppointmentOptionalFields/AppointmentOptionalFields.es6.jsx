import React from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import {
    Box, Divider, Flex, Text
} from 'components/ui';
import Textarea from 'components/Inputs/Textarea/Textarea';

import localeUtils from 'utils/LanguageLocale';

import { mediaQueries, radii } from 'style/config';

const { getLocaleResourceFile } = localeUtils;

class AppointmentOptionalFields extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedFeature: null,
            specialRequests: ''
        };
    }

    handleOnChange = e => {
        e.preventDefault();
    };

    toggleSelectedFeature = selectedFeature => () => {
        const nextSelectedFeature = this.state.selectedFeature?.id === selectedFeature.id ? null : selectedFeature;

        this.setState({ selectedFeature: nextSelectedFeature }, () => this.props.setSelectedFeature(nextSelectedFeature));
    };

    setSpecialRequests = event => {
        const specialRequests = event.target.value;

        this.setState({ specialRequests }, () => this.props.setSpecialRequests(specialRequests));
    };

    render() {
        const { featuresToFocus } = this.props.serviceInfo;
        const displayFeaturesToFocus = featuresToFocus?.length > 0 ?? false;

        const getText = getLocaleResourceFile(
            'components/HappeningNonContent/ServiceBooking/AppointmentOptionalFields/locales',
            'AppointmentOptionalFields'
        );

        return (
            <>
                {displayFeaturesToFocus && (
                    <>
                        <div>
                            <Flex
                                justifyContent={'space-between'}
                                marginBottom={2}
                                columnGap={[1]}
                            >
                                <Text
                                    is={'p'}
                                    lineHeight={'18px'}
                                    children={getText('selectOneFeature')}
                                />
                                <Text
                                    is={'p'}
                                    lineHeight={'18px'}
                                    color={'gray'}
                                    children={getText('optional')}
                                    css={{ wordWrap: 'normal' }}
                                />
                            </Flex>
                            <Flex
                                is='fieldset'
                                alignItems={'center'}
                                flexWrap={[null, null, 'wrap']}
                                gap={2}
                                lineHeight={'tight'}
                                marginX={[-4, null, 0]}
                                paddingX={[4, null, 0]}
                                overflowX={['auto', null, 'hidden']}
                                position={'relative'}
                                css={{
                                    [mediaQueries.xsMax]: {
                                        scrollbarWidth: 'none',
                                        '&::-webkit-scrollbar': {
                                            display: 'none'
                                        }
                                    }
                                }}
                            >
                                {featuresToFocus.map(feature => {
                                    const { id, displayName } = feature;
                                    const selected = this.state.selectedFeature?.id === id;

                                    return (
                                        <Box
                                            key={id}
                                            is='label'
                                            aria-selected={selected}
                                            flexShrink={0}
                                            paddingY={2}
                                            paddingX={'10px'}
                                            borderRadius={2}
                                            borderWidth={1}
                                            borderColor={'midGray'}
                                            position={'relative'}
                                            css={[styles.label, selected ? styles.labelActive : styles.labelInactive]}
                                        >
                                            <input
                                                type='radio'
                                                checked={selected}
                                                onClick={this.toggleSelectedFeature(feature)}
                                                onChange={this.handleOnChange}
                                                css={{ position: 'absolute', opacity: 0 }}
                                            />
                                            {displayName}
                                        </Box>
                                    );
                                })}
                            </Flex>
                        </div>
                        <Divider />
                    </>
                )}
                <div>
                    <Flex
                        justifyContent={'space-between'}
                        marginBottom={2}
                        columnGap={[1]}
                    >
                        <Text
                            is={'h3'}
                            fontWeight={'bold'}
                            lineHeight={'18px'}
                            children={getText('anySpecialRequests')}
                        />
                        <Text
                            is={'p'}
                            lineHeight={'18px'}
                            color={'gray'}
                            children={getText('optional')}
                            css={{ wordWrap: 'normal' }}
                        />
                    </Flex>
                    <Textarea
                        placeholder={getText('shareYourIdeas')}
                        marginBottom={0}
                        rows={5}
                        maxLength={1000}
                        isSMPadding={true}
                        name='specialRequests'
                        onChange={this.setSpecialRequests}
                        value={this.state.specialRequests}
                    />
                </div>
            </>
        );
    }
}

const styles = {
    label: {
        '&::before': {
            content: '""',
            position: 'absolute',
            border: '2px solid',
            inset: -1,
            borderRadius: radii[2],
            opacity: 0,
            transition: 'opacity .2s',
            zIndex: 1,
            pointerEvents: 'none'
        },
        [mediaQueries.lg]: {
            '&:hover': {
                borderColor: '#888'
            }
        }
    },
    labelActive: {
        '&::before': {
            opacity: 1
        }
    },
    labelInactive: {
        cursor: 'pointer'
    }
};

AppointmentOptionalFields.defaultProps = {
    serviceInfo: {},
    setSelectedFeature: () => {},
    setSpecialRequests: () => {}
};

export default wrapComponent(AppointmentOptionalFields, 'AppointmentOptionalFields');
