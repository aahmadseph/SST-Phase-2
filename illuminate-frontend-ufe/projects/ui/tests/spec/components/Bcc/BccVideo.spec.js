const React = require('react');
const { shallow } = require('enzyme');
const { any, objectContaining, createSpy } = jasmine;

describe('BccVideo component', () => {
    let Video;
    let Player;
    let store;
    // let anaConsts;
    // let processEvent;
    let component;
    let wrapper;
    let props;
    let SHOW_VIDEO_MODAL;

    beforeEach(() => {
        const scriptUtils = require('utils/LoadScripts').default;
        spyOn(scriptUtils, 'loadScripts');
        SHOW_VIDEO_MODAL = require('Actions').default.TYPES.SHOW_VIDEO_MODAL;
        Video = require('components/Bcc/BccVideo/BccVideo').default;
        Player = require('services/api/thirdparty/Player').default;
        store = require('Store').default;
        // anaConsts = require('analytics/constants').default;
        // processEvent = require('analytics/processEvent').default;
    });

    describe('ctrlr', () => {
        it('should get the player instance if going to be rendered as part of the page', () => {
            // Arrange
            const getByVideoId = spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());

            // Act
            shallow(<Video />);

            // Assert
            expect(getByVideoId).toHaveBeenCalled();
        });

        it('should subscribe on tracking events', done => {
            // Arrange
            props = { videoId: 'videoId' };
            const resolvedPromise = Promise.resolve({});
            spyOn(Player, 'getByVideoId').and.returnValue(resolvedPromise);
            component = shallow(<Video {...props} />).instance();
            const subscribeOnTrackingEvents = spyOn(component, 'subscribeOnTrackingEvents');

            // Act
            component.componentDidMount();

            // Assert
            resolvedPromise.then(() => {
                expect(subscribeOnTrackingEvents).toHaveBeenCalled();
                done();
            });
        });

        it('should subscribe on fullscreen mode change', done => {
            // Arrange
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            const resolvedPromise = Promise.resolve({});
            spyOn(Player, 'getByVideoId').and.returnValue(resolvedPromise);
            component = shallow(<Video {...props} />).instance();
            const subscribeOnChangeFullScreenMode = spyOn(component, 'subscribeOnChangeFullScreenMode');

            // Act
            component.componentDidMount();

            // Assert
            resolvedPromise.then(() => {
                expect(subscribeOnChangeFullScreenMode).toHaveBeenCalled();
                done();
            });
        });

        it('should subscribe on window debounced scroll', () => {
            // Arrange
            props = { videoId: 'videoId' };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            const addEventListener = spyOn(window, 'addEventListener');

            // Act
            shallow(<Video {...props} />);

            // Assert
            expect(addEventListener).toHaveBeenCalled();
        });
    });

    describe('onVideoSelect', () => {
        let getByVideoId;
        let getByVideoIdPromise;
        let subscribeOnTrackingEvents;

        beforeEach(() => {
            getByVideoIdPromise = Promise.resolve({ ready: createSpy('ready') });
            getByVideoId = spyOn(Player, 'getByVideoId').and.returnValue(getByVideoIdPromise);

            props = {
                videoId: 'videoId',
                startImagePath: 'previewImage',
                videoTitle: 'videoTitle'
            };
            component = shallow(<Video {...props} />).instance();
            subscribeOnTrackingEvents = spyOn(component, 'subscribeOnTrackingEvents');
        });

        it('should get the player instance', () => {
            // Act
            component.onVideoSelect();

            // Assert
            expect(getByVideoId).toHaveBeenCalled();
        });

        it('should subscribe on tracking player events when onVideoSelect function invoked', done => {
            // Act
            component.onVideoSelect();

            // Assert
            getByVideoIdPromise.then(() => {
                expect(subscribeOnTrackingEvents).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('subscribeOnChangeFullScreenMode', () => {
        it('should subscribe on player "fullscreenchange" event', () => {
            // Arrange
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            const player = { on: createSpy('on') };

            // Act
            shallow(<Video {...props} />)
                .instance()
                .subscribeOnChangeFullScreenMode(player, () => {});

            // Assert
            expect(player.on).toHaveBeenCalledWith('fullscreenchange', any(Function));
        });

        it('should subscribe on player "fullscreenchange" event only once', () => {
            // Arrange
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            const player = { on: createSpy('on') };
            component = shallow(<Video {...props} />).instance();

            // Act
            component.subscribeOnChangeFullScreenMode(player, () => {});
            component.subscribeOnChangeFullScreenMode(player, () => {});

            // Assert
            expect(player.on).toHaveBeenCalledTimes(1);
        });

        it('should invoke event handler when fullscreen mode changed', () => {
            // Arrange
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            const player = { on: createSpy('on') };
            const eventHandler = createSpy('callback');

            // Act
            shallow(<Video {...props} />)
                .instance()
                .subscribeOnChangeFullScreenMode(player, eventHandler);
            player.on.calls.first().args[1]();

            // Assert
            expect(eventHandler).toHaveBeenCalled();
        });
    });

    describe('restoreWindowScrollPosition', () => {
        it('should restore scroll position from internal state', () => {
            // Arrange
            const scroll = spyOn(window, 'scroll');
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            component = shallow(<Video {...props} />).instance();
            component.windowPosition = {
                pageXOffset: 1,
                pageYOffset: 2
            };

            // Act
            component.restoreWindowScrollPosition();

            // Assert
            expect(scroll).toHaveBeenCalledWith(component.windowPosition.pageXOffset, component.windowPosition.pageYOffset);
        });

        it('should not restore scroll position when internal state is null or undefined', () => {
            // Arrange
            const scroll = spyOn(window, 'scroll');
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());

            // Act
            shallow(<Video {...props} />)
                .instance()
                .restoreWindowScrollPosition();

            // Assert
            expect(scroll).not.toHaveBeenCalled();
        });

        it('should not restore scroll position from internal state when Y axis shift equals zero', () => {
            // Arrange
            const scroll = spyOn(window, 'scroll');
            props = {
                videoId: 'videoId',
                overlayFlag: true
            };
            spyOn(Player, 'getByVideoId').and.returnValue(Promise.resolve());
            component = shallow(<Video {...props} />).instance();
            component.windowPosition = {
                pageXOffset: 1,
                pageYOffset: 0
            };

            // Act
            component.restoreWindowScrollPosition();

            // Assert
            expect(scroll).not.toHaveBeenCalled();
        });
    });

    describe('subscribeOnTrackingEvents', () => {
        let getByVideoId;
        let getByVideoIdPromise;
        let player;

        beforeEach(() => {
            player = {
                on: createSpy('on'),
                ready: createSpy('ready'),
                // ready: callback => callback(),
                play: createSpy('play'),
                mediainfo: { duration: 100 },
                currentTime: createSpy('currentTime').and.returnValue(10)
            };
            getByVideoIdPromise = Promise.resolve(player);
            getByVideoId = spyOn(Player, 'getByVideoId').and.returnValue(getByVideoIdPromise);

            props = {
                videoId: 'videoId',
                startImagePath: 'previewImage',
                videoTitle: 'videoTitle'
            };
            component = shallow(<Video {...props} />).instance();
        });

        it('should select a proper video out of all the videos on the page', () => {
            // Act
            component.subscribeOnTrackingEvents(player);

            // Assert
            expect(getByVideoId).toHaveBeenCalledWith(props.videoId);
        });

        it('should subscribe on "timeupdate" player event', () => {
            // Act
            component.subscribeOnTrackingEvents(player);

            // Assert
            expect(player.on).toHaveBeenCalledWith('timeupdate', any(Function));
        });
    });

    describe('openVideoModal', () => {
        it('should open video modal', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const video = [];
            const videoTitle = 'videoTitle';
            props = {
                videoId: 'videoId',
                startImagePath: 'previewImage',
                videoTitle
            };

            // Action
            wrapper = shallow(<Video {...props} />);
            component = wrapper.instance();
            component.video = video;
            component.openVideoModal();

            // Assert
            expect(dispatch).toHaveBeenCalledWith(
                objectContaining({
                    type: SHOW_VIDEO_MODAL,
                    isOpen: true,
                    videoTitle,
                    videoModalUpdated: any(Function),
                    video
                })
            );
        });
    });

    // describe('trackPlay', () => {
    //     let process;

    //     beforeEach(() => {
    //         // Arrange
    //         props = {
    //             name: 'playerName',
    //             videoId: 'videoId',
    //             startImagePath: 'previewImage',
    //             videoTitle: 'videoTitle'
    //         };
    //         component = shallow(<Video {...props} />).instance();
    //         process = spyOn(processEvent, 'process');
    //     });

    //     it('should trigger link tracking event for analytics', () => {
    //         // Act
    //         component.sendAnalyticsEvent([]);

    //         // Assert
    //         expect(process.calls.mostRecent().args[0]).toEqual(anaConsts.LINK_TRACKING_EVENT);
    //     });

    //     it('should pass proper analytics data with link tracking event', () => {
    //         // Arrange
    //         const context = {
    //             data: {
    //                 bindingMethods: require('analytics/bindings/pages/all/videoLoad').default,
    //                 eventStrings: ['some event 1', 'some event 2'],
    //                 videoName: [props.name, props.videoId],
    //                 linkName: 'video popup',
    //                 actionInfo: 'video popup'
    //             }
    //         };

    //         // Act
    //         component.sendAnalyticsEvent(['some event 1', 'some event 2']);

    //         // Assert
    //         expect(process.calls.mostRecent().args[1]).toEqual(context);
    //     });
    // });

    describe('player render', () => {
        beforeEach(() => {
            // Arrange
            props = {
                name: 'playerName',
                videoId: 'videoId',
                startImagePath: 'previewImage',
                videoTitle: 'videoTitle'
            };
        });

        it('should insert player component onto the page', () => {
            // Act
            wrapper = shallow(<Video {...props} />);

            // Assert
            expect(wrapper.find('video-js').exists()).toBeTruthy();
        });

        it('should pass videoId to player if its numeric', () => {
            // Act
            props.videoId = '123456789';
            wrapper = shallow(<Video {...props} />);
            const player = wrapper.find('video-js');

            // Assert
            expect(player.prop('data-video-id')).toEqual(props.videoId);
        });

        it('should pass videoId with prefix if its alpha-numeric', () => {
            // Arrange
            props.videoId = 'a123456789';
            const dataVideoIdValue = `ref:${props.videoId}`;

            // Act
            wrapper = shallow(<Video {...props} />);

            // Assert
            expect(wrapper.find('video-js').prop('data-video-id')).toEqual(dataVideoIdValue);
        });

        it('should setup default player for the component', () => {
            // Act
            wrapper = shallow(<Video {...props} />);
            const player = wrapper.find('video-js');

            // Assert
            expect(player.prop('data-player')).toEqual('default');
        });

        it('should setup default embed mode for the player', () => {
            // Act
            wrapper = shallow(<Video {...props} />);
            const player = wrapper.find('video-js');

            // Assert
            expect(player.prop('data-embed')).toEqual('default');
        });

        it('should enable controls for the player', () => {
            // Act
            wrapper = shallow(<Video {...props} />);
            const player = wrapper.find('video-js');

            // Assert
            expect(player.prop('controls')).toBeDefined();
        });
    });
});
