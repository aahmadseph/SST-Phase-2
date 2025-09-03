/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'store/Store';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import LanguageLocale from 'utils/LanguageLocale';
import wizardActions from 'actions/WizardActions';
import { mediaQueries, space } from 'style/config';
import WizardBody from 'components/Wizard/WizardBody';
import BaseClass from 'components/BaseClass/BaseClass';
import WizardSubhead from 'components/Wizard/WizardSubhead';
import {
    Flex, Grid, Link, Text, Divider
} from 'components/ui';

const BRAND_CHARACTERS = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '#'
];
const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;

class BrandsList extends BaseClass {
    state = { brandsList: [] };

    componentDidMount() {
        reverseLookUpApi.getBrandsList().then(data => {
            this.setState({ brandsList: data.brands });
        });
    }

    groupBrandsByInitial = brandsList => {
        const groupedBrands = {};

        brandsList &&
            brandsList.forEach(brand => {
                let character = brand.displayName?.charAt(0).toUpperCase();

                if (/^\d+$/.test(character)) {
                    character = '#';
                }

                if (!groupedBrands[character]) {
                    groupedBrands[character] = [brand];
                } else {
                    groupedBrands[character].push(brand);
                }
            });

        return groupedBrands;
    };

    setWizardBrand = brand => {
        const { brandId, displayName } = brand;
        store.dispatch(
            wizardActions.goToNextPage({
                brandId,
                brandName: displayName
            })
        );
    };

    render() {
        const groupedBrands = this.groupBrandsByInitial(this.state.brandsList);

        if (Object.keys(groupedBrands).length === 0) {
            return null;
        }

        const getId = character => `brands-${character}`;

        const getText = getLocaleResourceFile('components/ShadeFinder/BrandsList/locales', 'BrandsList');

        return (
            <React.Fragment>
                <WizardSubhead>{getText('selectBrand')}</WizardSubhead>
                <WizardBody>
                    <Flex
                        fontSize='md'
                        fontWeight='bold'
                        flexWrap='wrap'
                        data-at={Sephora.debug.dataAt('brand_letters')}
                    >
                        {BRAND_CHARACTERS.map(character => (
                            <Link
                                key={getId(character)}
                                data-at={Sephora.debug.dataAt('anchor_link')}
                                disabled={!groupedBrands[character] || groupedBrands[character].length === 0}
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                width={['2.375em', '5%']}
                                height={[null, '2.375em']}
                                href={`#${getId(character)}`}
                                children={character}
                            />
                        ))}
                    </Flex>
                    {BRAND_CHARACTERS.map(character => {
                        if (!groupedBrands[character]) {
                            return null;
                        }

                        return (
                            <div
                                key={getId(character)}
                                id={getId(character)}
                            >
                                <Divider marginY={5} />
                                <Grid
                                    lineHeight='tight'
                                    gap={[null, 5]}
                                    columns={[null, '12% 1fr']}
                                >
                                    <Text
                                        is='h3'
                                        fontSize='md'
                                        fontWeight='bold'
                                        marginTop='.125em'
                                        marginBottom={2}
                                        textAlign={[null, 'center']}
                                        children={character}
                                    />
                                    <ul
                                        css={{
                                            [mediaQueries.sm]: {
                                                columnCount: 3,
                                                columnGap: space[5]
                                            }
                                        }}
                                    >
                                        {groupedBrands[character].map((brand, indexChar) => (
                                            <li
                                                key={brand.displayName || indexChar}
                                                css={{
                                                    [mediaQueries.sm]: {
                                                        breakInside: 'avoid-column'
                                                    }
                                                }}
                                            >
                                                <Link
                                                    display='block'
                                                    width='100%'
                                                    onClick={() => this.setWizardBrand(brand)}
                                                    paddingLeft={['.5em', 0]}
                                                    paddingY={[2, '.375em']}
                                                    children={brand.displayName}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </div>
                        );
                    })}
                </WizardBody>
            </React.Fragment>
        );
    }
}

export default wrapComponent(BrandsList, 'BrandsList');
