const React = require('react');

describe('ProductFinderModal component', () => {
    let ProductFinderModal;
    let shallowedComponent;

    let bccData;

    beforeEach(() => {
        bccData = {
            progressBarElementID: 'progress_id',
            insertionElementID: 'insertion_id',
            mobileSurveyNumber: 0,
            desktopSurveyNumber: 1,
            productFinderName: 'product_name',
            containerName: 'container_name',
            name: 'name'
        };
        const scriptUtils = require('utils/LoadScripts').default;
        spyOn(scriptUtils, 'loadScripts');
        ProductFinderModal = require('components/GlobalModals/ProductFinderModal/ProductFinderModal').default;
        shallowedComponent = enzyme.shallow(<ProductFinderModal bccData={bccData} />);
    });

    it('should render modal', () => {
        expect(shallowedComponent.find('Modal').length).toBe(1);
    });

    it('should render modal title', () => {
        expect(shallowedComponent.find('ModalTitle').prop('children')).toBe('product_name');
    });

    it('should render modal body', () => {
        expect(shallowedComponent.find('ModalBody').length).toBe(1);
    });
});
