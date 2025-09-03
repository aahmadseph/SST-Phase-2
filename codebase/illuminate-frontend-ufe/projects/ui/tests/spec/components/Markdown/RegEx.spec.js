describe('RegEx', function () {
    let RegEx;

    beforeEach(function () {
        RegEx = require('components/Markdown/RegEx').default;
    });

    using(
        'urls',
        [
            {
                value: 'https://www.google.com',
                check: true
            },
            {
                value: 'http://www.google.com',
                check: true
            },
            {
                value: 'htt://www.google.com',
                check: false
            },
            {
                value: '://www.google.com',
                check: false
            },
            {
                value: 'http//www.google.com',
                check: false
            },
            {
                value: 'www.google.com',
                check: true
            },
            {
                value: 'www://www.google.com',
                check: false
            },
            {
                value: '://www.google.com:80',
                check: false
            },
            {
                value: 'https://www.google.com:80',
                check: true
            },
            {
                value: 'www.google.com:80',
                check: true
            },
            {
                value: 'www.google.com:80/',
                check: true
            },
            {
                value: 'www.google.com:80/asdfasdf',
                check: true
            },
            {
                value: 'www.google.com:80/asdfasdf/ghwergsdf',
                check: true
            }
        ],
        config => {
            it('should detected correct urls presense and value for ' + config.value, function () {
                expect(RegEx.isUrl(config.value)).toEqual(config.check);
            });
        }
    );

    using(
        'modal media ids',
        [
            {
                value: 'modalMediaIdwerwer',
                check: false
            },
            {
                value: 'modalMediaId==dfghdfg',
                check: false
            },
            {
                value: 'modalMediaId=!wert',
                check: false
            },
            {
                value: 'www.modalMediaId.com',
                check: false
            },
            {
                value: 'modalMediaId=dfghdfg',
                check: true
            },
            {
                value: 'modalMediaId=324dfghdfg',
                check: true
            },
            {
                value: 'modalMediaId=dfghdfg3456',
                check: true
            },
            {
                value: 'modalMediaId=dfghdfg3456$',
                check: true
            }
        ],
        config => {
            it('should detected correct modal media Id presense and value for ' + config.value, function () {
                expect(RegEx.isMediaId(config.value)).toEqual(config.check);
            });
        }
    );
});
