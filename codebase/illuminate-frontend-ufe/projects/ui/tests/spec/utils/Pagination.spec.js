const paginationUtils = require('utils/Pagination').default;
const anaConsts = require('analytics/constants').default;
const processEvent = require('analytics/processEvent').default;

describe('Pagination Utils', () => {
    describe('sendAnalytics()', () => {
        let processSpy;
        let args;
        let opts;

        beforeEach(() => {
            processSpy = spyOn(processEvent, 'process');
            args = {
                pageName: 'ratings&reviews',
                pageIndex: 1,
                buttonType: paginationUtils.BUTTON_TYPES.NUMBER
            };
            opts = {
                data: {
                    eventStrings: ['event71'],
                    linkName: 'D=c55',
                    actionInfo: ''
                }
            };
        });

        it('should call process() with a valid args for a page number case', () => {
            opts.data.actionInfo = `${args.pageName}:pagination:${args.pageIndex}`;

            paginationUtils.sendAnalytics(args.pageName, args.pageIndex, args.buttonType);

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, opts);
        });

        it('should call process() with a valid args for a previous page case', () => {
            args.buttonType = paginationUtils.BUTTON_TYPES.LEFT;
            opts.data.actionInfo = `${args.pageName}:pagination:previous`;

            paginationUtils.sendAnalytics(args.pageName, args.pageIndex, args.buttonType);

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, opts);
        });

        it('should call process() with a valid args for a next page case', () => {
            args.buttonType = paginationUtils.BUTTON_TYPES.RIGHT;
            opts.data.actionInfo = `${args.pageName}:pagination:next`;

            paginationUtils.sendAnalytics(args.pageName, args.pageIndex, args.buttonType);

            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, opts);
        });
    });
});
