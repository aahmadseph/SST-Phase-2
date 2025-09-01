import React from 'react';
import { useSelector } from 'react-redux';
import framework from 'utils/framework';
import { Flex, Text } from 'components/ui';
import ShareButton from 'components/CreatorStoreFront/ShareButton/ShareButton.f';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import anaConsts from 'analytics/constants';

const { wrapFunctionalComponent } = framework;

const CollectionDetailsHeader = ({ collectionTitle, collectionDescription, totalProducts }) => {
    const textResources = useSelector(textResourcesSelector);

    return (
        <Flex
            width='100%'
            justifyContent={['center', null, 'space-between']}
            alignItems='flex-start'
            gap={5}
        >
            {/* Collection Info Section */}
            <Flex
                flexDirection='column'
                maxWidth={[null, null, 695]}
                flexGrow={1}
                alignItems='flex-start'
                gap={1}
            >
                <Text
                    fontSize='md'
                    fontWeight='bold'
                    lineHeight={['20px', null, '22px']}
                    fontFamily='Helvetica Neue'
                    children={collectionTitle}
                />
                {collectionDescription && (
                    <Text
                        fontSize={['sm', null, 'base']}
                        lineHeight={['14px', null, '18px']}
                        fontFamily='Helvetica Neue'
                        alignSelf='stretch'
                        children={collectionDescription}
                    />
                )}
                <Text
                    fontSize='sm'
                    color={'gray'}
                    lineHeight='14px'
                    fontFamily='Helvetica Neue'
                    children={`${totalProducts} ${textResources.items}`}
                />
            </Flex>

            {/* Share Button */}
            <ShareButton
                pathName={anaConsts.PAGE_TYPES.COLLECTION_DETAIL}
                textResources={textResources}
                iconSize={24}
                display='flex'
                justifyContent='center'
                alignItems='flex-end'
                flexShrink={0}
                gap={1}
                width={65}
                height={24}
            />
        </Flex>
    );
};

export default wrapFunctionalComponent(CollectionDetailsHeader, 'CollectionDetailsHeader');
