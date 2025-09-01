import { createComponent } from 'components/RichProfile/MyAccount/TaxClaim/Steps/componentFactory';
import { taxStepMap } from 'components/RichProfile/MyAccount/TaxClaim/Steps/taxStepMap';

/**
 *
 * @param {*} param0 { componentProps, editMode }
 * @returns
 */
const StepMapper = ({ ...componentProps }) => {
    const steps = Object.keys(taxStepMap).map((type, index) => {
        const stepInfo = taxStepMap[type];

        const viewComponent = createComponent(type, 'view', {
            displayName: stepInfo.displayName,
            ...componentProps
        });

        const editComponent = createComponent(type, 'edit', {
            displayName: stepInfo.displayName,
            ...componentProps
        });

        return {
            label: `${index + 1}. ${stepInfo.title}`,
            content: {
                view: viewComponent,
                edit: editComponent
            }
        };
    });

    return steps;
};

export default StepMapper;
