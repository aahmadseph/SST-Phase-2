import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Box, Flex, Image, Text
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Radio from 'components/Inputs/Radio/Radio';
import ContentHeading from 'components/RichProfile/EditMyProfile/Content/ContentHeading';
import localeUtils from 'utils/LanguageLocale';
import biUtils from 'utils/BiProfile';

class Eyes extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            eyeColor: null
        };
    }

    getData = () => {
        return { biAccount: { personalizedInformation: { eyeColor: this.state.eyeColor } } };
    };

    handleEyeColorChange = eyeColor => () => {
        this.setState({
            eyeColor: eyeColor
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Eyes/locales', 'Eyes');
        const { getRefinementItems } = this.props;

        const eyeColors = getRefinementItems(biUtils.TYPES.EYE_COLOR);

        return (
            eyeColors && (
                <div
                    role='group'
                    aria-labelledby='profile_heading_eyeColor'
                >
                    <ContentHeading
                        id='profile_heading_eyeColor'
                        parens={getText('selectOne')}
                    >
                        {getText('eyeColor')}
                    </ContentHeading>
                    <LegacyGrid gutter={4}>
                        {eyeColors.map(eyeColor => {
                            return (
                                <LegacyGrid.Cell
                                    key={eyeColor.key}
                                    width={Sephora.isMobile() ? 1 / 2 : 1 / 3}
                                    marginTop={5}
                                >
                                    <Radio
                                        hasHover={true}
                                        hasDot={false}
                                        paddingY={null}
                                        name='eyeColor'
                                        checked={this.state.eyeColor === eyeColor.key}
                                        onChange={this.handleEyeColorChange(eyeColor.key)}
                                    >
                                        <Flex alignItems='center'>
                                            <Box
                                                border='3px solid'
                                                borderColor={this.state.eyeColor === eyeColor.key ? 'black' : 'transparent'}
                                                borderRadius='50%'
                                            >
                                                <Image
                                                    display='block'
                                                    src={eyeColor.image}
                                                    size={36}
                                                    borderRadius='50%'
                                                />
                                            </Box>
                                            <Text marginLeft={4}>{eyeColor.value}</Text>
                                        </Flex>
                                    </Radio>
                                </LegacyGrid.Cell>
                            );
                        })}
                    </LegacyGrid>
                </div>
            )
        );
    }
}

export default wrapComponent(Eyes, 'Eyes');
