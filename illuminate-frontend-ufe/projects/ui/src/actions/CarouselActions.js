const TYPES = {
    HOVERED_CAROUSEL_ITEM: 'HOVERED_CAROUSEL_ITEM',
    MOVED_OVER_CAROUSEL_ITEM: 'MOVED_OVER_CAROUSEL_ITEM',
    CLICKED_CAROUSEL_ITEM: 'CLICKED_CAROUSEL_ITEM'
};

export default {
    TYPES: TYPES,

    carouselItemHovered: function (carouselName, itemIndex, panelIndex, isHovered) {
        return {
            type: TYPES.HOVERED_CAROUSEL_ITEM,
            carouselName: carouselName,
            isHovered: isHovered,
            itemIndex: itemIndex,
            panelIndex: panelIndex
        };
    },

    carouselItemMovedOver: function (carouselName, itemIndex, panelIndex, coords) {
        return {
            type: TYPES.MOVED_OVER_CAROUSEL_ITEM,
            carouselName: carouselName,
            itemIndex: itemIndex,
            panelIndex: panelIndex,
            coords: coords
        };
    },

    carouselItemClicked: function (carouselName, itemIndex, panelIndex) {
        return {
            type: TYPES.CLICKED_CAROUSEL_ITEM,
            carouselName: carouselName,
            itemIndex: itemIndex,
            panelIndex: panelIndex
        };
    }
};
