/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'Store';
import BCC from 'utils/BCC';
import watch from 'redux-watch';
import { site, space } from 'style/config';
import anaConsts from 'analytics/constants';
import FrameworkUtils from 'utils/framework';
import Samples from 'components/Samples/Samples';
import LanguageLocale from 'utils/LanguageLocale';
import SampleActions from 'actions/SampleActions';
import BaseClass from 'components/BaseClass/BaseClass';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import {
    Box, Divider, Flex, Text
} from 'components/ui';
import processEvent from 'analytics/processEvent';
import helpersUtils from 'utils/Helpers';
const { deferTaskExecution } = helpersUtils;
import Empty from 'constants/empty';

const COMPONENT_NAMES = BCC;
const { setSamples } = SampleActions;
const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;

class SamplesPage extends BaseClass {
    state = {
        samplesInBasket: 0
    };

    fireViewItemListAnalytics = () => {
        const samples = this.props?.data?.samples || Empty.Array;
        const itemsInList = samples.map(item => {
            return {
                skuId: item?.skuId,
                productName: item?.variationValue,
                brandName: '',
                category: ''
            };
        });

        const analyticsData = {
            data: {
                listId: '',
                listName: 'samples',
                items: itemsInList
            }
        };

        deferTaskExecution(() => {
            // Dispatches the View List Event
            processEvent.process(anaConsts.VIEW_LIST_EVENT, analyticsData);
        });
    };

    componentDidMount() {
        const samplesData = {};
        samplesData.samples = this.props.data.samples;
        samplesData.allowedQtyPerOrder = this.props.data.allowedQtyPerOrder;
        store.dispatch(setSamples(samplesData));
        const basket = store.getState().basket;

        if (basket.isInitialized) {
            this.setState({ samplesInBasket: basket.samples.length });
        } else {
            const basketWatch = watch(store.getState, 'basket');
            store.subscribe(
                basketWatch(readyBasket => {
                    this.setState({ samplesInBasket: readyBasket.samples.length });
                    basketWatch();
                }),
                this
            );
        }

        const basketSamplesWatch = watch(store.getState, 'basket.samples');
        store.subscribe(
            basketSamplesWatch(samplesInBasket => {
                this.setState({ samplesInBasket: samplesInBasket.length });
            }),
            this
        );

        // Analytics - ILLUPH-101473
        digitalData.page.category.pageType = 'beauty offers';
        digitalData.page.pageInfo.pageName = 'free samples';

        this.fireViewItemListAnalytics();
    }

    render() {
        const getText = getLocaleResourceFile('components/SamplesPage/locales', 'SamplesPage');

        const { data } = this.props;
        const isDesktop = Sephora.isDesktop();

        const selectedMsg = (
            <Text
                is='p'
                fontWeight='bold'
            >
                {getText('samplesSelectedText', [this.state.samplesInBasket, data.allowedQtyPerOrder])}
            </Text>
        );

        return (
            <LegacyContainer
                css={
                    isDesktop
                        ? {
                            paddingTop: site.BREADCRUMB_HEIGHT
                        }
                        : {
                            // hide sticky banner behind footer
                            position: 'relative',
                            zIndex: 0,
                            paddingTop: space[5]
                        }
                }
            >
                <LegacyGrid>
                    {isDesktop && (
                        <LegacyGrid.Cell
                            width={site.SIDEBAR_WIDTH}
                            borderRight={1}
                            borderColor='divider'
                            paddingRight={4}
                        >
                            <Box
                                borderTop={2}
                                borderBottom={2}
                                paddingY={3}
                                lineHeight='tight'
                            >
                                <BccComponentList
                                    isContained={false}
                                    items={data.regions && data.regions.left}
                                    propsCallback={function (componentType) {
                                        if (componentType === COMPONENT_NAMES.LINK_GROUP) {
                                            return { isSimple: true };
                                        } else {
                                            return null;
                                        }
                                    }}
                                />
                            </Box>
                        </LegacyGrid.Cell>
                    )}
                    <LegacyGrid.Cell
                        is='main'
                        width={isDesktop && 'fill'}
                        paddingLeft={isDesktop && 5}
                    >
                        <Text
                            is='h1'
                            fontSize='xl'
                            marginBottom='.5em'
                            lineHeight='tight'
                            fontFamily='serif'
                        >
                            {data.title}
                        </Text>
                        <Flex
                            alignItems='baseline'
                            justifyContent='space-between'
                            marginBottom={5}
                        >
                            <Text
                                is='p'
                                data-at={Sephora.debug.dataAt('samples_label')}
                            >
                                {getText('selectSamplesOrderText', [data.allowedQtyPerOrder])}
                            </Text>
                            {isDesktop && selectedMsg}
                        </Flex>
                        <Samples
                            analyticsContext={anaConsts.CONTEXT.BASKET_SAMPLES}
                            isSamplesPage
                        />
                        <Divider
                            marginTop={6}
                            marginBottom={5}
                        />
                        <BccComponentList items={data.regions && data.regions.right} />
                    </LegacyGrid.Cell>
                </LegacyGrid>
                {isDesktop || <StickyFooter>{selectedMsg}</StickyFooter>}
            </LegacyContainer>
        );
    }
}

export default wrapComponent(SamplesPage, 'SamplesPage');
