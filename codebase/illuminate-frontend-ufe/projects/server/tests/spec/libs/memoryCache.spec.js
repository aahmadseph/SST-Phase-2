describe('memoryCache.js', () => {

    let memoryCache,
        memory;

    beforeEach(async () => {

        process.env.MAX_MEMORY_ITEMS = 2500;
        process.env.PURGE_ITEM_PERCENT = 20;

        memoryCache = await import('#server/libs/memoryCache.mjs?timestamp=41123');
        memory = memoryCache.getMemoryObject();
    });

    describe('splitHash', () => {

        it('url has dontCache in it', () => {
            const url = '/templateResolver?channel=MW&country=US&urlPath=%252Freviews&dontCache=true';
            const urlParts = memoryCache.splitHash(url);

            expect(urlParts).toBe(undefined);
        });

        it('url has no hash in it', () => {
            const url = '/templateResolver?channel=MW&country=US&urlPath=%252Freviews';
            const urlParts = memoryCache.splitHash(url);

            expect(urlParts).toBe(undefined);
        });

        it('url has a hash in it', () => {
            const url = '/templateResolver?hash=8675309abcdef8675309abcdef&channel=MW&country=US&urlPath=%252Freviews';
            const urlParts = memoryCache.splitHash(url);

            expect(urlParts.hash).toEqual('8675309abcdef8675309abcdef');
        });
    });

    describe('sort memory keys', () => {
        const memLen = -1;

        const DUMMY_HTML_DOC = '<html><body></body></html>';

        it('sort using accessCount and createTime', () => {

            const jend = 10;
            // stuff some data into memory
            for (let j = 0; j < jend; j++) {
                const URLS = [
                    `/templateResolver?hash=bca9d0ff8c09662bbc490615f114b414b642f066${j}&channel=MW&country=US&urlPath=%252Freviews${j}`,
                    `/templateResolver?hash=25f6d04522f3be232e58f314ec85663ef369cadc${j}&channel=FS&country=US&urlPath=%252F${j}`,
                    `/templateResolver?hash=25f6d04522f3be232e58f314ec85663ef369cadc${j}&channel=FS&country=US&urlPath=%252Fbasket${j}`
                ];
                for (let i = 0, end = URLS.length; i < end; i++) {
                    memoryCache.setMemoryCache(URLS[i], DUMMY_HTML_DOC);
                    const urlParts = memoryCache.splitHash(URLS[i]);
                    if (j === 4) {
                        memory.get(urlParts.refURL).accessCount = 1;
                        memory.get(urlParts.refURL).createTime += 2000 + i;
                    } else if (j === 6) {
                        memory.get(urlParts.refURL).accessCount += j + i + 2;
                        memory.get(urlParts.refURL).createTime += 2100 + i;
                    } else {
                        memory.get(urlParts.refURL).accessCount += j + i + 2;
                        memory.get(urlParts.refURL).createTime += j + i;
                    }
                }
            }

            const keys = Array.from(memory.keys());
            const sortedKeys = keys.sort(memoryCache.sortKeys);
            // least accessed and old but not oldest
            expect(sortedKeys[0]).toEqual('channel=fs&country=us&urlpath=%252fbasket6');
        });
    });

    describe('memory cache testing', () => {

        let urlParts;
        const url = '/templateResolver?hash=8675309abcdef8675309abcdef&channel=FS&country=US&urlPath=%252F',
            hashlessUrl = '/templateResolver?dontCache=true&channel=FS&country=US&urlPath=%252F',
            HTML_DOC = '<html><body>somebody\'s body</body></html>';

        // setup urlParts
        beforeEach(() => {
            urlParts = memoryCache.splitHash(url);
        });

        it('set an item in the memory cache with setMemoryCache', () => {
            memoryCache.setMemoryCache(url, HTML_DOC);

            expect(memory.get(urlParts.refURL).html).toEqual(HTML_DOC);
        });

        it('set an item in the memory cache with setMemoryCache', () => {
            memoryCache.setMemoryCache(url, HTML_DOC);

            const rc = memoryCache.setMemoryCache(url, HTML_DOC);

            expect(rc).toEqual(memoryCache.MEMORY_NOT_SET_EXISTS);
        });

        it('call setMemoryCache with no hash in URL', () => {

            try {
                memoryCache.setMemoryCache(hashlessUrl, HTML_DOC);
            } catch(e) {
                expect(e.toString()).toEqual('Error: Could not find hash in url!');
            }
        });

        it('call getMemoryCache with no hash in URL', () => {

            expect(memoryCache.getMemoryCache(hashlessUrl)['html']).toBe(undefined);
        });

        it('call dumpMemoryCache and should return something', () => {

            // set item
            memoryCache.setMemoryCache(url, HTML_DOC);

            // only one key so just direct delete of HTML part of this
            delete memory.get(urlParts.refURL).html;

            const items = memoryCache.dumpMemoryCache();

            expect(items[url]).toEqual(memory.get(url));
        });

        it('test purge event code', () => {

            const maxItems = (+process.env.MAX_MEMORY_ITEMS) + 5;
            for (let i = 0; i < maxItems; i++) {
                memoryCache.setMemoryCache(`${url}x${i}`, HTML_DOC);
            }
            const memorySize = Object.keys(memory);
            const sixtyPercentIsh = Math.ceil(maxItems - memoryCache.getPurgeItemsCount());
            expect(memorySize.length).toBeLessThan(sixtyPercentIsh + 1);
        });

        afterEach(() => {
            // delete this so as not to intefear with other tests
            delete memory.get(urlParts.refURL);
            memory = {};
        });
    });
});
