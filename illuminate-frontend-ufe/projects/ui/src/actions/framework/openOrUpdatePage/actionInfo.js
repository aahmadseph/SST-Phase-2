import spaPagesActions from 'constants/spaPagesActions';

const createPageActionTuple = pageContext => {
    const { isNewPage, openPage, updatePage } /*: PageActionCreators*/ = spaPagesActions[pageContext.newPageTemplate];

    const newPage = isNewPage(pageContext);
    const openOrUpdatePageAction = newPage ? openPage(pageContext) : updatePage(pageContext);

    return [newPage, openOrUpdatePageAction];
};

export default { createPageActionTuple };
