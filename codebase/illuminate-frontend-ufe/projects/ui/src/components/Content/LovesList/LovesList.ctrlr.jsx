import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';
import ProductList from 'components/Content/ProductList';
import analyticsConstants from 'analytics/constants';
import myListsUtils from 'utils/MyLists';
import chooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';
import { COMPONENT_SIDS } from 'components/GlobalModals/ChooseOptionsModal/constants';

const { BASKET_YOUR_SAVED_ITEMS_CAROUSEL } = COMPONENT_SIDS;

function LovesList(props) {
    const {
        currentLoves, title, grouping, variant, customStyles, showSignInModal, localization, isUserRecognized, showBasketGreyBackground
    } = props;
    const { signInButton, signInText, yourLoves, yourSavedItems } = localization;
    const hasLoves = currentLoves?.length > 0;
    const isSharableListEnabled = myListsUtils.isSharableListEnabled();
    const isChooseOptionsForMyListsEnabled = chooseOptionsModalUtils.isChooseOptionsForMyListsEnabled();

    return (
        <div>
            {hasLoves ? (
                <ProductList
                    skuList={currentLoves}
                    title={isSharableListEnabled ? yourSavedItems : title}
                    variant={variant}
                    grouping={grouping}
                    customStyles={customStyles}
                    analyticsContext={analyticsConstants.CONTEXT.BASKET_LOVES}
                    showBasketGreyBackground={showBasketGreyBackground}
                    sid={isChooseOptionsForMyListsEnabled ? BASKET_YOUR_SAVED_ITEMS_CAROUSEL : null}
                />
            ) : (
                <>
                    <Text
                        is='h2'
                        fontSize={'lg'}
                        children={title}
                        fontWeight={'bold'}
                        lineHeight={'tight'}
                        marginBottom={1}
                    />
                    {isUserRecognized ? (
                        <Text
                            is='p'
                            lineHeight={'base'}
                            children={yourLoves}
                        />
                    ) : (
                        <Text
                            is='p'
                            lineHeight={'base'}
                        >
                            <Link
                                onClick={showSignInModal}
                                color='blue'
                                children={signInButton}
                            />
                            {signInText}
                        </Text>
                    )}
                </>
            )}
        </div>
    );
}

export default wrapFunctionalComponent(LovesList, 'LovesList');
