import { createStructuredSelector } from 'reselect';
import { isAnonymousSelector } from 'selectors/auth/isAnonymousSelector';
import isInitializedSelector from 'selectors/user/isInitializedSelector';
import profileIdSelector from 'selectors/user/profileIdSelector';
import beautyInsiderAccountIdSelector from 'selectors/user/beautyInsiderAccount/biIdSelector';
import { firstNameSelector } from 'viewModel/selectors/user/firstNameSelector';
import { isSDUFeatureDownSelector } from 'viewModel/selectors/user/isSDUFeatureDownSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
import defaultSAZipCodeSelector from 'selectors/user/defaultSAZipCodeSelector';
import { isSDDRougeFreeShipEligibleSelector } from 'viewModel/selectors/user/isSDDRougeFreeShipEligibleSelector';

const { preferredZipCodeSelector } = PreferredZipCodeSelector;

const coreUserDataSelector = createStructuredSelector({
    isAnonymous: isAnonymousSelector,
    isInitialized: isInitializedSelector,
    userId: profileIdSelector,
    biId: beautyInsiderAccountIdSelector,
    firstName: firstNameSelector,
    isSDUFeatureDown: isSDUFeatureDownSelector,
    preferredZipCode: preferredZipCodeSelector,
    isSDDRougeFreeShipEligible: isSDDRougeFreeShipEligibleSelector,
    defaultSAZipCode: defaultSAZipCodeSelector
});

export { coreUserDataSelector };
