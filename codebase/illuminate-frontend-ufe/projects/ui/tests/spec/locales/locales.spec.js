describe('Locales, ', function () {
    const resourceFiles = require('./ResourceList');
    const getLocaleResourceFile = require('utils/LanguageLocale').default.getLocaleResourceFile;

    resourceFiles.forEach(element => {
        describe(element.name, function () {
            element.languages.forEach(function (language) {
                describe(language, function () {
                    beforeEach(function () {
                        Sephora = Sephora || {};
                        Sephora.renderQueryParams = Sephora.renderQueryParams || {};
                        Sephora.renderQueryParams.language = language.toUpperCase();
                    });

                    it('should not crash when called', function () {
                        let hasCrashed = false;
                        try {
                            getLocaleResourceFile(element.path, element.name);
                        } catch (err) {
                            hasCrashed = true;
                        }
                        expect(hasCrashed).toBe(false);
                    });

                    it('should export a function', function () {
                        const getText = getLocaleResourceFile(element.path, element.name);
                        expect(typeof getText).toBe('function');
                    });
                });
            });
        });
    });
});
