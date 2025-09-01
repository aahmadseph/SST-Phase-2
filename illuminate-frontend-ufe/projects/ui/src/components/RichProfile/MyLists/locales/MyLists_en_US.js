export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Loves',
        myLists: 'My Lists',
        createNewList: 'Create New List',
        signIn: 'Sign In',
        signInToView: 'Sign in to organize and share your saved products.',
        weThinkYouWillLove: 'We Think You’ll Love',
        getTheseBeforeGone: 'Get These Before They’re Gone',
        item: 'item',
        items: 'items',
        of: 'of',
        results: 'Results',
        result: 'Result',
        emptyLists: 'You haven’t saved anything to your Lists. Tap the heart next to products you’re eyeing and choose a List to add them to.',
        somethingWentWrong: 'Something went wrong. Please try again.',
        gotIt: 'Got it',
        showMoreProducts: 'Show More Products',
        allSavedItems: 'All Saved Items',
        sortText: 'Sort',
        cancel: 'Cancel',
        recentlyAdded: 'Recently Added',
        sale: 'Sale',
        emptySaleFilter: 'Sorry, there are no products that match your filter choices.'
    };
    return resources[label];
}
