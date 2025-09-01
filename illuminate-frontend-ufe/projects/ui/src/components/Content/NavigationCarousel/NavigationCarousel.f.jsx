import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Container, Flex, Link, Text
} from 'components/ui';
import CardCarousel from 'components/Content/NavigationCarousel/CardCarousel';
import LinkCarousel from 'components/Content/NavigationCarousel/LinkCarousel';
import HighlightCarousel from 'components/Content/NavigationCarousel/HighlightCarousel';
import navigationCarouselConstants from 'components/Content/NavigationCarousel/constants';
import { fontWeights } from 'style/config';
import Action from 'components/Content/Action';

const ActionLink = Action(Link);
const { VARIANTS } = navigationCarouselConstants;

const getCarouselComponent = variant => {
    switch (variant) {
        case VARIANTS.CARD:
            return CardCarousel;
        case VARIANTS.LINK:
            return LinkCarousel;
        case VARIANTS.HIGHLIGHT:
            return HighlightCarousel;
        default:
            return CardCarousel;
    }
};

const NavigationCarousel = ({
    sid, navigation, variant, title, action
}) => {
    const CarouselVariantComponent = getCarouselComponent(variant);

    return (
        <Container
            id={sid}
            paddingBottom={4}
            paddingX={0}
        >
            {variant === VARIANTS.LINK ? (
                <Container paddingX={[2, 0]}>
                    <CarouselVariantComponent navigation={navigation} />
                </Container>
            ) : (
                <Flex
                    flexDirection='column'
                    gap={4}
                    marginBottom={[4, 5]}
                >
                    {(title || action) && (
                        <Flex
                            flexDirection='row'
                            justifyContent='space-between'
                            alignItems='center'
                            paddingX={[4, 0]}
                        >
                            {title && (
                                <Text
                                    is='h2'
                                    fontSize={['md-bg', 'lg-bg']}
                                    fontWeight={fontWeights.bold}
                                    children={title}
                                />
                            )}

                            {action && (
                                <ActionLink
                                    key={action.label}
                                    aria-label={action.label}
                                    sid={action.sid}
                                    action={action}
                                    padding={2}
                                    margin={-2}
                                    color='blue'
                                    fontSize={'base-bg'}
                                    children='View all'
                                />
                            )}
                        </Flex>
                    )}

                    <CarouselVariantComponent
                        sid={sid}
                        navigation={navigation}
                    />
                </Flex>
            )}
        </Container>
    );
};

NavigationCarousel.propTypes = {
    sid: PropTypes.string,
    navigation: PropTypes.object,
    variant: PropTypes.string,
    pageType: PropTypes.string
};

NavigationCarousel.defaultProps = {
    variant: null
};

export default wrapFunctionalComponent(NavigationCarousel, 'NavigationCarousel');
