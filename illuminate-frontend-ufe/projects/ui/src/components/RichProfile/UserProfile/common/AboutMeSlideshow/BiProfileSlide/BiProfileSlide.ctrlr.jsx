/* eslint max-len: [2, 275] */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import localeUtils from 'utils/LanguageLocale';
import reverseLookUpApi from 'services/api/sdn';

const language = localeUtils.getCurrentLanguage().toLowerCase();

class BiProfileSlide extends BaseClass {
    state = { labValue: '' };

    componentDidMount() {
        const { skinLabValue } = this.props;

        this.getSkinToneDescription(skinLabValue).then(userSkinLabList => {
            const formatedSkinLab = this.formatSkinLabValue(userSkinLabList);
            this.setState({ skinLabValue: formatedSkinLab });
        });
    }

    getSkinToneDescription = labValue => {
        if (!labValue) {
            return Promise.resolve(undefined);
        }

        return reverseLookUpApi
            .getLABCodeDescription(labValue)
            .then(({ depth, undertone, intensity }) => [depth, undertone, intensity]) // Ordering from [UTS-3446]
            .catch(() => undefined);
    };

    formatSkinLabValue = userSkinLabList => {
        return typeof userSkinLabList !== 'object'
            ? userSkinLabList || 'N/A'
            : userSkinLabList.reduce((strSkinLab, skinLabObj, currentIndex) => {
                if (currentIndex > 0) {
                    // eslint-disable-next-line no-param-reassign
                    strSkinLab += ' • ';
                }

                // eslint-disable-next-line no-param-reassign
                strSkinLab += skinLabObj[language] || '';

                return strSkinLab;
            }, '');
    };

    render() {
        const {
            skinTone, skinType, hairColor, eyeColor, skinLabValue, isMyProfile, nickname
        } = this.props;

        const getText = localeUtils.getLocaleResourceFile(
            'components/RichProfile/UserProfile/common/AboutMeSlideshow/BiProfileSlide/locales',
            'BiProfileSlide'
        );

        const hasBiPersonalInfo = () => {
            return (skinTone && skinType) || hairColor || eyeColor || skinLabValue;
        };

        const skinBlock = !(skinTone && skinType) ? (
            'N/A'
        ) : (
            <span>
                {skinTone?.length > 0 ? skinTone.join(', ') : skinTone}
                <br />
                {skinType?.length > 0 ? skinType.join(', ') : skinType}
            </span>
        );

        const privateEmptyContentMessage = getText('privateEmptyContent');
        const publicEmptyContentMessage = getText('publicEmptyContent', [nickname]);

        const isMobile = Sephora.isMobile();
        const cellWidth = 1 / 3;
        const cellMargin = isMobile ? 5 : 7;

        return (
            <Box
                fontSize={isMobile ? 'base' : 'md'}
                paddingY={isMobile ? 4 : 6}
                paddingX={isMobile ? 5 : 6}
            >
                {hasBiPersonalInfo() ? (
                    <LegacyGrid
                        gutter={4}
                        lineHeight='tight'
                    >
                        <LegacyGrid.Cell
                            width={cellWidth}
                            marginBottom={cellMargin}
                        >
                            <b>{getText('skin')}</b>
                            <br />
                            {skinBlock}
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width={cellWidth}
                            marginBottom={cellMargin}
                        >
                            <b>{getText('hair')}</b>
                            <br />
                            {hairColor || 'N/A'}
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width={cellWidth}
                            marginBottom={cellMargin}
                        >
                            <b>{getText('eyes')}</b>
                            <br />
                            {eyeColor || 'N/A'}
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell marginBottom={cellMargin}>
                            <b>{getText('colorIQ')}</b>
                            <br />
                            {this.state.skinLabValue}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                ) : (
                    <Text
                        is='p'
                        color='gray'
                    >
                        {isMyProfile ? privateEmptyContentMessage : publicEmptyContentMessage}
                    </Text>
                )}
            </Box>
        );
    }
}

export default wrapComponent(BiProfileSlide, 'BiProfileSlide', true);
