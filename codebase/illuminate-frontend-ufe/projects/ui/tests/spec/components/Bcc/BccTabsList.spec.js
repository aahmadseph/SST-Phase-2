const React = require('react');
const { shallow } = require('enzyme');
const BccTabsList = require('components/Bcc/BccTabsList/BccTabsList').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const urlUtils = require('utils/Url').default;

describe('BccTabsList component', () => {
    let componentList;
    let processStub;
    let onChildLoad;

    beforeEach(() => {
        processStub = spyOn(processEvent, 'process');
        spyOn(urlUtils, 'getParams').and.returnValue({ activeTab: [] });
        onChildLoad = jasmine.createSpy('onChildLoad');
    });

    describe('ctrlr', () => {
        it('should show component if 2 or more items are present', () => {
            // Arrange
            componentList = [{ defaultTab: false }, { defaultTab: false }];
            const props = { componentList, onChildLoad };

            // Act
            const wrapper = shallow(<BccTabsList {...props} />);

            // Assert
            expect(wrapper.state().showTabsList).toEqual(true);
        });

        it('should not show component if less than 2 items are present', () => {
            // Arrange
            componentList = [{ defaultTab: false }];
            const props = { componentList, onChildLoad };

            // Act
            const wrapper = shallow(<BccTabsList {...props} />);

            // Assert
            expect(wrapper.state().showTabsList).toEqual(false);
        });
    });

    describe('setActiveTab', () => {
        it('should set activeTab state with the index given', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            component.setActiveTab(3)();

            // Assert
            expect(component.state.activeTab).toEqual(3);
        });

        it('should track data based on selected tab', () => {
            // Arrange
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            component.setActiveTab(3, 'TabName')();

            // Assert
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    actionInfo: 'tab:TabName',
                    linkName: 'D=c55'
                }
            });
        });

        it('should track data based if there is not selected tab name', () => {
            // Arrange
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            component.setActiveTab(3)();

            // Assert
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    actionInfo: 'tab',
                    linkName: 'D=c55'
                }
            });
        });
    });

    describe('getActiveTab', () => {
        let tabs;

        beforeEach(() => {
            tabs = [{ defaultTab: false }, { defaultTab: false }, { defaultTab: false }];
        });

        it('should return 0 if no tab has defaultTab as true', () => {
            // Arrange
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            const activeTab = component.getActiveTab(tabs);

            // Assert
            expect(activeTab).toEqual(0);
        });

        it('should return the index of the item with defaultTab as true', () => {
            // Arrange
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();
            tabs[2].defaultTab = true;

            // Act
            const activeTab = component.getActiveTab(tabs);

            // Assert
            expect(activeTab).toEqual(2);
        });
    });

    it('should set the correct hoveredTab in state when setHoveredTab is invoked', () => {
        // Arrange
        const component = shallow(
            <BccTabsList
                componentList={[]}
                onChildLoad={onChildLoad}
            />
        ).instance();

        // Act
        component.setHoveredTab(2);

        // Assert
        expect(component.state.hoveredTab).toEqual(2);
    });

    it('should set hoveredTab as null in state when removeHoveredTab is invoked', () => {
        // Arrange
        const component = shallow(
            <BccTabsList
                componentList={[]}
                onChildLoad={onChildLoad}
            />
        ).instance();

        // Act
        component.removeHoveredTab();

        // Assert
        expect(component.state.hoveredTab).toEqual(null);
    });

    describe('getTabsList', () => {
        const tabs = [
            { defaultTab: false },
            { defaultTab: true },
            { defaultTab: false },
            { defaultTab: true },
            { defaultTab: false },
            { defaultTab: false }
        ];

        it('should return a max of 5 items', () => {
            // Arrange
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            const tabsList = component.getTabsList(tabs);

            // Assert
            expect(tabsList.length).toEqual(5);
        });

        it('should set first item defaultTab prop to true if more than one is set to true', () => {
            // Arrangr
            const component = shallow(
                <BccTabsList
                    componentList={[]}
                    onChildLoad={onChildLoad}
                />
            ).instance();

            // Act
            const tabsList = component.getTabsList(tabs);

            // Assert
            expect(tabsList[0].defaultTab).toEqual(true);
        });
    });
});
