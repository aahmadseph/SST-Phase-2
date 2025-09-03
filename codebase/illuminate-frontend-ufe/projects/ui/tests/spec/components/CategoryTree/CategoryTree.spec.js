const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;

describe('CategoryTree', () => {
    let CategoryTree;
    let component;
    let wrapper;
    let urlUtils;
    let props;
    let setStateStub;
    let getTreeStub;
    let formatRawDataToCategoryTreeStub;
    let getFullPathFromAbsoluteStub;
    let data;
    let result;
    let formatBranchStub;

    beforeEach(() => {
        CategoryTree = require('components/CategoryTree/CategoryTree').default;
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            props = {};
            wrapper = shallow(<CategoryTree {...props} />);
            component = wrapper.instance();
            getTreeStub = spyOn(component, 'getTree');
        });

        it('should call getTree', () => {
            component.componentDidMount();
            expect(getTreeStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTree', () => {
        beforeEach(() => {
            props = { categoryTreeData: true };
            wrapper = shallow(<CategoryTree {...props} />);
            component = wrapper.instance();
            formatRawDataToCategoryTreeStub = spyOn(component, 'formatRawDataToCategoryTree');
            setStateStub = spyOn(component, 'setState');
        });

        it('should setState', () => {
            component.getTree();
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState with returned value from formatRawDataToCategoryTree', () => {
            formatRawDataToCategoryTreeStub.and.returnValue('testVal');
            component.getTree();
            expect(setStateStub).toHaveBeenCalledWith({ categoryTreeList: 'testVal' });
        });
    });

    describe('getTree', () => {
        beforeEach(() => {
            props = {};
            wrapper = shallow(<CategoryTree {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should not call setState if categoryTreeData not passed', () => {
            component.getTree();
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    describe('formatRawDataToCategoryTree', () => {
        beforeEach(() => {
            wrapper = shallow(<CategoryTree />);
            component = wrapper.instance();
            formatBranchStub = spyOn(component, 'formatBranch');
        });

        it('should filter out non-object values', () => {
            data = {
                first: { a: 1 },
                second: 'stringVal',
                third: 13,
                fourth: undefined
            };
            component.formatRawDataToCategoryTree(data);
            expect(formatBranchStub.calls.argsFor(0)[0]).toEqual({ a: 1 });
        });

        it('should keep object values if there are more than one object passed', () => {
            data = {
                first: { a: 1 },
                second: { b: 2 },
                third: 'stringVal',
                fourth: 13,
                fifth: undefined
            };
            component.formatRawDataToCategoryTree(data);
            expect(formatBranchStub.calls.argsFor(0)[2]).toEqual([{ a: 1 }, { b: 2 }]);
        });
    });

    describe('formatBranch', () => {
        beforeEach(() => {
            wrapper = shallow(<CategoryTree {...props} />);
            component = wrapper.instance();
            urlUtils = require('utils/Url').default;
            getFullPathFromAbsoluteStub = spyOn(urlUtils, 'getFullPathFromAbsolute');
            getFullPathFromAbsoluteStub.and.returnValue('stubedUrlValue');
        });

        it('should return title and path in an object for an item without childCategories', () => {
            data = {
                displayName: 'someDisplayName',
                targetUrl: 'someUrl'
            };
            result = component.formatBranch(data);
            expect(result).toEqual({
                title: 'someDisplayName',
                path: 'stubedUrlValue'
            });
        });

        it('should not add path or title to object if displayName is not set', () => {
            data = { targetUrl: 'someUrl' };
            result = component.formatBranch(data);
            expect(result.path).not.toBeDefined();
            expect(result.title).not.toBeDefined();
        });

        it('should not add path or title to object if targetUrl is not set', () => {
            data = { displayName: 'someDisplayName' };
            result = component.formatBranch(data);
            expect(result.path).not.toBeDefined();
            expect(result.title).not.toBeDefined();
        });

        it('should not define children property of childCategories is undefined', () => {
            data = {};
            result = component.formatBranch(data);
            expect(result.children).not.toBeDefined();
        });

        it('should not define children property of childCategories length is zero', () => {
            data = { childCategories: [] };
            result = component.formatBranch(data);
            expect(result.children).not.toBeDefined();
        });

        it('should make recursive call if childCategories length is not zero', () => {
            spyOn(component, 'formatBranch').and.callThrough();

            data = { childCategories: [{ a: 1 }] };
            result = component.formatBranch(data);
            expect(component.formatBranch).toHaveBeenCalledWith({ a: 1 });
        });
    });
});
