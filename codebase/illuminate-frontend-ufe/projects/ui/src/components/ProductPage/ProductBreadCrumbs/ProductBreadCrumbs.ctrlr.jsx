import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs';

const createItems = ({ displayName, targetUrl, parentCategory }) => {
    const item = {
        displayName,
        targetUrl
    };

    const items = [item];

    if (parentCategory) {
        items.push(...createItems(parentCategory));
    }

    return items;
};

const EMPTY_ARR = [];

class ProductBreadCrumbs extends BaseClass {
    state = { categoryBreadCrumbItems: EMPTY_ARR };

    recalculateItems = () => {
        let nextItems = null;

        if (this.props.parentCategory) {
            nextItems = createItems(this.props.parentCategory).reverse();
        } else if (this.state.categoryBreadCrumbItems !== EMPTY_ARR) {
            nextItems = EMPTY_ARR;
        }

        if (nextItems) {
            this.setState({ categoryBreadCrumbItems: nextItems }, () => {
                digitalData.page.pageInfo.breadcrumbs = nextItems;
            });
        }
    };

    componentDidMount() {
        this.recalculateItems();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.parentCategory !== this.props.parentCategory) {
            this.recalculateItems();
        }
    }

    render() {
        return (
            <BreadCrumbs
                productBreadcrumbsExperience={this.props.productBreadcrumbsExperience}
                isRegularProductSmallView={this.props.isRegularProductSmallView}
                items={this.state.categoryBreadCrumbItems}
            />
        );
    }
}

export default wrapComponent(ProductBreadCrumbs, 'ProductBreadCrumbs', true);
