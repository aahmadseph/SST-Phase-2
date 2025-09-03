import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Button, Text, Divider, Grid, Image, Link
} from 'components/ui';
import Chevron from 'components/Chevron/Chevron';
import Modal from 'components/Modal/Modal';
import languageLocale from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import constantsAnalytics from 'analytics/constants';
import CleanHighlightProducts from 'components/ProductPage/CleanHighlightProducts/CleanHighlightProducts';
import { colors, space } from 'style/config';

const {
    ASYNC_PAGE_LOAD,
    PAGE_TYPES: { PRODUCT }
} = constantsAnalytics;
const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);
const cleanAtSephoraID = '900001';
const MAX_ITEMS = 6;

class Highlights extends BaseClass {
    state = {
        showModal: false,
        activeItem: null,
        showMoreProducts: false
    };

    closeModal = () => {
        this.setState({
            showModal: false,
            activeItem: null
        });
    };

    showModal = (item, isShowProductsLink) => {
        this.setState(
            {
                showModal: true,
                activeItem: item,
                showMoreProducts: isShowProductsLink
            },
            this.trackModalShow(item)
        );
    };

    trackModalShow = item => {
        const pageType = PRODUCT;
        const pageDetail = `${pageType} highlight`;
        const pageWorld = digitalData.page.attributes.world;
        const itemName = item?.name?.toLowerCase();
        const pageName = `${pageType}:${pageDetail}:${pageWorld}:*${itemName}`;
        const data = {
            pageName: pageName,
            pageDetail: pageDetail,
            pageType: pageType,
            world: pageWorld,
            linkData: `${pageDetail}:${itemName}`,
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName
        };
        processEvent.process(ASYNC_PAGE_LOAD, { data });
    };

    render() {
        let items = this.props.items || [];
        items = items.slice(0, MAX_ITEMS).filter(item => item.imageUrl);

        if (!items.length) {
            return null;
        }

        const { activeItem, showMoreProducts } = this.state;

        return (
            <>
                <Divider />
                <Text
                    is='h2'
                    lineHeight='tight'
                    marginTop='1em'
                    marginBottom={5}
                    fontSize={['md', 'lg']}
                    fontWeight='bold'
                    children={getText('highlights')}
                />
                <Grid
                    columns={[2, 3]}
                    columnGap={[4, 6]}
                    rowGap={[5, 6]}
                    lineHeight='tight'
                    fontSize={['sm', null, 'base']}
                    marginLeft={[null, null, null, 212]}
                    marginRight={[null, null, null, 82]}
                    marginBottom={[6, 8]}
                >
                    {items.map(item => (
                        <Grid
                            key={item.id}
                            columns='auto 1fr'
                            alignItems='center'
                            gap={[2, null, 3]}
                            {...(item.description && {
                                onClick: () => this.showModal(item, false)
                            })}
                        >
                            <Image
                                disableLazyLoad={true}
                                src={item.imageUrl}
                                alt={item.altText}
                                borderRadius='full'
                                size={[40, null, 48]}
                            />
                            <span>
                                <Text
                                    {...(item.description && {
                                        css: {
                                            '.no-touch &:hover': {
                                                textDecoration: item.description && 'underline'
                                            }
                                        }
                                    })}
                                >
                                    {item.name}
                                </Text>
                                {item.description && (
                                    <span
                                        css={{
                                            display: 'inline',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <span>&#xfeff;</span>
                                        <Chevron
                                            direction='right'
                                            size='.75em'
                                            marginLeft='.5em'
                                            css={{
                                                position: 'relative',
                                                top: '-.0625em'
                                            }}
                                        />
                                        {item.id === cleanAtSephoraID && (
                                            <Link
                                                padding={2}
                                                margin={-2}
                                                color='blue'
                                                display='block'
                                                children={getText('showMoreProducts')}
                                                css={{
                                                    '.no-touch &:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    this.showModal(item, true);
                                                }}
                                            />
                                        )}
                                    </span>
                                )}
                            </span>
                        </Grid>
                    ))}
                </Grid>

                <Modal
                    width={showMoreProducts ? 6 : 2}
                    isOpen={this.state.showModal}
                    isDrawer={true}
                    onDismiss={this.closeModal}
                >
                    <Modal.Header isLeftAligned={true}>
                        <Modal.Title>
                            <Grid
                                columns='auto 1fr'
                                alignItems='center'
                                gap={4}
                            >
                                <Image
                                    disableLazyLoad={true}
                                    src={activeItem?.imageUrl}
                                    alt={activeItem?.altText}
                                    borderRadius='full'
                                    size={40}
                                />
                                {activeItem?.name}
                            </Grid>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body paddingBottom={showMoreProducts ? 6 : 4}>
                        {!showMoreProducts && activeItem?.description}
                        {showMoreProducts && (
                            <CleanHighlightProducts
                                closeParentModal={this.closeModal}
                                itemId={this.props.itemId}
                            />
                        )}
                    </Modal.Body>
                    <Modal.Footer
                        css={
                            showMoreProducts && {
                                borderTop: `1px solid ${colors.lightGray}`,
                                paddingTop: space[3]
                            }
                        }
                    >
                        <Button
                            onClick={() => this.setState({ showModal: false })}
                            variant='primary'
                            hasMinWidth={true}
                            width={['100%', 'auto']}
                            children={getText('gotIt')}
                        />
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default wrapComponent(Highlights, 'Highlights');
