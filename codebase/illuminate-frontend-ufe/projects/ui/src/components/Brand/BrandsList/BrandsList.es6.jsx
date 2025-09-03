import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';

import { mediaQueries, space } from 'style/config';
import {
    Container, Divider, Flex, Grid, Link, Text
} from 'components/ui';

import Flag from 'components/Flag/Flag';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';
import SetPageAnalyticsProps from 'components/Analytics';
// import FavoriteBrands from 'components/Brand/BrandsList/FavoriteBrands';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import { BRAND_LETTERS } from 'utils/CatalogConstants';
import UrlUtils from 'utils/Url';

const { wrapComponent } = FrameworkUtils;
const { getLink } = UrlUtils;

class BrandsList extends BaseClass {
    analyticsFired = false;

    handleClick = (brandId, isLoved) => {
        const { showSignInModal, showBiRegisterModal, isSignedIn, isNonBIUser } = this.props;

        if (isNonBIUser) {
            return showBiRegisterModal();
        }

        if (isSignedIn) {
            return this.setFavoriteBrands(brandId, isLoved);
        }

        return showSignInModal();
    };

    setFavoriteBrands = (brandId, isLoved) => {
        const {
            userFavoriteBrandIDs, updateFavoriteBrands, user, beautyPreferences, showLoader
        } = this.props;

        let favoriteBrandsList = [];
        let prop55 = '';

        if (isLoved) {
            prop55 = anaConsts.FAVORITE_BRAND_ADDED.FILLED;
            favoriteBrandsList = userFavoriteBrandIDs.filter(brand => brand !== brandId);
        } else {
            prop55 = anaConsts.FAVORITE_BRAND_ADDED.EMPTY;
            favoriteBrandsList = [...userFavoriteBrandIDs, brandId];
        }

        showLoader(true);

        if (!this.analyticsFired) {
            this.analyticsFired = true;
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: `${anaConsts.PAGE_NAMES.MY_SEPHORA}:${prop55}`,
                    pageName: anaConsts.PAGE_NAMES.BRANDSLIST
                }
            });
        }

        updateFavoriteBrands(favoriteBrandsList, user.profileId, beautyPreferences, showLoader, null, null, null, showLoader);
    };

    render() {
        // const {
        //     userFavoriteBrandIDs,
        //     updateFavoriteBrands,
        //     totalUserLovedBrands,
        //     userHasLovedBrands,
        //     user,
        //     beautyPreferences,
        //     groupedBrands,
        //     brandsByIdMap,
        //     localization,
        //     showLoader,
        //     bpPageHref
        // } = this.props;
        const { groupedBrands, localization } = this.props;

        const groupedBrandsArr = Object.keys(groupedBrands);

        return (
            <Container
                is='main'
                paddingTop={5}
            >
                <SetPageAnalyticsProps
                    pageType={anaConsts.PAGE_TYPES.BRAND}
                    pageName='brands-list'
                />
                <Text
                    is='h1'
                    fontWeight='bold'
                    fontSize={['lg', 'xl']}
                    children={localization.brandsAZ}
                />
                <Divider marginY={4} />
                {/* <FavoriteBrands
                    brandsByIdMap={brandsByIdMap}
                    userFavoriteBrandIDs={userFavoriteBrandIDs}
                    totalUserLovedBrands={totalUserLovedBrands}
                    userHasLovedBrands={userHasLovedBrands}
                    user={user}
                    beautyPreferences={beautyPreferences}
                    localization={localization}
                    updateFavoriteBrands={updateFavoriteBrands}
                    showLoader={showLoader}
                    bpPageHref={bpPageHref}
                /> */}
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize={['md', 'lg']}
                    children={localization.allBrands}
                />
                <Divider marginY={4} />
                <Flex
                    fontSize='md'
                    fontWeight='bold'
                    flexWrap={['wrap', 'nowrap']}
                    justifyContent={[null, 'space-between']}
                    marginBottom={[null, 4]}
                >
                    {BRAND_LETTERS.map((letter, letterIndex) => (
                        <Link
                            data-at={Sephora.debug.dataAt('anchor_link')}
                            key={letterIndex.toString()}
                            disabled={!groupedBrands[letter] || groupedBrands[letter].brands.length === 0}
                            size={['2.375em', 'auto']}
                            display='flex'
                            alignItems='center'
                            justifyContent={['start', 'center']}
                            href={`#brands-${letter}`}
                            children={letter}
                        />
                    ))}
                </Flex>
                <Divider
                    display={[null, 'none']}
                    marginY={4}
                />
                {groupedBrandsArr.map((brandLetter, keyIndex) => {
                    const isFirst = keyIndex === 0;

                    if (groupedBrands[brandLetter].brands.length === 0) {
                        return null;
                    }

                    return (
                        <div
                            key={keyIndex.toString()}
                            id={`brands-${brandLetter}`}
                        >
                            {!isFirst && <Divider marginY={4} />}
                            <Text
                                is='h2'
                                fontSize='md'
                                fontWeight='bold'
                                marginTop={isFirst ? 4 : null}
                                marginBottom={4}
                                children={brandLetter}
                            />
                            <Grid
                                lineHeight='tight'
                                gap={[null, 5]}
                            >
                                <ul
                                    css={{
                                        [mediaQueries.sm]: {
                                            columnCount: 2
                                        },
                                        [mediaQueries.md]: {
                                            columnCount: 4
                                        },
                                        [mediaQueries.lg]: {
                                            columnCount: 5
                                        }
                                    }}
                                >
                                    {groupedBrands[brandLetter].brands.map((brand, index) => {
                                        // const isLoved = userFavoriteBrandIDs.includes(brand.brandId);

                                        return (
                                            <li
                                                key={index.toString()}
                                                css={{
                                                    breakInside: 'avoid-column',
                                                    display: 'flex',
                                                    gap: space[3],
                                                    alignItems: 'center',
                                                    [mediaQueries.xsMax]: {
                                                        justifyContent: 'space-between'
                                                    }
                                                }}
                                            >
                                                {/* <Box
                                                    onClick={() => this.handleClick(brand.brandId, isLoved)}
                                                    lineHeight='tight'
                                                    css={{ [mediaQueries.xsMax]: { order: 2 } }}
                                                >
                                                     <Icon
                                                        name={isLoved ? 'heart' : 'heartOutline'}
                                                        size={18}
                                                        color={isLoved ? colors.black : colors.gray}
                                                    />
                                                </Box> */}

                                                <Link
                                                    data-at={Sephora.debug.dataAt('brand_link')}
                                                    display='block'
                                                    paddingY={[2, '.375em']}
                                                    paddingRight={brand.isNew && 2}
                                                    href={getLink(brand.targetUrl)}
                                                    css={styles.link}
                                                >
                                                    <span>{brand.shortName}</span>
                                                    {brand.isNew && (
                                                        <span css={{ whiteSpace: 'nowrap' }}>
                                                            <span>&#xfeff;</span>
                                                            <Flag
                                                                css={styles.flag}
                                                                children={localization.newText}
                                                            />
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Grid>
                        </div>
                    );
                })}
                <BackToTopButton analyticsLinkName={anaConsts.LinkData.BRANDSLIST} />
            </Container>
        );
    }
}

const styles = {
    link: {
        '& > *:not(:last-child)': {
            marginRight: space[1]
        }
    },
    flag: {
        position: 'relative',
        top: '-.125em'
    }
};

BrandsList.defaultProps = {
    groupedBrands: {},
    userFavoriteBrandIDs: [],
    beautyPreferences: {}
};

BrandsList.propTypes = {
    regions: PropTypes.object,
    groupedBrands: PropTypes.object,
    userFavoriteBrandIDs: PropTypes.array,
    localization: PropTypes.shape({
        newText: PropTypes.string.isRequired,
        allBrands: PropTypes.string.isRequired,
        brandsAZ: PropTypes.string.isRequired
    }).isRequired,
    userHasLovedBrands: PropTypes.bool.isRequired,
    totalUserLovedBrands: PropTypes.string.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    isNonBIUser: PropTypes.bool.isRequired,
    bpPageHref: PropTypes.string.isRequired
};

BrandsList.shouldUpdatePropsOn = ['userFavoriteBrandIDs'];

export default wrapComponent(BrandsList, 'BrandsList', true);
