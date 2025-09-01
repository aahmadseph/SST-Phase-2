/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import BasketLoves from 'components/Loves/BasketLoves';
import ListsLoves from 'components/RichProfile/Lists/ListsLoves/ListsLoves';
import ViewAllLoves from 'components/RichProfile/ViewAllLoves';
import ApplyCCLoves from 'components/CreditCard/ApplyFlow/ApplyCreditCardLoves/ApplyCreditCardLoves';
import InlineLoves from 'components/Header/InlineLoves';
import Location from 'utils/Location';

class Loves extends BaseClass {
    state = {
        loves: null,
        onlyAFewLeftInLovesList: []
    };

    static getDerivedStateFromProps(props) {
        const lovedItems = props.currentLoves.map(love => love?.sku || love);
        const onlyAFewLeftInLovesList = props.currentLoves.filter(love => love?.sku?.isOnlyFewLeft).map(love => love?.sku);

        return {
            loves: lovedItems.slice(0, props.maxLoves),
            onlyAFewLeftInLovesList
        };
    }

    render() {
        const { compType, compProps, showCount } = this.props;
        const { loves, onlyAFewLeftInLovesList } = this.state;

        const selectLovesComponent = () => {
            let comp;

            //TODO: add loves dependent components to switch statement
            switch (compType) {
                case 'BasketLoves':
                    comp = (
                        <BasketLoves
                            loves={loves}
                            {...compProps}
                        />
                    );

                    break;
                case 'ListsLoves':
                    comp = (
                        <ListsLoves
                            loves={loves}
                            {...compProps}
                        />
                    );

                    break;
                case 'LovedProducts':
                    comp = (
                        <ViewAllLoves
                            loves={loves}
                            onlyAFewLeftInLovesList={onlyAFewLeftInLovesList}
                        />
                    );

                    break;
                case 'ApplyCCLoves':
                    comp = (
                        <ApplyCCLoves
                            loves={loves}
                            {...compProps}
                        />
                    );

                    break;
                case 'InlineLoves':
                    comp = (
                        <InlineLoves
                            loves={loves}
                            totalLoves={loves.length}
                            shouldShowTotalLoves={showCount}
                            onlyAFewLeftInLovesList={onlyAFewLeftInLovesList}
                            disableModal={Location.isCreatorStoreFrontPage()}
                            {...compProps}
                        />
                    );

                    break;
                default:
                    break;
            }

            return comp;
        };

        const lovesComponent = selectLovesComponent();

        return <div>{lovesComponent}</div>;
    }
}

export default wrapComponent(Loves, 'Loves', true);
