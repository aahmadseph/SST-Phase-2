module.exports = function getResource(label, vars = []) {
    const resources = {
        canadaLegalCopy:
            'Sephora Beauty Canada, Inc. (160 Bloor St. East Suite 1100 Toronto, ON M4W 1B9 | Canada, sephora.ca) is requesting consent on its own behalf and on behalf of Sephora USA, Inc. (350 Mission Street, Floor 7, San Francisco, CA 94105, sephora.com). You may withdraw your consent at any time.',
        prop65Msg: 'This item is restricted from shipping to California addresses.',
        comingSoon: 'Coming Soon',
        availableInStoreOnly: 'Available in Store Only',
        soldOut: 'Sold Out',
        outOfStock: 'Out of Stock',
        emailWhenInStock: 'Notify Me When Available',
        removeReminder: 'Manage Notifications',
        add: 'Add'
    };

    return resources[label];
};
