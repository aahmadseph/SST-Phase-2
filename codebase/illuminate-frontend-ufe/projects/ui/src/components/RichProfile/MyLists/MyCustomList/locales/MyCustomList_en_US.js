export default function getResource(label, vars = []) {
    const resources = {
        myLists: 'My Lists',
        signIn: 'Sign In',
        signInToView: 'Sign in to organize and share your saved products.',
        weThinkYouWillLove: 'We Think You’ll Love',
        getTheseBeforeGone: 'Get These Before They’re Gone',
        item: 'item',
        items: 'items',
        edit: 'Edit',
        yourListIsEmpty: 'Your List is empty. Keep track of the beauty you’re eyeing by tapping the heart next to each product and selecting this List.',
        sharedListIsEmpty: 'The List owner hasn’t saved any products here yet. Please check back later.',
        browseProducts: 'Browse Products',
        share: 'Share',
        of: 'of',
        results: 'Results',
        result: 'Result',
        showMoreProducts: 'Show More Products',
        rouge: 'ROUGE',
        sharedList: 'shared List',
        sortText: 'Sort',
        cancel: 'Cancel'
    };
    return resources[label];
}
