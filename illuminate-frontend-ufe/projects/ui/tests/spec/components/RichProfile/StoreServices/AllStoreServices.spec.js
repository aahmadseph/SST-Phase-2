const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const AllStoreServices = require('components/RichProfile/StoreServices/AllStoreServices').default;
const profileApi = require('services/api/profile').default;
const dsgUtil = require('utils/dsg').default;

describe('AllStoreServices component', () => {
    let getProfileSamplesByDSGStub;
    let combineSkusIntoServicesStub;
    let setStateSpy;
    let component;

    beforeEach(() => {
        combineSkusIntoServicesStub = spyOn(dsgUtil, 'combineSkusIntoServices').and.returnValue([]);
    });

    describe('get profile samples', () => {
        it('should call the get profile samples api', () => {
            const profileId = 123456;
            const wrapper = shallow(<AllStoreServices />);
            component = wrapper.instance();

            getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.returnValue({ then: createSpy() });
            component.getProfileSamples(profileId);

            expect(getProfileSamplesByDSGStub).toHaveBeenCalledWith(profileId, {
                itemsPerPage: 46,
                includeInactiveSkus: true,
                currentPage: 1,
                limit: 46
            });
        });

        it('should format the skus if skus exist', done => {
            const resolveData = [{}];
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(combineSkusIntoServicesStub).toHaveBeenCalledWith(resolveData);
                    done();
                }
            };

            const wrapper = shallow(<AllStoreServices />);
            component = wrapper.instance();

            getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.returnValue(fakePromise);
            component.getProfileSamples();
        });

        it('should setState with appropriate values', done => {
            const resolveData = [{}];
            const fakePromise = {
                then: resolve => {
                    resolve(resolveData);
                    expect(setStateSpy).toHaveBeenCalledWith({
                        services: [],
                        skus: [{}],
                        shouldShowMore: false,
                        currentPage: 2,
                        limit: 90
                    });
                    done();
                }
            };

            const wrapper = shallow(<AllStoreServices />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');

            getProfileSamplesByDSGStub = spyOn(profileApi, 'getProfileSamplesByDSG').and.returnValue(fakePromise);
            component.getProfileSamples();
        });
    });

    describe('show more services', () => {
        it('should get more profile samples', () => {
            const event = { preventDefault: createSpy() };
            const wrapper = shallow(<AllStoreServices />);
            component = wrapper.instance();

            const getProfileSamplesStub = spyOn(component, 'getProfileSamples');
            component.showMoreServices(event);

            expect(getProfileSamplesStub).toHaveBeenCalled();
        });
    });
});
