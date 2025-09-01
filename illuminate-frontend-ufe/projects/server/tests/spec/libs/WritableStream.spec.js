describe('WritableStream ', () => {

    let WritableStream;
    beforeEach(async() => {

        const res3 = await import('#server/libs/WritableStream.mjs');
        WritableStream = res3.WritableStream;
    });

    it('can create a writeable stream', () => {

        const wStream = new WritableStream();

        expect(wStream).not.toBe(undefined);
    });

    it('can get the string data from a writeable stream', () => {

        const wStream = new WritableStream();

        const tString = 'This is a string of data.';

        wStream.write(tString);

        expect(wStream.toString()).toEqual(tString);
    });

    it('can get the raw buffer data from a writeable stream', () => {

        const wStream = new WritableStream();

        const bufMan = Buffer.from('This is a string of data.');

        wStream.write(bufMan);

        expect(wStream.getBuffer()).toEqual(bufMan);
    });

    it('can get the raw buffer data as an array from a writeable stream', () => {

        const wStream = new WritableStream();

        const bufMan = Buffer.from('This is a string of data.');

        wStream.write(bufMan);

        const bufferIsArray = Array.isArray(wStream.getBuffers());
        expect(bufferIsArray).toBeTruthy();
    });

    it('can get the length of the buffer data of the writeable stream', () => {

        const wStream = new WritableStream();

        const bufMan = Buffer.from('This is a string of data.');

        wStream.write(bufMan);

        expect(wStream.getBuffer().length).toEqual(bufMan.length);
    });

    it('can set max size of the writeable stream and fail when exceeded', (done) => {

        const Readable = require('stream').Readable;

        const wStream = new WritableStream({ maxRequestSize: 5 });

        const tString = 'This is a string of data.';

        const rSteam = new Readable();
        rSteam.push(tString);
        rSteam.push(null);

        rSteam.pipe(wStream)
            .on('error', (err) => {
                expect(err?.message).toEqual('Maximum data size exceeded 5 exceeded');
                done();
            });
    });

    it('set maxRequestSize to less than 0', () => {

        expect(() => {
            const wStream = new WritableStream({ maxRequestSize: -1 });
        }).toThrow(new Error('Invalid max request size -1'));
    });
});
