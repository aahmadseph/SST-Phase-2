const { shallow } = require('enzyme');
const React = require('react');
const FooterLinks = require('components/Footer/FooterLinks/FooterLinks').default;

describe('<FooterLinks /> component', () => {
    let props;
    let shallowComponent;
    let parentLinks;
    let childrenLinks;
    const sephoraRWDLink = 'Sephora RWD Link Component';

    beforeEach(() => {
        props = {
            links: [
                {
                    titleText: 'Parent Link 1',
                    componentList: [
                        {
                            targetUrl: 'https://childlink.com/1',
                            titleText: 'Child Link 1'
                        },
                        {
                            targetUrl: 'https://childlink.com/2',
                            titleText: 'Child Link 2'
                        },
                        {
                            targetUrl: 'https://childlink.com/3',
                            titleText: 'Child Link 3'
                        }
                    ]
                },
                {
                    titleText: 'Parent Link 2',
                    componentList: [
                        {
                            targetUrl: 'https://childlink.com/4',
                            titleText: 'Child Link 4'
                        },
                        {
                            targetUrl: 'https://childlink.com/5',
                            titleText: 'Child Link 5'
                        },
                        {
                            targetUrl: 'https://childlink.com/6',
                            titleText: 'Child Link 6'
                        }
                    ]
                },
                {
                    componentList: [
                        {
                            componentName: sephoraRWDLink,
                            componentType: 92,
                            targetUrl: '/beauty/makeup-brush-guide',
                            targetWindow: 0,
                            titleText: 'BCC RWD Sublink 1'
                        },
                        {
                            componentName: 'Sephora RWD Link Component',
                            componentType: 92,
                            targetUrl: '/beauty/big-brow-energy',
                            titleText: 'BCC RWD Sublink 2'
                        }
                    ],
                    componentName: sephoraRWDLink,
                    componentType: 92,
                    style: { FR_CA_HIDE: 'true' },
                    targetWindow: 0,
                    titleText: 'BCC RWD Link'
                }
            ],
            parentStyles: { heading: {} }
        };
        shallowComponent = shallow(<FooterLinks {...props} />);

        // Check for links which don't have Child in the title (based on props)
        parentLinks = shallowComponent.find('Link').filterWhere(n => n.prop('children').indexOf('Child') === -1);
        // Check for links which have Child in the title (based on props)
        childrenLinks = shallowComponent.find('BccRwdLinkHOC').filterWhere(n => n.prop('children').indexOf('Child') > -1);
    });

    it('should display the top links ', () => {
        expect(parentLinks.length).toBe(3);
    });

    it('should display the children links ', () => {
        expect(childrenLinks.length).toBe(0);
    });

    it('should set state when user click on a parent link', () => {
        const component = shallowComponent.instance();
        const setStateStub = spyOn(component, 'setState');
        const parentLink = parentLinks.at(0);
        parentLink.simulate('click');
        expect(setStateStub).toHaveBeenCalled();
    });
});
