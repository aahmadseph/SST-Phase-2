import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import urlUtils from 'utils/Url';
import BaseClass from 'components/BaseClass';
import anaUtils from 'analytics/utils';
import { breakpoints, colors } from 'style/config';
import {
    Box, Divider, Flex, Grid, Icon, Link, Text
} from 'components/ui';
import Chevron from 'components/Chevron';
import AnaConstants from 'analytics/constants';

const { wrapComponent } = FrameworkUtils;
const {
    PAGE_NAMES: { MY_SEPHORA },
    PAGE_DETAIL: { FAVORITE_BRAND_SPOKE }
} = AnaConstants;

class FavoriteBrands extends BaseClass {
    state = {
        isSectionExpanded: false
    };

    toogleSectionExpanded = () => {
        this.setState(prevState => ({ isSectionExpanded: !prevState.isSectionExpanded }));
    };

    setFavoriteBrands = brandId => {
        const {
            userFavoriteBrandIDs, updateFavoriteBrands, user, beautyPreferences, showLoader
        } = this.props;
        const favoriteBrandsList = userFavoriteBrandIDs.filter(brand => brand !== brandId);

        showLoader(true);
        updateFavoriteBrands(favoriteBrandsList, user.profileId, beautyPreferences, showLoader, null, null, null, showLoader);
    };

    redirectToBeautyPreferences = () => {
        anaUtils.setNextPageData({
            linkData: `${MY_SEPHORA}:${FAVORITE_BRAND_SPOKE}`
        });
        urlUtils.redirectTo(this.props.bpPageHref);
    };

    render() {
        const {
            brandsByIdMap, userFavoriteBrandIDs, totalUserLovedBrands, userHasLovedBrands, localization
        } = this.props;
        const { isSectionExpanded } = this.state;

        return (
            <>
                <Link
                    aria-expanded={isSectionExpanded}
                    onClick={this.toogleSectionExpanded}
                    display='flex'
                    alignItems='center'
                    lineHeight='tight'
                    width={['100%', 'auto']}
                    height={22}
                    backgroundColor='white'
                >
                    <Text
                        is='h2'
                        fontWeight='bold'
                        fontSize={['md', 'lg']}
                        paddingRight={[null, 2]}
                        css={{
                            flex: 1
                        }}
                        children={`${localization.favoriteBrands}${totalUserLovedBrands}`}
                    />
                    <Chevron
                        isThicker={true}
                        direction={isSectionExpanded ? 'up' : 'down'}
                    />
                </Link>
                {isSectionExpanded &&
                    (!userHasLovedBrands ? (
                        <Text
                            is='p'
                            color='gray'
                            marginTop={3}
                            children={localization.favoriteBrandsAppearHere}
                        />
                    ) : (
                        <>
                            <Grid
                                lineHeight='tight'
                                columns={[2, 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
                                gap={[5, 3]}
                                marginTop={[4, 6]}
                                maxWidth={breakpoints[1]}
                            >
                                {userFavoriteBrandIDs.map(brandId => (
                                    <Flex
                                        key={brandId}
                                        alignItems='center'
                                        gap={[2, 3]}
                                    >
                                        <Box
                                            onClick={() => this.setFavoriteBrands(brandId)}
                                            lineHeight='tight'
                                        >
                                            <Icon
                                                name='heart'
                                                size={15}
                                                color={colors.black}
                                            />
                                        </Box>
                                        <Link
                                            href={brandsByIdMap[brandId]?.targetUrl}
                                            children={brandsByIdMap[brandId]?.shortName}
                                        />
                                    </Flex>
                                ))}
                            </Grid>
                            <Link
                                marginTop={4}
                                color='blue'
                                children={localization.viewAllBautyPrefs}
                                onClick={this.redirectToBeautyPreferences}
                            />
                        </>
                    ))}
                {!userHasLovedBrands && (
                    <Flex
                        alignItems={['baseline', 'center']}
                        backgroundColor='lightBlue'
                        borderRadius={2}
                        gap={[3, 2]}
                        marginTop={isSectionExpanded ? 3 : 4}
                        paddingY={[2, 3]}
                        paddingX={3}
                        width={[null, 'fit-content']}
                    >
                        <Box lineHeight='tight'>
                            <Icon
                                name='heartOutline'
                                size={15}
                            />
                        </Box>
                        <Text is='p'>
                            {`${localization.saveYourFBsMessageOne} `}
                            <Link
                                color='blue'
                                children={localization.beautyPreferences}
                                onClick={this.redirectToBeautyPreferences}
                            />
                            {` ${localization.saveYourFBsMessageTwo}`}
                        </Text>
                    </Flex>
                )}
                <Divider marginY={4} />
            </>
        );
    }
}

FavoriteBrands.propTypes = {
    brandsByIdMap: PropTypes.object.isRequired,
    userFavoriteBrandIDs: PropTypes.array.isRequired,
    totalUserLovedBrands: PropTypes.string.isRequired,
    userHasLovedBrands: PropTypes.bool.isRequired,
    localization: PropTypes.shape({
        favoriteBrands: PropTypes.string.isRequired,
        saveYourFBsMessageOne: PropTypes.string.isRequired,
        beautyPreferences: PropTypes.string.isRequired,
        saveYourFBsMessageTwo: PropTypes.string.isRequired,
        favoriteBrandsAppearHere: PropTypes.string.isRequired,
        viewAllBautyPrefs: PropTypes.string.isRequired
    }).isRequired
};

FavoriteBrands.defaultProps = {};

export default wrapComponent(FavoriteBrands, 'FavoriteBrands');
