describe('MarkdownEnhancer utils', () => {
    let MarkdownEnhancer;
    let content;

    beforeEach(() => {
        MarkdownEnhancer = require('utils/MarkdownEnhancer').default;
        content =
            'Some initial text ' +
            '<Enhancer type="enhancerType" arguments="1,2,3">enhancer text </Enhancer>' +
            'some other text ' +
            '<Enhancer type="enhancerType">enhancer text </Enhancer>' +
            'some ending text';
    });

    describe('getEnhancerIndices', () => {
        it('should return the indices of the enhancers', () => {
            expect(MarkdownEnhancer.getEnhancerIndices(content)).toEqual({
                openingTags: [18, 107],
                closingTags: [80, 151]
            });
        });
    });

    describe('splitContent', () => {
        const enhancerIndices = {
            openingTags: [18, 107],
            closingTags: [80, 151]
        };
        it('should return the content divided by texts and enhancers', () => {
            expect(MarkdownEnhancer.splitContent(enhancerIndices, content)).toEqual([
                'Some initial text ',
                '<Enhancer type="enhancerType" arguments="1,2,3">enhancer text </Enhancer>',
                'some other text ',
                '<Enhancer type="enhancerType">enhancer text </Enhancer>',
                'some ending text'
            ]);
        });
    });

    describe('checkEnhancer', () => {
        it('should return true when the fragment is an Enhancer', () => {
            const enhancer = '<Enhancer type="enhancerType" arguments="1,2,3">enhancer text </Enhancer>';
            expect(MarkdownEnhancer.checkEnhancer(enhancer)).toBe(true);
        });

        it('should return false when the fragment is not an Enhancer', () => {
            const enhancer = 'It is just a text';
            expect(MarkdownEnhancer.checkEnhancer(enhancer)).toBe(false);
        });
    });

    describe('getContent', () => {
        it('should return the content inside the enhancer', () => {
            const enhancer = '<Enhancer type="enhancerType">enhancer text </Enhancer>';
            expect(MarkdownEnhancer.getContent(enhancer)).toEqual('enhancer text ');
        });
    });

    describe('convertSplittedContentToObjects', () => {
        it('should return an object when the fragment is an enhancer', () => {
            const fragments = [
                '<Enhancer type="enhancerType" arguments="1,2,3">enhancer text </Enhancer>',
                '<Enhancer type="enhancerType">enhancer text </Enhancer>'
            ];
            expect(MarkdownEnhancer.convertSplittedContentToObjects(fragments)).toEqual([
                {
                    args: '1,2,3',
                    content: 'enhancer text ',
                    enhancerType: 'enhancerType'
                },
                {
                    args: '',
                    content: 'enhancer text ',
                    enhancerType: 'enhancerType'
                }
            ]);
        });

        it('should return the same fragment when this is not an enhancer', () => {
            const fragment = ['This is not an enhancer'];
            expect(MarkdownEnhancer.convertSplittedContentToObjects(fragment)).toEqual(fragment);
        });
    });

    describe('getContentInObjects', () => {
        it('should return an array with texts and objects for each Enhancer inside', () => {
            expect(MarkdownEnhancer.getContentInObjects(content)).toEqual([
                'Some initial text ',
                {
                    args: '1,2,3',
                    content: 'enhancer text ',
                    enhancerType: 'enhancerType'
                },
                'some other text ',
                {
                    args: '',
                    content: 'enhancer text ',
                    enhancerType: 'enhancerType'
                },
                'some ending text'
            ]);
        });
        it('should return an empty array when an error occurs parsing the content', () => {
            const wrongContent = 'Some initial text </Enhancer type="enhancerType" arguments="1,2,3"enhancer text <Enhancer/>some ending text';
            expect(MarkdownEnhancer.getContentInObjects(wrongContent)).toEqual([]);
        });
    });
});
