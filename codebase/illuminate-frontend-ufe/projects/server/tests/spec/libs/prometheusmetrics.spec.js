describe('prometheusMetrics', function() {

    let simplifyPath;

    beforeEach(async() => {
        const res = await import('#server/libs/prometheusMetrics.mjs');
        simplifyPath = res.simplifyPath;
    });

    it('simplifyPath product url', () => {
        const url = '/product/long-eyelashes-P1234';
        const result = simplifyPath(url);
        expect(result).toEqual('product');
    });

    it('simplifyPath homepage', () => {
        const url = '/';
        const result = simplifyPath(url);
        expect(result).toEqual('homepage');
    });

    it('simplifyPath rewards', () => {
        const url = '/rewards';
        const result = simplifyPath(url);
        expect(result).toEqual('rewards');
    });

    it('simplifyPath ca en rewards', () => {
        const url = '/ca/en/rewards';
        const result = simplifyPath(url);
        expect(result).toEqual('rewards');
    });

    it('simplifyPath ca fr rewards', () => {
        const url = '/ca/fr/rewards';
        const result = simplifyPath(url);
        expect(result).toEqual('rewards');
    });

    it('simplifyPath just fr rewards', () => {
        const url = '/fr/rewards';
        const result = simplifyPath(url);
        expect(result).toEqual('rewards');
    });

    it('simplifyPath productimages', () => {
        const url = '/productimages/some-fake-image.jpg';
        const result = simplifyPath(url);
        expect(result).toEqual('assets');
    });

    it('simplifyPath healthcheck', () => {
        const url = '/healthcheck';
        const result = simplifyPath(url);
        expect(result).toEqual('stats');
    });

    it('simplifyPath status', () => {
        const url = '/status';
        const result = simplifyPath(url);
        expect(result).toEqual('stats');
    });

    it('simplifyPath double leading slash', () => {
        const url = '//pizza';
        const result = simplifyPath(url);
        expect(result).toEqual('other');
    });

    it('simplifyPath empty path', () => {
        const url = '';
        const result = simplifyPath(url);
        expect(result).toEqual('homepage');
    });
});
