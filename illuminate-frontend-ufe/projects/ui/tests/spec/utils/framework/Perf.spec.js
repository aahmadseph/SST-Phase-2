/* eslint-disable no-console */
describe('Perf.js', () => {
    const Perf = require('utils/framework/Perf').default;

    const label1 = 'string label 1',
        label2 = 'array label 2';

    const data1 = 'something something something',
        data2 = ['some a', 'some b', 'some c'];

    const time1in = 11468.09999999823,
        time1out = 11468.1,
        time2in = 24044.300000001385,
        time2out = 24044.3;

    beforeEach(() => {
        Perf.loadEvents = [];

        // normalizeTime converts time to 11468.1
        const event = {
            label: label1,
            data: data1,
            time: time1in,
            timestamp: true
        };

        Perf.loadEvents.push(event);

        // normalizeTime converts time to 24044.3
        const secondEvent = {
            label: label2,
            data: data2,
            time: time2in,
            timestamp: true
        };

        Perf.loadEvents.push(secondEvent);
    });

    afterEach(() => {
        Perf.loadEvents = [];
    });

    it('getLogs data is string', () => {
        Perf.loadEvents.pop();
        Perf.getLogs();

        const expected = time1out + ': ' + data1;

        expect(console.log).toHaveBeenCalledWith(expected);
    });

    it('getLogs data is array', () => {
        Perf.loadEvents.shift();
        Perf.getLogs();

        expect(console.log).toHaveBeenCalledWith(time2out + ':', data2[0], data2[1], data2[2]);
    });

    it('getLogs as table', () => {
        spyOn(console, 'table');

        Perf.getLogs({ outputAsTable: true });

        const expected = [
            {
                time: time1out,
                data: data1
            },
            {
                time: time2out,
                data: data2[0]
            }
        ];

        expect(console.table).toHaveBeenCalledWith(expected);
    });

    it('getSummary', () => {
        // Arrange
        spyOn(console, 'table');
        const oArg = {
            [label1]: time1out,
            [label2]: time2out
        };

        // Act
        Perf.getSummary();

        // Assert
        expect(console.table).toHaveBeenCalledWith(oArg);
    });

    it('getSummary should invoke printOutDynatraceStatistics function', () => {
        // Arrange
        const printOutDynatraceStatistics = spyOn(window.Sephora.performance.renderTime, 'printOutDynatraceStatistics');

        // Act
        Perf.getSummary();

        // Assert
        expect(printOutDynatraceStatistics).toHaveBeenCalledTimes(1);
    });

    it('getMeasurements', () => {
        Perf.loadEvents = [];
        Sephora.Util.Perf.report('HeadscriptRuntime Loaded');
        spyOn(console, 'table');

        Perf.getMeasurements();

        // TODO add to have been called with
        expect(console.table).toHaveBeenCalled();
    });

    // it('getEntrySize', () => {
    //     const filePath = '/img/ufe/logo.svg';

    //     Perf.getEntrySize(filePath);

    //     expect(console.log).toHaveBeenCalledWith(`Transfer size of ${filePath}: 0`);
    // });
});
