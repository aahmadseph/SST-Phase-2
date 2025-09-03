function removeItemsWithAllLabel(navParentItems) {
    return navParentItems.filter(navItem => {
        if (!navItem || !navItem.items?.length) {
            return true;
        }

        navItem.items = navItem.items.filter(childrenItem => {
            if (!childrenItem || !childrenItem.items) {
                return true;
            }

            // Filter sub-items based on the 'label' property
            childrenItem.items = childrenItem.items.filter(subChildrenItem => {
                // Remove items that have a label containing 'all'
                return !(subChildrenItem.label && subChildrenItem.label.toLowerCase().includes('all'));
            });

            return childrenItem.items.length > 0;
        });

        return navItem.items.length > 0;
    });
}

export default {
    removeItemsWithAllLabel
};
