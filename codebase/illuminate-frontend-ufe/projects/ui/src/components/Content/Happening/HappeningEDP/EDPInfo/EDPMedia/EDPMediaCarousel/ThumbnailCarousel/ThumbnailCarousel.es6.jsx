import React, { createRef } from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;

import BaseClass from 'components/BaseClass';
import ThumbnailMediaItem from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/ThumbnailMediaItem';

import { fontSizes } from 'style/config';
import { Link, Divider } from 'components/ui';

import localeUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = localeUtils;

import { THUMB_COUNT } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';

class ThumbnailCarousel extends BaseClass {
    state = {
        selectedIndex: 0
    };

    listRef = createRef();

    componentWillReceiveProps(newProps) {
        //for SPA load we must reset selectedIndex and ProductMediaCarousel back to the first position
        const { activityId: prevActivityId } = this.props;
        const { activityId: newActivityId } = newProps;

        if (newActivityId !== prevActivityId) {
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

    render() {
        const { carouselRef, seeAllClick, items } = this.props;
        const { selectedIndex } = this.state;
        const pagesCount = Math.ceil(items.length / THUMB_COUNT);

        const pages = Array.from(Array(pagesCount).keys());
        const thumbs = page => items.slice(page * THUMB_COUNT, (page + 1) * THUMB_COUNT);

        const getText = getLocaleResourceFile(
            'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/ThumbnailCarousel/locales',
            'ThumbnailCarousel'
        );

        return (
            <>
                <div css={styles.listWrap}>
                    <ul
                        ref={this.listRef}
                        css={styles.list}
                    >
                        {pages.map((page, pageIndex) => (
                            <li
                                key={pageIndex.toString()}
                                css={styles.item}
                                // data-at={Sephora.debug.dataAt('product_images')}
                            >
                                <div css={styles.itemInner}>
                                    {thumbs(page).map((item, index) => (
                                        <ThumbnailMediaItem
                                            key={`thumb_${index}`}
                                            index={page * THUMB_COUNT + index}
                                            selected={page * THUMB_COUNT + index === selectedIndex}
                                            onClick={currentIndex => {
                                                carouselRef?.current.scrollTo(currentIndex);
                                                this.setState({
                                                    selectedIndex: currentIndex
                                                });
                                            }}
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
                            // data-at={Sephora.debug.dataAt('see_all_images_btn')}
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
