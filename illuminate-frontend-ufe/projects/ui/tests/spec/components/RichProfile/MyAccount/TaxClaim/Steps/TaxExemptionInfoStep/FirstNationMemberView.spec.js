import React from 'react';
import { mount } from 'enzyme';
import FirstNationMemberView from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/FirstNationMemberView';

describe('FirstNationMemberView', () => {
    let wrapper;
    const mockTaxClaimGetText = key => {
        const textMap = {
            registrationNumber: 'Registration Number',
            alias: 'Alias',
            registryGroupNumber: 'Registry Group Number',
            registryBandName: 'Registry Band Name',
            nameOfReservation: 'Name of Reservation',
            issueDateInputLabel: 'Issue Date',
            expirationDateInputLabel: 'Expiration Date',
            none: 'None'
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
            registrationNumber: '12345',
            alias: 'AliasName',
            registryGroupNumber: 'GroupNumber',
            registryBandName: 'BandName',
            nameOfReservation: 'ReservationName',
            expirationDate: '2024-12-31',
            issueDate: '2023-01-01'
        };

        wrapper = mount(
            <FirstNationMemberView
                step4VariationData={mockStep4VariationData}
                taxClaimGetText={mockTaxClaimGetText}
                styles={mockStyles}
            />
        );
    });

    it('should render registration number correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(0);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(1);
        expect(texts.at(0).text()).toEqual('Registration Number:');
        expect(texts.at(1).text()).toEqual('12345');
    });

    it('should render alias correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(1);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(3);
        expect(texts.at(2).text()).toEqual('Alias:');
        expect(texts.at(3).text()).toEqual('AliasName');
    });

    it('should render registry group number correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(2);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(5);
        expect(texts.at(4).text()).toEqual('Registry Group Number:');
        expect(texts.at(5).text()).toEqual('GroupNumber');
    });

    it('should render registry band name correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(3);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(7);
        expect(texts.at(6).text()).toEqual('Registry Band Name:');
        expect(texts.at(7).text()).toEqual('BandName');
    });

    it('should render name of reservation correctly', () => {
        const boxes = wrapper.find('Step4ViewModeComponent');
        expect(boxes.length).toBeGreaterThan(4);
        const texts = boxes.find('Text');
        expect(texts.length).toBeGreaterThan(9);
        expect(texts.at(8).text()).toEqual('Name of Reservation:');
        expect(texts.at(9).text()).toEqual('ReservationName');
    });
});
