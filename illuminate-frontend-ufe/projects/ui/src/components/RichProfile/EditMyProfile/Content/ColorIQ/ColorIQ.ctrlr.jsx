import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Box, Grid, Text, Divider, Button
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { Link } from 'components/ui';
import reverseLookUpApi from 'services/api/sdn';

class ColorIQ extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            skinToneItems: null
        };
    }

    componentDidMount() {
        const languageOpt = localeUtils.isFrench() ? 'fr' : 'en';
        const skinTonesLAB = this.props.biAccount?.skinTones?.filter(tone => {
            return tone.labValue;
        });

        if (!skinTonesLAB?.length) {
            this.setState({
                skinToneItems: []
            });
        } else {
            // if all creationDates are identical, we sort by labValue to ensure Default Skintone is assigned consistently
            const sortFn = skinTonesLAB.every(({ creationDate }) => creationDate === skinTonesLAB[0].creationDate)
                ? this.sortSkinTonesByLAB
                : this.sortSkinTonesByDate;

            Promise.allSettled(skinTonesLAB.sort(sortFn).map(lab => reverseLookUpApi.getLABCodeDescription(lab.labValue.replace(/,/g, ':'))))
                .then(descriptions => {
                    const skinToneItems = descriptions
                        .filter(({ status }) => status === 'fulfilled')
                        .map(({ value: { depth, intensity, undertone, hex } }, index) => {
                            const { creationDate, storeName, shadeCode } = skinTonesLAB[index];

                            return {
                                description: `${depth[languageOpt]} • ${undertone[languageOpt]} • ${intensity[languageOpt]}`,
                                hex,
                                creationDate,
                                storeName,
                                shadeCode
                            };
                        });

                    this.setState({
                        skinToneItems
                    });
                })
                .catch(() => {
                    this.setState({
                        skinToneItems: []
                    });
                });
        }
    }

    generateColorIQList = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/ColorIQ/locales', 'ColorIQ');

        return this.state.skinToneItems.slice(0, 5).map((skinTone, index) => {
            return (
                <div key={skinTone.shadeCode}>
                    <Grid
                        lineHeight='tight'
                        gap={4}
                        columns='auto 1fr'
                        alignItems='start'
                    >
                        <Box
                            size={36}
                            borderRadius='full'
                            backgroundColor={`#${skinTone.hex}`}
                        />
                        <p>
                            {skinTone.description}
                            <Text
                                display='block'
                                color='gray'
                            >
                                {getText('capturedOn')} {skinTone.creationDate} {skinTone.storeName ? 'at ' + skinTone.storeName : null}
                            </Text>
                            {index === 0 && (
                                <b>
                                    <Text
                                        display='block'
                                        marginTop={2}
                                    >
                                        {getText('defaultSkintone')}
                                    </Text>
                                </b>
                            )}
                        </p>
                    </Grid>
                    <Divider
                        marginY={5}
                        marginX={[null, -5]}
                    />
                </div>
            );
        });
    };

    noColorIQSavedView = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/ColorIQ/locales', 'ColorIQ');

        return (
            <Box
                is='div'
                margin='auto'
                width={Sephora.isMobile() ? '100%' : '80%'}
                padding='10px'
            >
                <div>
                    <h1 css={{ fontWeight: 'var(--font-weight-bold)' }}>{getText('tryShadeFinder')}</h1>
                    <Box
                        is='p'
                        paddingBottom={3}
                    >
                        {getText('youCanUseOur')}
                        <Link
                            color='blue'
                            underline={true}
                            href='/beauty/makeup-color-match/'
                        >
                            {getText('shadeFinder')}
                        </Link>
                        {getText('toFindProducts')}
                    </Box>

                    <Button
                        variant='primary'
                        href='/beauty/makeup-color-match/'
                    >
                        {getText('findYourShade')}
                    </Button>
                </div>

                <Box
                    is='p'
                    paddingY={5}
                >
                    {getText('or')}
                </Box>

                <div>
                    <h1 css={{ fontWeight: 'var(--font-weight-bold)' }}>{getText('getYourSkinScan')}</h1>

                    <Box
                        is='p'
                        paddingBottom={3}
                    >
                        {getText('pleaseComeToOur')}
                        <Link
                            color='blue'
                            underline={true}
                            href='/happening/home'
                        >
                            {getText('sephoraStore')}
                        </Link>
                        {getText('toGetYourSkinScan')}
                    </Box>
                    <Button
                        variant='primary'
                        href='/happening/home'
                    >
                        {getText('bookAnAppointment')}
                    </Button>
                </div>
            </Box>
        );
    };

    sortSkinTonesByDate = ({ creationDate: a }, { creationDate: b }) => {
        const dateASplit = a.split('/');
        const dateA = [dateASplit[2], dateASplit[0], dateASplit[1]].join('');
        const dateBSplit = b.split('/');
        const dateB = [dateBSplit[2], dateBSplit[0], dateBSplit[1]].join('');

        return dateB.localeCompare(dateA);
    };

    sortSkinTonesByLAB = ({ labValue: a }, { labValue: b }) => b.localeCompare(a);

    render() {
        if (this.state.skinToneItems == null) {
            return null;
        }

        return <>{this.state.skinToneItems?.length > 0 ? this.generateColorIQList() : this.noColorIQSavedView()}</>;
    }
}

export default wrapComponent(ColorIQ, 'ColorIQ');
