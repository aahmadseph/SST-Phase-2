import React from 'react';
import { mount } from 'enzyme';
import IAViewInfo from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/IAViewInfo';
import dateUtils from 'utils/Date';

describe('IAViewInfo', () => {
    let wrapper;

    const mockTaxClaimGetText = key => {
        const textMap = {
            tribeNameLabel: 'Tribe Name',
            tribeIdLabel: 'Tribe ID',
            tribeReserveNameLabel: 'Tribe Reserve Name',
            idCardIssueDateLabel: 'ID Card Issue Date',
            idCardExpirationDateLabel: 'ID Card Expiration Date'
        };

        return textMap[key] || key;
    };

    const mockStyles = {
        flexContainer: {},
        viewLabel: {},
        viewLabelData: {}
    };

    beforeEach(() => {
        const mockStep4VariationData = {
            ia: {
                tribeName: 'Some Tribe',
                tribeIdNumber: 'T12345',
                tribeReserveName: 'Some Reserve',
                issueDate: '2023-04-10T00:00:00Z',
                expirationDate: '2024-04-10T00:00:00Z'
            }
        };

        wrapper = mount(
            <IAViewInfo
                step4VariationData={mockStep4VariationData}
                taxClaimGetText={mockTaxClaimGetText}
                styles={mockStyles}
            />
        );
    });

    it('should render tribe name correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(0);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(1);
        expect(texts.at(0).text()).toEqual('Tribe Name:');
        expect(texts.at(1).text()).toEqual('Some Tribe');
    });

    it('should render tribe ID correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(1);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(3);
        expect(texts.at(2).text()).toEqual('Tribe ID:');
        expect(texts.at(3).text()).toEqual('T12345');
    });

    it('should render tribe reserve name correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(2);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(5);
        expect(texts.at(4).text()).toEqual('Tribe Reserve Name:');
        expect(texts.at(5).text()).toEqual('Some Reserve');
    });

    it('should render ID card issue date correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(3);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(7);
        expect(texts.at(6).text()).toEqual('ID Card Issue Date:');
        expect(texts.at(7).text()).toEqual(dateUtils.formatDateMDY('2023-04-10T00:00:00Z'));
    });

    it('should render ID card expiration date correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(4);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(9);
        expect(texts.at(8).text()).toEqual('ID Card Expiration Date:');
        expect(texts.at(9).text()).toEqual(dateUtils.formatDateMDY('2024-04-10T00:00:00Z'));
    });
});
