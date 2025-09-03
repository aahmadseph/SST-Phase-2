import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import ThumbnailMediaItem from 'components/ProductPage/ProductMediaCarousel/ThumbnailMediaItem';
import { fontSizes } from 'style/config';
import { Link, Divider } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { THUMB_COUNT } from 'components/ProductPage/ProductMediaCarousel/constants';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/ProductMediaCarousel/ThumbnailCarousel/locales', 'ThumbnailCarousel');

class ThumbnailCarousel extends BaseClass {
    state = {
        selectedIndex: 0
    };

    listRef = React.createRef();

    componentWillReceiveProps(newProps) {
        //for SPA load we must reset selectedIndex and ProductMediaCarousel back to the first position
        const { productId: prevProductId } = this.props;
        const { productId: newProductId } = newProps;

        if (newProductId !== prevProductId) {
            this.props.carouselRef?.current?.scrollTo(0);
            this.setState({
                selectedIndex: 0
            });
        }
    }

    scrollTo = index => {
        this.setState(
            {
                selectedIndex: index
            },
            () => {
                const listElem = this.listRef?.current;

                if (listElem) {
                    listElem.scrollTo(0, listElem.offsetHeight * Math.floor(index / THUMB_COUNT));
                }
            }
        );
    };

    handleOnClick = currentIndex => {
        const { carouselRef } = this.props;
        carouselRef?.current.scrollTo(currentIndex);
        this.setState({
            selectedIndex: currentIndex
        });
    };

    render() {
        const { seeAllClick, items } = this.props;
        const { selectedIndex } = this.state;
        const pagesCount = Math.ceil(items.length / THUMB_COUNT);

        return (
            <>
                <div css={styles.listWrap}>
                    <ul
                        ref={this.listRef}
                        css={styles.list}
                    >
                        {Array.from(Array(pagesCount).keys()).map((page, pageIndex) => (
                            <li
                                key={pageIndex.toString()}
                                css={styles.item}
                                data-at={Sephora.debug.dataAt('product_images')}
                            >
                                <div css={styles.itemInner}>
                                    {items.slice(page * THUMB_COUNT, (page + 1) * THUMB_COUNT).map((item, index) => (
                                        <ThumbnailMediaItem
                                            key={index.toString()}
                                            index={page * THUMB_COUNT + index}
                                            selected={page * THUMB_COUNT + index === selectedIndex}
                                            onClick={this.handleOnClick}
                                            children={item}
                                        />
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {items.length > THUMB_COUNT && (
                    <>
                        <Divider
                            marginTop={4}
                            marginBottom={2}
                        />
                        <Link
                            fontSize='sm'
                            paddingY={2}
                            marginY={-2}
                            width='100%'
                            onClick={seeAllClick(selectedIndex)}
                            display='block'
                            textAlign='center'
                            data-at={Sephora.debug.dataAt('see_all_images_btn')}
                        >
                            {getText('seeAll')}
                            <br />
                            <span
                                css={{ fontSize: fontSizes.base }}
                                children={items.length}
                            />
                        </Link>
                    </>
                )}
            </>
        );
    }
}

const styles = {
    listWrap: {
        position: 'relative',
        overflow: 'hidden',
        marginTop: -4,
        paddingBottom: `${THUMB_COUNT * 100}%`
    },
    list: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        scrollBehavior: 'smooth'
    },
    item: {
        position: 'relative',
        height: '100%'
    },
    itemInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
};

export default wrapComponent(ThumbnailCarousel, 'ThumbnailCarousel');
