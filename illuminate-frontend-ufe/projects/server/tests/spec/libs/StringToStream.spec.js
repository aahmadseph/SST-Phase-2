describe('StringToStream ', () => {

    let StringToStream,
        WritableStream;
    beforeEach(async() => {

        const res2 = await import('#server/libs/StringToStream.mjs');
        StringToStream = res2.default;
        const res3 = await import('#server/libs/WritableStream.mjs');
        WritableStream = res3.WritableStream;
    });

    it('can create a string 2 stream object', () => {

        const string2Stream = new StringToStream();

        expect(string2Stream).not.toBe(undefined);
    });

    it('can add string data to the string 2 stream object', (done) => {

        const wStream = new WritableStream();

        const tString = 'This is a string of data.';

        const string2Stream = new StringToStream({ data: tString });

        string2Stream.pipe(wStream);

        wStream.on('finish', () => {
            expect(wStream.toString()).toEqual(tString);
            done();
        });
    });
});
