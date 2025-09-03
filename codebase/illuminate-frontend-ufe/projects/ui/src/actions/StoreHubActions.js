const TYPES = {
    UPDATE_ACTIVITIES: 'UPDATE_ACTIVITIES',
    UPDATE_FILTERED_ACTIVITIES: 'UPDATE_FILTERED_ACTIVITIES',
    TOGGLE_NO_RESULT_ERROR: 'TOGGLE_NO_RESULT_ERROR',
    HIDE_FEATURED_CONTENT: 'HIDE_FEATURED_CONTENT',
    VIEW_ALL_CLICKED: 'VIEW_ALL_CLICKED'
};

function updateFilteredActivityList(typeFilteredActivities, startDateTime) {
    return {
        type: TYPES.UPDATE_FILTERED_ACTIVITIES,
        typeFilteredActivities: typeFilteredActivities,
        startDateTime: startDateTime
    };
}

function updateActivities(allActivities, startDateTime) {
    return {
        type: TYPES.UPDATE_ACTIVITIES,
        allActivities: allActivities,
        startDateTime: startDateTime
    };
}

function setNoStoreError(showError) {
    return {
        type: TYPES.TOGGLE_NO_RESULT_ERROR,
        showError: showError
    };
}

function hideFeaturedContent(hideContent) {
    return {
        type: TYPES.HIDE_FEATURED_CONTENT,
        hideFeaturedContent: hideContent
    };
}

function viewAllClicked(typeFilteredActivities) {
    return {
        type: TYPES.VIEW_ALL_CLICKED,
        typeFilteredActivities: typeFilteredActivities
    };
}

export default {
    TYPES,
    updateFilteredActivityList,
    updateActivities,
    setNoStoreError,
    hideFeaturedContent,
    viewAllClicked
};
