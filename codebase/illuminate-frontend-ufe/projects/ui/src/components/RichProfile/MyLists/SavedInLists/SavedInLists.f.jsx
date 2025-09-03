import React from 'react';
import FrameworkUtils from 'utils/framework';
import { Text } from 'components/ui';
import { colors, fontSizes } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

function SavedInLists({ savedInListsText }) {
    return (
        <Text
            display='block'
            color={colors.gray}
            fontSize={fontSizes.sm}
            marginTop='.25em'
            children={savedInListsText}
        />
    );
}

export default wrapFunctionalComponent(SavedInLists, 'SavedInLists');
