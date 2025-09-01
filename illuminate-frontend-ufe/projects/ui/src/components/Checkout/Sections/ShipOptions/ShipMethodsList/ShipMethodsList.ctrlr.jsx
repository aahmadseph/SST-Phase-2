/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Divider, Link } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import ShipMethodDescription from 'components/Checkout/Sections/ShipOptions/ShipMethodDescription';
import localeUtils from 'utils/LanguageLocale';

class ShipMethodsList extends BaseClass {
    constructor(props) {
        super(props);

        const { shippingMethods, shippingGroup = {} } = this.props;

        const { shippingMethod } = shippingGroup;
        const shippingMethodSelected = shippingMethod.shippingFee
            ? shippingMethod
            : shippingMethods.reduce((min, method) => {
                const minShippingFee = parseFloat(min.shippingFee.substring(1));
                const methodShippingFee = parseFloat(method.shippingFee.substring(1));

                return methodShippingFee < minShippingFee ? method : min, shippingMethods[0];
            });

        this.state = {
            shippingMethodSelected: shippingMethodSelected,
            isViewLinkVisible: true,
            showOtherOptions: false
        };
    }

    componentDidMount() {
        //need to check if user is on guest checkout and has already
        //selected a shippingMethod other than the first shippingMethod.
        //if so, then we expand all of the options displaying
        //the selected one
        if (this.props.isGuestCheckout) {
            const { shippingMethod } = this.props.shippingGroup;
            const otherShippingMethods = this.props.shippingMethods.slice(1);

            for (let i = 0; i < otherShippingMethods.length; i++) {
                if (otherShippingMethods[i].shippingFee === shippingMethod.shippingFee) {
                    this.handleViewMoreOptions();

                    break;
                }
            }
        }
    }

    getData = () => {
        return this.state.shippingMethodSelected;
    };

    handleViewMoreOptions = () => {
        this.setState({
            showOtherOptions: true,
            isViewLinkVisible: false
        });
    };

    handleSelectShippingMethod = method => () => {
        this.setState({
            shippingMethodSelected: method
        });
    };

    render() {
        return <div data-at={Sephora.debug.dataAt('ship_methods_list')}>{this.getShippingRows()}</div>;
    }

    getShippingRows = () => {
        const { shippingMethods, isGuestCheckout, orderHasReplen, expanded, isGiftCardShipDelivery, isPhysicalGiftCard } = this.props;
        const { shippingMethodSelected } = this.state;
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/ShipOptions/locales', 'ShipOptions');
        const isMobile = Sephora.isMobile();
        let shippingOptionsItems;

        if (shippingMethods.length > 1 && isGuestCheckout) {
            const firstSM = shippingMethods[0];
            const otherShippingMethods = shippingMethods.slice(1);
            const otherMethods = otherShippingMethods.map((method, index) => {
                const {
                    shippingFee,
                    promiseDate,
                    promiseDateCutOffDescription,
                    promiseDateLabel,
                    shippingMethodDescription,
                    shippingMethodType,
                    shippingMethodId,
                    shippingMethodValuePrice
                } = method;

                return (
                    <div key={index.toString()}>
                        <Radio
                            paddingY={3}
                            alignItems='center'
                            checked={shippingMethodSelected.shippingMethodId === shippingMethodId}
                            onChange={this.handleSelectShippingMethod(method)}
                        >
                            <ShipMethodDescription
                                shippingMethodValuePrice={shippingMethodValuePrice}
                                shippingFee={shippingFee}
                                promiseDate={promiseDate}
                                promiseDateCutOffDescription={promiseDateCutOffDescription}
                                promiseDateLabel={promiseDateLabel}
                                shippingMethodType={shippingMethodType}
                                shippingMethodDescription={shippingMethodDescription}
                                orderHasReplen={orderHasReplen}
                                isPhysicalGiftCard={isPhysicalGiftCard}
                            />
                        </Radio>
                        {!isGiftCardShipDelivery && <Divider marginY={!isMobile ? 3 : null} />}
                    </div>
                );
            });

            shippingOptionsItems = (
                <div>
                    <div>
                        <Radio
                            paddingY={3}
                            alignItems='center'
                            checked={shippingMethodSelected.shippingMethodId === firstSM.shippingMethodId}
                            onChange={this.handleSelectShippingMethod(firstSM)}
                        >
                            <ShipMethodDescription
                                promiseDate={firstSM.promiseDate}
                                promiseDateCutOffDescription={firstSM.promiseDateCutOffDescription}
                                promiseDateLabel={firstSM.promiseDateLabel}
                                shippingMethodValuePrice={firstSM.shippingMethodValuePrice}
                                shippingFee={firstSM.shippingFee}
                                shippingMethodType={firstSM.shippingMethodType}
                                shippingMethodDescription={firstSM.shippingMethodDescription}
                                isPhysicalGiftCard={isPhysicalGiftCard}
                            />
                        </Radio>
                        <Link
                            css={this.state.isViewLinkVisible ? null : { display: 'none' }}
                            onClick={this.handleViewMoreOptions}
                            color='blue'
                            padding={3}
                            margin={-3}
                            ref={ViewOtherOptionsLink => (this.ViewOtherOptionsLink = ViewOtherOptionsLink)}
                            children={getText('moreDeliveryOptions')}
                            data-at={Sephora.debug.dataAt('more_delivery_options_btn')}
                        />
                        <Box css={this.state.showOtherOptions ? null : { display: 'none' }}>{otherMethods}</Box>
                    </div>
                </div>
            );
        } else {
            shippingOptionsItems = shippingMethods.map((method, index) => {
                const {
                    promiseDate,
                    promiseDateCutOffDescription,
                    promiseDateLabel,
                    shippingFee,
                    shippingMethodDescription,
                    shippingMethodType,
                    shippingMethodId,
                    shippingMethodValuePrice
                } = method;

                return (
                    <div key={index.toString()}>
                        <Radio
                            paddingY={3}
                            alignItems='center'
                            checked={shippingMethodSelected.shippingMethodId === shippingMethodId}
                            onChange={this.handleSelectShippingMethod(method)}
                        >
                            <ShipMethodDescription
                                promiseDate={promiseDate}
                                promiseDateCutOffDescription={promiseDateCutOffDescription}
                                promiseDateLabel={promiseDateLabel}
                                shippingMethodValuePrice={shippingMethodValuePrice}
                                shippingFee={shippingFee}
                                shippingMethodType={shippingMethodType}
                                shippingMethodDescription={shippingMethodDescription}
                                orderHasReplen={orderHasReplen}
                                expanded={expanded}
                                isPhysicalGiftCard={isPhysicalGiftCard}
                            />
                        </Radio>
                        {!isGiftCardShipDelivery && <Divider marginY={!isMobile ? 3 : null} />}
                    </div>
                );
            });
        }

        return shippingOptionsItems;
    };
}

export default wrapComponent(ShipMethodsList, 'ShipMethodsList', true);
