import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Text } from 'components/ui';
import ShopThisPostCard from 'components/Community/ShopThisPostCard';
import Carousel from 'components/Carousel';
import constants from 'analytics/constants';

const { CAROUSEL_NAMES } = constants;

class ShopThisPostCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isCarouselLoading: true,
            itemErrors: []
        };
    }

    carouselRef = React.createRef();

    componentDidMount() {
        if (this.carouselRef && this.carouselRef.current) {
            this.setState({
                isCarouselLoading: false
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.item?.id !== prevProps.item?.id) {
            this.setState(
                {
                    isCarouselLoading: true,
                    itemErrors: []
                },
                () => {
                    if (this.carouselRef && this.carouselRef.current) {
                        this.carouselRef.current.scrollTo(0);
                    }

                    this.setState({
                        isCarouselLoading: false
                    });
                }
            );
        }
    }

    render() {
        const addError = item => {
            this.setState({
                itemErrors: [...this.state.itemErrors, item]
            });
        };

        const cards = this.props.item?.products?.map(item => (
            <ShopThisPostCard
                item={item}
                galleryItem={this.props.item}
                addError={addError}
            />
        ));

        if (cards?.length === this.state.itemErrors?.length) {
            return null;
        }

        return (
            <>
                <Text
                    is='h2'
                    fontSize='md'
                    fontWeight='bold'
                    lineHeight='tight'
                    marginBottom={[4, 3]}
                    children={this.props.localization.shopThisPost}
                />
                <div css={this.state.isCarouselLoading ? { visibility: 'hidden' } : ''}>
                    <Carousel
                        analyticsCarouselName={CAROUSEL_NAMES.UGC_PRODUCT}
                        ref={this.carouselRef}
                        isLoading={this.state.isCarouselLoading}
                        marginX='-container'
                        scrollPadding={[2, 'container']}
                        paddingY={1}
                        items={cards}
                        itemWidth='250px'
                        showArrowOnHover={true}
                        gap={2}
                    />
                </div>
            </>
        );
    }
}

export default wrapComponent(ShopThisPostCarousel, 'ShopThisPostCarousel', true);
