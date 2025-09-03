const { shallow } = require('enzyme');
const Head = require('components/Head/Head').default;
const PageTemplateType = require('constants/PageTemplateType').default;
const React = require('react');

describe('Head component', () => {
    let shallowComponent;
    let props;

    beforeEach(() => {
        props = {
            configurationSettings: { openGraph: {} },
            seoCanonicalUrl: 'beauty/new-skin-care-products'
        };
    });

    describe('Page Title', () => {
        it('should render Sephora as the page title', () => {
            shallowComponent = shallow(<Head {...props} />);

            const title = shallowComponent.find('title').at(0);
            expect(title.props().children).toEqual('Sephora');
        });

        it('should render the Location.pagesTitles value as the page title', () => {
            shallowComponent = shallow(
                <Head
                    {...props}
                    template={PageTemplateType.Gallery}
                />
            );

            const title = shallowComponent.find('title').at(0);
            expect(title.props().children).toEqual('Gallery | Sephora Community');
        });

        describe('Nth Category Page Title', () => {
            const template = PageTemplateType.NthCategory;
            const seoTitle = 'Nth Category Page Title';

            it('should render a title', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                expect(shallowComponent.find('title').length).toBe(1);
            });

            it('should render the seoTitle prop as the title value', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                const title = shallowComponent.find('title').at(0);
                expect(title.props().children).toEqual(seoTitle);
            });
        });

        describe('Search Page Title', () => {
            const template = PageTemplateType.Search;
            const seoTitle = 'Search Page Title';

            it('should render a title', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                expect(shallowComponent.find('title').length).toBe(1);
            });

            it('should render the seoTitle prop as the title value', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                const title = shallowComponent.find('title').at(0);
                expect(title.props().children).toEqual(seoTitle);
            });
        });

        describe('Content Page Title', () => {
            const template = PageTemplateType.ContentStore;
            const seoTitle = 'Content Page Title Title';

            it('should render a title', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                expect(shallowComponent.find('title').length).toBe(1);
            });

            it('should render the seoTitle prop as the title value', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                const title = shallowComponent.find('title').at(0);
                expect(title.props().children).toEqual(seoTitle);
            });
        });

        describe('Content Page Title (no nav)', () => {
            const template = PageTemplateType.ContentStoreNoNav;
            const seoTitle = 'Content Page Title (no nav)';

            it('should render a title', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                expect(shallowComponent.find('title').length).toBe(1);
            });

            it('should render the seoTitle prop as the title value', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                const title = shallowComponent.find('title').at(0);
                expect(title.props().children).toEqual(seoTitle);
            });
        });

        describe('BIRB Page Title - ILLUPH-105472 page title AC', () => {
            const template = 'Rewards/Rewards';
            const seoTitle = 'BIRB Page Title';

            it('should render a title', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                expect(shallowComponent.find('title').length).toBe(1);
            });

            it('should render the seoTitle prop as the title value', () => {
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                        seoTitle={seoTitle}
                    />
                );

                const title = shallowComponent.find('title').at(0);
                expect(title.props().children).toEqual(seoTitle);
            });
        });
    });

    describe('Referrer Page', () => {
        it('should render the correct image path', () => {
            const template = PageTemplateType.Referrer;
            const LOGO_PROMO_PATH = '/contentimages/promo/RMS/2020/sephora_logo_full.png';
            shallowComponent = shallow(
                <Head
                    {...props}
                    template={template}
                />
            );
            const metaImage = shallowComponent.findWhere(n => n.name() === 'meta' && n.props().property === 'og:image');
            expect(metaImage.prop('content')).toEqual(LOGO_PROMO_PATH);
        });
    });

    describe('Meta Description - ILLUPH-105472 meta description AC', () => {
        it('should render a meta description with the correct value when isCatalogPage', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.Category;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });

        it('should render a meta description with the correct value when NthCategory', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.NthCategory;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });

        it('should render a meta description with the correct value when it is Search', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.Search;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });

        it('should render a meta description with the correct value when isContentPage', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.ContentStoreNoNav;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });

        it('should render a meta description with the correct value when isStoreHubPage', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.StoreHub;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });

        it('should render a meta description with the correct value when isExperienceDetailsPage', () => {
            const seoMetaDescription = 'This is the meta description';
            props.template = PageTemplateType.ExperienceDetails;
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoMetaDescription={seoMetaDescription}
                />
            );

            const metaDescription = shallowComponent.find('meta[name="description"]');
            expect(metaDescription.props().content).toEqual(seoMetaDescription);
        });
    });

    describe('Canonical URL - ILLUPH-105472 canonical url AC', () => {
        const seoCanonicalUrl = '/rewards';

        it('should not render a canonical URL', () => {
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoCanonicalUrl={undefined}
                />
            );

            expect(shallowComponent.find('link[rel="canonical"]').length).toBe(0);
        });

        it('should render a canonical URL', () => {
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoCanonicalUrl={seoCanonicalUrl}
                />
            );

            expect(shallowComponent.find('link[rel="canonical"]').length).toBe(1);
        });

        it('should render a canonical URL with the correct value', () => {
            shallowComponent = shallow(
                <Head
                    {...props}
                    seoCanonicalUrl={seoCanonicalUrl}
                />
            );

            const canonicalUrl = shallowComponent.find('link[rel="canonical"]');
            expect(canonicalUrl.props().href).toEqual(`https://www.sephora.com${seoCanonicalUrl}`);
        });
    });

    describe('Adobe vendor property at_property', () => {
        it('should render a script element', () => {
            shallowComponent = shallow(<Head {...props} />);

            let setAtTargetScript = null;
            setAtTargetScript = shallowComponent.find('script').findWhere(n => n.prop('id') === 'setAtProperty');

            expect(setAtTargetScript.length).toBe(1);
        });
    });

    describe('OpenGraph data', () => {
        let template;
        const itShouldHaveCorrectOpenGraphData = () => {
            const openGraphData = [
                {
                    property: 'og:title',
                    content: 'ogTitle'
                },
                {
                    property: 'og:description',
                    content: 'ogDescription'
                },
                {
                    property: 'og:type',
                    content: 'ogType'
                },
                {
                    property: 'og:site_name',
                    content: 'ogSiteName'
                },
                {
                    property: 'og:url',
                    content: 'https://www.sephora.com/ogUrl'
                },
                {
                    property: 'fb:app_id',
                    content: 'fbAppId'
                },
                {
                    property: 'fb:admins',
                    content: 'fbAdmins'
                }
            ];
            openGraphData.forEach(({ property, content }) => {
                it(`should have correct ${property}`, () => {
                    const tag = shallowComponent.find('meta').findWhere(n => n.prop('property') === property);
                    expect(tag.at(0).prop('content')).toEqual(content);
                });
            });
        };

        beforeEach(() => {
            Sephora.configurationSettings.openGraph = {
                ogType: 'ogType',
                ogSiteName: 'ogSiteName',
                fbAppId: 'fbAppId',
                fbAdmins: 'fbAdmins'
            };
            props = {
                seoCanonicalUrl: '/ogUrl',
                seoTitle: 'ogTitle',
                seoMetaDescription: 'ogDescription'
            };
        });

        describe('Store Details Page', () => {
            beforeEach(() => {
                template = PageTemplateType.StoreDetail;
                shallowComponent = shallow(
                    <Head
                        {...props}
                        template={template}
                    />
                );
            });
            itShouldHaveCorrectOpenGraphData();
        });
    });
});
