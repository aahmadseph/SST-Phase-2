import Empty from 'constants/empty';

const itemSubstitutionSelector = store => store.itemSubstitution || Empty.Object;

export { itemSubstitutionSelector };
