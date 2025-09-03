/* eslint-disable max-len */
const React = require('react');
const { mount } = require('enzyme');

xdescribe('Markdown component', () => {
    let Markdown;
    let ReactDOM;

    beforeEach(() => {
        ReactDOM = require('react-dom');
        Markdown = require('components/Markdown/Markdown').default;
    });

    /**
     * Markdown.markedHtml
     * ====================
     * Unit-tests, described below, will help to test new/updated markdown library
     * in case if we'll decide to update it, and here we check if we still meet the AC for ILLUPH-74634
     */
    // TODO: Refactor to test the individualjiratoMarkdown and sanitize functions

    describe('Markdown.markedHtml', () => {
        let component;

        beforeEach(() => {
            const props = {
                content:
                    '*Bold* \n' +
                    '_Italic_ \n' +
                    '+Underlined+ \n' +
                    '-Strikethrough- \n' +
                    '^Superscript^ \n' +
                    '~Subscript~ \n' +
                    '{{Font selection}} \n' +
                    'h1. Font Size \n' +
                    '{color:red} Text color {color} \n' +
                    '* some\n' +
                    '* bullet\n' +
                    '# some\n' +
                    '# number\n' +
                    '* a\n' +
                    '* bulleted\n' +
                    '*# with\n' +
                    '*# nested\n' +
                    '*# numbered\n' +
                    '* list\n' +
                    '--- \n' +
                    'http://testsite.com/ \n' +
                    '|| heading 1 || heading 2 || heading 3 || \n' +
                    '| ---| ---| ---| \n' +
                    '| col A1| col A2| col A3| \n' +
                    '| col B1| col B2| col B3| \n' +
                    '{hr}\n' +
                    '{hr:#ff00ff}\n' +
                    '[http://google.com]\n' +
                    '[http://sephora.com|rel=nofollow]\n' +
                    '{serif}text{serif}\n' +
                    '{font-size:16px}text{font-size}\n' +
                    '{align:center}text{align}\n' +
                    '<a href="google.com">this should be sanitized</a>\n' +
                    '{anchor: tagId }' +
                    '{tab} \n' +
                    '{#} \n' +
                    '{^} \n' +
                    '{*} \n' +
                    '{+} \n' +
                    '{_} \n' +
                    '&copy; \n' +
                    '&bull; \n' +
                    '&trade; \n',
                targetWindow: 'same'
            };
            const wrapper = mount(<Markdown {...props} />);
            component = wrapper.instance();
        });

        it('should render unnamed link', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<a href="http://google.com" target="_self">http://google.com</a>');
        });

        it('should render unnamed link with rel value', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain(
                '<a href="http://sephora.com" rel="nofollow" target="_self">http://sephora.com</a>'
            );
        });

        describe('Links', () => {
            beforeEach(() => {
                const props = {
                    content:
                        'h1. sss \n' +
                        '[1 877 SEPHORA (1 877 737 4672)|tel:1-877-737-4672] \n' +
                        '[Yahoo|http://yahoo.com]\n' +
                        '[Sephora|http://sephora.com|color=blue]\n' +
                        '[Sephora|http://sephora.com|rel=nofollow]\n' +
                        '[Sephora|http://sephora.com|color=green|font-size=11px]' +
                        '[Sephora|http://sephora.com|color=red|font-family=serif|font-size=16px]\n' +
                        '[Link that launches a modal|modalMediaId=123456]\n' +
                        '&copy; \n',
                    targetWindow: 'same'
                };
                const wrapper = mount(<Markdown {...props} />);
                component = wrapper.instance();
                const element = ReactDOM.findDOMNode(component);
                spyOn(document, 'querySelector').and.callFake(function () {
                    const span = document.createElement('span');
                    element.appendChild(span);

                    return span;
                });
                component.ctrlr();
            });

            it('should render a link with a phone number', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('href="tel:1-877-737-4672"');
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('1 877 SEPHORA (1 877 737 4672)</a>');
            });

            it('should render named link', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('href="http://yahoo.com"');
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('Yahoo</a>');
            });

            it('should render named link with one style', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('href="http://sephora.com"');
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('Sephora</a>');
            });

            it('should render named link with two styles', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('href="http://sephora.com"');
            });

            it('should render named link with rel attribute', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('rel="nofollow"');
            });
            it('should render link with modal media id in data attribute', () => {
                expect(ReactDOM.findDOMNode(component).innerHTML).toContain('data-modalmediaid="123456"');
            });
            it('should attach a click handler to links that launch a modal', () => {
                const el = ReactDOM.findDOMNode(component).querySelectorAll('[data-modalMediaId]')[0];
                expect(el.onclick).toBeDefined();
            });
        });

        it('should render sanitize ', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('&lt;a href="google.com"&gt;this should be sanitized&lt;/a&gt;');
        });

        it('should render line break ruler', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<hr>');
        });

        it('should render colored line break ruler', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<hr style="color: #ff00ff;">');
        });

        it('should render serif text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<span style="font-family: georgia, times, serif;">text</span>');
        });

        it('should render size specific text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<span style="font-size:16px;">text</span>');
        });

        it('should render text with proper align', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<span style="display:block; text-align:center;">text</span>');
        });

        it('should render bold text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<strong>Bold</strong>');
        });

        it('should render italic text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<em>Italic</em>');
        });

        it('should render underlined text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<ins>Underlined</ins>');
        });

        it('should render strikethrough del tag', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<del>Strikethrough</del>');
        });

        it('should render superscript sup tag', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<sup>Superscript</sup>');
        });

        it('should render subscript sub tag', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<sub>Subscript</sub>');
        });

        it('should render special font selection', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<code>Font selection</code>');
        });

        it('should render h1 tag', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<h1 id="font-size">Font Size</h1>');
        });

        it('should render colored text', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<span style="color:red"> Text color </span>');
        });

        it('should render unordered list', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<ul>\n<li>some</li>\n<li>bullet</li>\n</ul>');
        });

        it('should render numbered list', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<ol>\n<li>some</li>\n<li>number</li>\n</ol>');
        });

        it('should render mixed nested lists', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain(
                '<ul>\n<li>a</li>\n<li>bulleted<ol>\n<li>with</li>\n<li>nested</li>\n<li>numbered</li>\n</ol>\n</li>\n<li>list</li>\n</ul>'
            );
        });

        it('should render table header', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<th>heading 1</th>');
        });

        it('should render table cell', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<td>col A1</td>');
        });

        it('should render hidden anchor link', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('<div id="tagId"></div>');
        });

        it('should render 3 space indentation', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('&nbsp;&nbsp;&nbsp;');
        });

        it('should render number symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('#');
        });

        it('should render hat symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('^');
        });

        it('should render asterisk', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('*');
        });

        it('should render splus sign', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('+');
        });

        it('should render underscore symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('_');
        });

        it('should render copyright symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('©');
        });

        it('should render bullet symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('•');
        });

        it('should render trademark symbol', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toContain('™');
        });
    });

    describe('Markdown with invalid content', () => {
        let component;

        beforeEach(() => {
            const wrapper = mount(<Markdown content={undefined} />);
            component = wrapper.instance();
        });

        it('should render an empty container', () => {
            expect(ReactDOM.findDOMNode(component).innerHTML).toBe('');
        });
    });

    describe('Markdown with overlay targetWindow', () => {
        let store;
        let dispatchStub;
        let component;

        beforeEach(() => {
            store = require('store/Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            const props = {
                targetWindow: 'Overlay',
                modalComponentTemplate: {}
            };
            const wrapper = mount(<Markdown {...props} />);
            component = wrapper.instance();
        });

        it('should open a BCC modal', () => {
            const eventStub = { preventDefault: () => {} };
            component.handleClick(eventStub, component.props.modalComponentTemplate);

            expect(dispatchStub).toHaveBeenCalled();
        });
    });
});
