import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Box, Flex, Image, Text
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Radio from 'components/Inputs/Radio/Radio';
import ContentDivider from 'components/RichProfile/EditMyProfile/Content/ContentDivider';
import ContentHeading from 'components/RichProfile/EditMyProfile/Content/ContentHeading';
import localeUtils from 'utils/LanguageLocale';
import biUtils from 'utils/BiProfile';

class Skin extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            skinTone: null,
            skinType: null,
            ageRange: null,
            skinConcerns: []
        };
    }

    handleSkinConcernSelect = (skinConcern, e) => {
        const concerns = this.state.skinConcerns.slice();

        if (e.target.checked) {
            concerns.push(skinConcern.key);
        } else {
            const itemToRemove = concerns.indexOf(skinConcern.key);
            concerns.splice(itemToRemove, 1);
        }

        this.setState({ skinConcerns: concerns });
    };

    getData = () => {
        const skinData = {
            biAccount: {
                personalizedInformation: {
                    skinType: this.state.skinType,
                    skinTone: this.state.skinTone,
                    skinConcerns: this.state.skinConcerns,
                    ageRange: this.state.ageRange
                }
            }
        };

        return skinData;
    };

    handleSkinToneChange = skinTone => () => {
        this.setState({
            skinTone: skinTone
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Skin/locales', 'Skin');
        const {
            excludeSkinType, excludeSkinConcerns, excludeSkinTone, excludeAgeRange, getRefinementItems
        } = this.props;
        const skinTypeItems = getRefinementItems(biUtils.TYPES.SKIN_TYPE);
        const skinToneItems = getRefinementItems(biUtils.TYPES.SKIN_TONE);
        const skinConcernsItems = getRefinementItems(biUtils.TYPES.SKIN_CONCERNS);
        const ageRangeItems = getRefinementItems(biUtils.TYPES.AGE_RANGE);

        const gutter = 4;
        const cellWidth = Sephora.isMobile() ? 1 / 2 : 1 / 3;

        return (
            <div>
                {excludeSkinTone ||
                    (skinToneItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_skinTone'
                        >
                            <ContentHeading
                                id='profile_heading_skinTone'
                                parens={getText('selectOne')}
                            >
                                {getText('skinTone')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {skinToneItems.map(skinTone => (
                                    //revisit this
                                    <LegacyGrid.Cell
                                        key={skinTone.key}
                                        width={cellWidth}
                                        marginTop={5}
                                    >
                                        <Radio
                                            hasHover={true}
                                            hasDot={false}
                                            paddingY={null}
                                            name='skinTone'
                                            checked={this.state.skinTone === skinTone.key}
                                            onChange={this.handleSkinToneChange(skinTone.key)}
                                        >
                                            <Flex alignItems='center'>
                                                <Box
                                                    border='3px solid'
                                                    borderColor={this.state.skinTone === skinTone.key ? 'black' : 'transparent'}
                                                    borderRadius='50%'
                                                >
                                                    <Image
                                                        display='block'
                                                        src={skinTone.image}
                                                        size={36}
                                                    />
                                                </Box>
                                                <Text marginLeft={4}>{skinTone.value}</Text>
                                            </Flex>
                                        </Radio>
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        </div>
                    ))}

                {excludeSkinType ||
                    (skinTypeItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_skinType'
                        >
                            {excludeSkinTone || <ContentDivider />}
                            <ContentHeading
                                id='profile_heading_skinType'
                                parens={getText('selectOne')}
                            >
                                {getText('skinType')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {skinTypeItems.map(skinType => (
                                    <LegacyGrid.Cell
                                        key={skinType.key}
                                        width={cellWidth}
                                        marginTop={4}
                                    >
                                        <Radio
                                            hasHover={true}
                                            name='skinType'
                                            checked={this.state.skinType === skinType.key}
                                            onChange={() =>
                                                this.setState({
                                                    skinType: skinType.key
                                                })
                                            }
                                        >
                                            {skinType.value}
                                        </Radio>
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        </div>
                    ))}

                {excludeSkinConcerns ||
                    (skinConcernsItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_skinConcern'
                        >
                            {(!excludeSkinType || !excludeSkinTone) && <ContentDivider />}
                            <ContentHeading
                                id='profile_heading_skinConcern'
                                parens={getText('selectAllApply')}
                                isMyProfile={true}
                            >
                                {getText('skincareConcerns')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {skinConcernsItems.map(skinConcern => (
                                    <LegacyGrid.Cell
                                        key={skinConcern.key}
                                        width={cellWidth}
                                        marginTop={4}
                                    >
                                        <Checkbox
                                            hasHover={true}
                                            checked={this.state.skinConcerns.indexOf(skinConcern.key) !== -1}
                                            onClick={e => {
                                                this.handleSkinConcernSelect(skinConcern, e);
                                            }}
                                        >
                                            {skinConcern.value}
                                        </Checkbox>
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        </div>
                    ))}
                {excludeAgeRange ||
                    (ageRangeItems && (
                        <div
                            role='group'
                            aria-labelledby='profile_heading_ageRange'
                        >
                            {(!excludeSkinConcerns || !excludeSkinType || !excludeSkinTone) && <ContentDivider />}
                            <ContentHeading
                                id='profile_heading_ageRange'
                                parens={getText('selectOne')}
                            >
                                {getText('ageRange')}
                            </ContentHeading>
                            <LegacyGrid gutter={gutter}>
                                {ageRangeItems.map(ageRange => (
                                    <LegacyGrid.Cell
                                        key={ageRange.key}
                                        width={cellWidth}
                                        marginTop={4}
                                    >
                                        <Radio
                                            hasHover={true}
                                            name='ageRange'
                                            checked={this.state.ageRange === ageRange.key}
                                            onChange={() =>
                                                this.setState({
                                                    ageRange: ageRange.key
                                                })
                                            }
                                        >
                                            {ageRange.value}
                                        </Radio>
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        </div>
                    ))}
            </div>
        );
    }
}

export default wrapComponent(Skin, 'Skin');
