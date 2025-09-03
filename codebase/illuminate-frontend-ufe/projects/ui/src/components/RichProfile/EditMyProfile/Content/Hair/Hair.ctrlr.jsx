import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Box, Flex, Image, Text
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Radio from 'components/Inputs/Radio/Radio';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ContentDivider from 'components/RichProfile/EditMyProfile/Content/ContentDivider';
import ContentHeading from 'components/RichProfile/EditMyProfile/Content/ContentHeading';
import localeUtils from 'utils/LanguageLocale';
import biUtils from 'utils/BiProfile';

class Hair extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hairColor: null,
            hairType: [],
            hairConcerns: []
        };
    }

    handleHairConcernSelect = hairConcern => e => {
        const concerns = this.state.hairConcerns.slice();

        if (e.target.checked) {
            concerns.push(hairConcern.key);
        } else {
            const itemToRemove = concerns.indexOf(hairConcern.key);
            concerns.splice(itemToRemove, 1);
        }

        this.setState({ hairConcerns: concerns });
    };

    handleHairTypeSelect = hairType => e => {
        const hairTypes = this.state.hairType.slice();

        if (e.target.checked) {
            hairTypes.push(hairType.key);
        } else {
            const itemToRemove = hairTypes.indexOf(hairType.key);
            hairTypes.splice(itemToRemove, 1);
        }

        this.setState({ hairType: hairTypes });
    };

    getData = () => {
        const hairData = {
            biAccount: {
                personalizedInformation: {
                    hairColor: this.state.hairColor,
                    hairType: this.state.hairType,
                    hairConcerns: this.state.hairConcerns
                }
            }
        };

        return hairData;
    };

    handleHairColorChange = hairColor => () => {
        this.setState({
            hairColor: hairColor
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Hair/locales', 'Hair');
        const { excludeHairColor, excludeHairType, excludeHairConcerns, getRefinementItems } = this.props;
        const hairColorItems = getRefinementItems(biUtils.TYPES.HAIR_COLOR);
        const hairTypeItems = getRefinementItems(biUtils.TYPES.HAIR_TYPE);
        const hairConcernsItems = getRefinementItems(biUtils.TYPES.HAIR_CONCERNS);

        const gutter = 4;
        const cellWidth = Sephora.isMobile() ? 1 / 2 : 1 / 3;

        return (
            <div>
                {excludeHairColor ||
                    (hairColorItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_hairColor'
                        >
                            <ContentHeading
                                id='profile_heading_hairColor'
                                parens={getText('selectOne')}
                            >
                                {getText('hairColor')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {hairColorItems.map(hairColor => {
                                    return (
                                        <LegacyGrid.Cell
                                            key={hairColor.key}
                                            width={cellWidth}
                                            marginTop={5}
                                        >
                                            <Radio
                                                hasHover={true}
                                                hasDot={false}
                                                paddingY={null}
                                                name='hairColor'
                                                checked={this.state.hairColor === hairColor.key}
                                                onChange={this.handleHairColorChange(hairColor.key)}
                                            >
                                                <Flex alignItems='center'>
                                                    <Box
                                                        border='3px solid'
                                                        borderColor={this.state.hairColor === hairColor.key ? 'black' : 'transparent'}
                                                        borderRadius='50%'
                                                    >
                                                        <Image
                                                            display='block'
                                                            src={hairColor.image}
                                                            size={36}
                                                            borderRadius='50%'
                                                        />
                                                    </Box>
                                                    <Text marginLeft={4}>{hairColor.value}</Text>
                                                </Flex>
                                            </Radio>
                                        </LegacyGrid.Cell>
                                    );
                                })}
                            </LegacyGrid>
                        </div>
                    ))}

                {excludeHairType ||
                    (hairTypeItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_hairType'
                        >
                            {excludeHairColor || <ContentDivider />}
                            <ContentHeading
                                id='profile_heading_hairType'
                                parens={getText('selectAllType')}
                            >
                                {getText('hairType')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {hairTypeItems.map((hairType, index) => (
                                    <LegacyGrid.Cell
                                        key={hairType.value || index}
                                        width={cellWidth}
                                        marginTop={4}
                                    >
                                        <Checkbox
                                            hasHover={true}
                                            /*eslint max-len: [0]*/
                                            checked={this.state.hairType.indexOf(hairType.key) !== -1}
                                            onClick={this.handleHairTypeSelect(hairType)}
                                        >
                                            {hairType.value}
                                        </Checkbox>
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        </div>
                    ))}

                {excludeHairConcerns ||
                    (hairConcernsItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_hairConcern'
                        >
                            {(!excludeHairColor || !excludeHairType) && <ContentDivider />}
                            <ContentHeading
                                id='profile_heading_hairConcern'
                                parens={getText('selectAllType')}
                                isMyProfile={true}
                            >
                                {getText('hairConcerns')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {hairConcernsItems.map((hairConcern, index) => {
                                    let displayName = hairConcern.value;

                                    // Added this because the API is combining two different properties into one
                                    // TODO: Remove this once the API is correct
                                    if (displayName === 'Straightening/Smoothing') {
                                        displayName = 'Straightening';
                                    }

                                    return (
                                        <LegacyGrid.Cell
                                            key={hairConcern.value || index}
                                            width={cellWidth}
                                            marginTop={4}
                                        >
                                            <Checkbox
                                                hasHover={true}
                                                checked={this.state.hairConcerns.indexOf(hairConcern.key) !== -1}
                                                onClick={this.handleHairConcernSelect(hairConcern)}
                                            >
                                                {displayName}
                                            </Checkbox>
                                        </LegacyGrid.Cell>
                                    );
                                })}
                            </LegacyGrid>
                        </div>
                    ))}
            </div>
        );
    }
}

export default wrapComponent(Hair, 'Hair');
