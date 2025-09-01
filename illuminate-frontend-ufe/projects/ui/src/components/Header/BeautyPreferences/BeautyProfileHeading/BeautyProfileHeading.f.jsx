/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Flex, Image, Link, Grid
} from 'components/ui';
import Chevron from 'components/Chevron';
import BeautyPreferencesContentHeading from 'components/Header/BeautyPreferences/BeautyPreferencesContentHeading/BeautyPreferencesContentHeading';
import { notSureOptions, noPreferenceOption } from 'constants/beautyPreferences';
import BeautyProfileHeadingTitle from 'components/Header/BeautyPreferences/BeautyProfileHeading/BeautyProfileHeadingTitle';
import ColorIQContent from 'components/Header/BeautyPreferences/ColorIQContent';
import { CONTAINER_SIZE } from 'constants/beautyPreferences';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';
import Empty from 'constants/empty';

function BeautyProfileHeading(props) {
    const {
        refinement, handleClick, expanded, isPostSignupModal, isFirstTrait, ofText, totalPages, currentPage, brandNames, beautyPreferences
    } =
        props;

    if (!refinement) {
        return null;
    }

    const refinementKey = refinement?.key || refinement?.type;
    const isFavoriteBrands = refinementKey === PREFERENCE_TYPES.FAVORITE_BRANDS;
    const isColorIQ = refinementKey === PREFERENCE_TYPES.COLOR_IQ;
    const favoriteBrandsNames = isFavoriteBrands ? brandNames : Empty.Object;
    const isOptionsSelected = expanded || (beautyPreferences && beautyPreferences[refinementKey]?.length > 0);
    const currentBeautyPreferenceTemp = (beautyPreferences && beautyPreferences[refinementKey]) || Empty.Array;
    const currentBeautyPreference = Array.isArray(currentBeautyPreferenceTemp) ? currentBeautyPreferenceTemp : [currentBeautyPreferenceTemp];
    const isColorIQSelected = beautyPreferences?.colorIQ?.length > 0;
    const parenText = refinement.singleSelect ? props.selectOne : props.selectAllThatApply;
    const id = 'filter_test';
    const headingId = `${id}_heading`;
    const toggleRef = React.createRef();
    const postSignupTitle = refinement.postSignupTitle;
    const refinementTitle = (isPostSignupModal && postSignupTitle ? props[postSignupTitle] : refinement.value) || props[refinement.type];

    const filteredBeautyPreferences = currentBeautyPreference.filter(itemKey => {
        const itemInMasterList = refinement?.items?.find(item => item?.key === itemKey);

        // Filter by item is in master list, visibleInBP === true OR skip favorite brands
        if ((itemInMasterList && itemInMasterList.visableInBP) || refinement.key === 'favoriteBrands') {
            return itemKey;
        }

        return false;
    });

    return (
        <>
            <Link
                ref={toggleRef}
                aria-controls={id}
                aria-expanded={expanded}
                onClick={() => (isPostSignupModal ? null : handleClick(refinementKey, refinement.name))}
                display='flex'
                flexDirection={isPostSignupModal && 'column'}
                marginBottom={isPostSignupModal && 1}
                flexWrap='wrap'
                hoverSelector='.Link-target'
                alignItems='center'
                lineHeight='tight'
                width='100%'
                paddingTop={(!isPostSignupModal || isFirstTrait) && 4}
                paddingBottom={!expanded && 4}
                backgroundColor='white'
                css={[
                    !isPostSignupModal
                        ? expanded
                            ? {
                                rowGap: refinement?.openModal ? '16px' : '5px'
                            }
                            : {
                                rowGap: isColorIQ ? '16px' : '9px'
                            }
                        : { pointerEvents: 'none' }
                ]}
            >
                <BeautyProfileHeadingTitle
                    expanded={expanded}
                    title={refinementTitle}
                    isColorIQ={isColorIQ}
                    isPostSignupModal={isPostSignupModal}
                    ofText={ofText}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
                {isPostSignupModal ? (
                    <Box
                        ref={this.drawerRef}
                        id={id}
                        aria-labelledby={headingId}
                        width='100%'
                        flex={'1 0 auto'}
                    >
                        <BeautyPreferencesContentHeading
                            isExpanded={expanded}
                            isModal={refinement.openModal}
                            isRedirect={refinement.isRedirect}
                            parens={parenText}
                        >
                            {props[refinementKey]}
                        </BeautyPreferencesContentHeading>
                    </Box>
                ) : (
                    <>
                        {isOptionsSelected && (
                            <Box
                                ref={this.drawerRef}
                                id={id}
                                aria-labelledby={headingId}
                                width={['100%', '100%', null]}
                                paddingLeft={[null, null, 2]}
                                flex={['1 0 auto', null, `1 0 ${CONTAINER_SIZE}px`]}
                                order={[6, null, 2]}
                                alignSelf={'end'}
                                css={{
                                    transition: 'all .3s'
                                }}
                                onTransitionEnd={e => {
                                    if (expanded) {
                                        e.target.style.overflow = 'initial';
                                    }
                                }}
                            >
                                {expanded ? (
                                    <BeautyPreferencesContentHeading
                                        isExpanded={expanded}
                                        isModal={refinement.openModal}
                                        isRedirect={refinement.isRedirect}
                                        parens={parenText}
                                    >
                                        {props[refinementKey]}
                                    </BeautyPreferencesContentHeading>
                                ) : (
                                    <>
                                        {isColorIQ ? (
                                            isColorIQSelected && (
                                                <Grid
                                                    columns={[1, null, 2]}
                                                    columnGap={4}
                                                    maxWidth={[null, null, CONTAINER_SIZE]}
                                                >
                                                    <ColorIQContent />
                                                </Grid>
                                            )
                                        ) : (
                                            <Grid
                                                columns={[2, null, 4]}
                                                columnGap={4}
                                                maxWidth={[null, null, CONTAINER_SIZE]}
                                            >
                                                {filteredBeautyPreferences.map(itemKey => {
                                                    const description = isFavoriteBrands ? favoriteBrandsNames[itemKey] : props[itemKey];
                                                    const isNotSureOrNoPreference =
                                                        refinement.showIcon && !notSureOptions.includes(itemKey) && itemKey !== noPreferenceOption;
                                                    const selectedItemRefinement = refinement.items?.find(item => item.key === itemKey);
                                                    const selectedItemRefinementValue = selectedItemRefinement?.value || description;
                                                    const selectedItemRefinementImgSrc = selectedItemRefinement?.image;

                                                    return (
                                                        <Flex
                                                            key={itemKey}
                                                            alignItems='center'
                                                            gap='10px'
                                                        >
                                                            <Box borderRadius='50%'>
                                                                <Image
                                                                    borderRadius='50%'
                                                                    display='block'
                                                                    src={
                                                                        isNotSureOrNoPreference
                                                                            ? selectedItemRefinementImgSrc
                                                                            : '/img/ufe/rich-profile/checkmark.svg'
                                                                    }
                                                                    maxWidth={null}
                                                                    size={[26, isNotSureOrNoPreference ? null : 26, 36]}
                                                                />
                                                            </Box>
                                                            <Text
                                                                is='p'
                                                                css={{ flex: 1 }}
                                                            >
                                                                {selectedItemRefinementValue}
                                                            </Text>
                                                        </Flex>
                                                    );
                                                })}
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </Box>
                        )}
                    </>
                )}
                {!isPostSignupModal && (
                    <Chevron
                        isThicker={true}
                        css={{
                            order: '3',
                            alignSelf: 'baseline'
                        }}
                        direction={expanded ? 'up' : 'down'}
                    />
                )}
            </Link>
        </>
    );
}

BeautyProfileHeading.propTypes = {
    refinement: PropTypes.object.isRequired,
    handleClick: PropTypes.func,
    expanded: PropTypes.bool,
    isPostSignupModal: PropTypes.bool,
    isFirstTrait: PropTypes.bool
};

BeautyProfileHeading.defaultProps = {
    expanded: false,
    isPostSignupModal: false,
    isFirstTrait: false
};

export default wrapFunctionalComponent(BeautyProfileHeading, 'BeautyProfileHeading');
