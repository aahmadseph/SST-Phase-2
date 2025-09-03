import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { personalizationSelector } from 'viewModel/selectors/personalization/personalizationSelector';

const withSoftLinksProps = connect(
    createSelector(personalizationSelector, personalization => {
        const { personalizedComponent } = personalization;

        return {
            personalizedComponent
        };
    })
);

export { withSoftLinksProps };
