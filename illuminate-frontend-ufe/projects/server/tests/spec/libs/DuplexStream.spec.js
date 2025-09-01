describe('DuplexStream ', () => {

    let DuplexStream,
        StringToStream,
        WritableStream;
    beforeEach(async() => {

        const res1 = await import('#server/libs/DuplexStream.mjs');
        DuplexStream = res1.DuplexStream;
        const res2 = await import('#server/libs/StringToStream.mjs');
        StringToStream = res2.default;
        const res3 = await import('#server/libs/WritableStream.mjs');
        WritableStream = res3.WritableStream;
    });

    it('can create a duplex stream object', () => {

        const string2Stream = new DuplexStream();

        expect(string2Stream).not.toBe(undefined);
    });

    describe('can add string data to the duplex stream object', () => {

        const tString = 'This is a string of data.'.repeat(10000);

        let wStream,
            string2Stream;
        beforeEach(() => {
            wStream = new DuplexStream();

            string2Stream = new StringToStream({ data: tString });

        });

        it('can add string data to the duplex stream object', (done) => {

            string2Stream.pipe(wStream).pipe(new WritableStream());
            wStream.on('finish', () => {
                expect(wStream.toString()).toEqual(tString);
                done();
            });
        });

        it('can add string data to the duplex stream object get buffer', (done) => {

            string2Stream.pipe(wStream);
            wStream.on('finish', () => {
                expect(wStream.getBuffer().toString()).toEqual(tString);
                done();
            });
        });

        it('can add string data to the duplex stream object get buffers', (done) => {

            string2Stream.pipe(wStream);
            wStream.on('finish', () => {
                expect(Buffer.concat(wStream.getBuffers()).toString()).toEqual(tString);
                done();
            });
        });

        it('can add string data to the duplex stream object get length', (done) => {

            string2Stream.pipe(wStream);
            wStream.on('finish', () => {
                expect(wStream.getLength()).toEqual(tString.length);
                done();
            });
        });
    });

    it('error too little max size', () => {

        try {
            const wStream = new DuplexStream({ maxRequestSize: -5 });
        } catch (e) {
            expect(e.toString()).toEqual('Error: Invalid max request size -5');
        }
    });

    it('error on too much data to the duplex stream object', (done) => {

        const wStream = new DuplexStream({ maxRequestSize: 5 });

        const tString = 'This is a string of data.';

        const string2Stream = new StringToStream({ data: tString });

        string2Stream.pipe(wStream).pipe(new WritableStream());

        wStream.on('error', (e) => {
            expect(e.toString()).toEqual('Error: Maximum data size exceeded 5 exceeded');
            done();
        });
    });
});
