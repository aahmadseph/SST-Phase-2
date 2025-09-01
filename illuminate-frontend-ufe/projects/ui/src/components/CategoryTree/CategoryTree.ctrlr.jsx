/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';
import { Box, Text, Divider } from 'components/ui';
import CategoryRoot from 'components/CategoryTree/CategoryRoot/CategoryRoot';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import localeUtils from 'utils/LanguageLocale';
import UrlUtils from 'utils/Url';

class CategoryTree extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            categoryTreeList: []
        };
    }

    render() {
        const isMobile = Sephora.isMobile();
        const getText = localeUtils.getLocaleResourceFile('components/CategoryTree/locales', 'CategoryTree');

        return (
            <LegacyContainer
                is='main'
                paddingTop={5}
                lineHeight='tight'
            >
                <Text
                    is='h1'
                    fontFamily='serif'
                    fontSize={isMobile ? 'xl' : '2xl'}
                    textAlign='center'
                    children={getText('departments')}
                />
                <Divider marginY={isMobile ? 4 : 5} />
                <Box
                    is='ul'
                    css={{
                        columns: isMobile ? 2 : 4,
                        columnGap: space[5],
                        '& > *': {
                            breakInside: 'avoid-column'
                        }
                    }}
                >
                    {this.state.categoryTreeList.map((categoryTree, i) => {
                        return (
                            <CategoryRoot
                                title={categoryTree.title}
                                path={categoryTree.path}
                                children={categoryTree.children}
                                key={'catRoot' + i}
                            />
                        );
                    })}
                </Box>
            </LegacyContainer>
        );
    }

    componentDidMount() {
        this.getTree();
    }

    getTree = () => {
        if (this.props.categoryTreeData) {
            this.setState({ categoryTreeList: this.formatRawDataToCategoryTree(this.props.categoryTreeData) });
        }
    };

    /**
     * format the received raw object to preformatted object
     * @param {*} data raw data from '/api/shop/all' service
     */
    formatRawDataToCategoryTree = data => {
        return Object.values(data)
            .filter(branch => typeof branch === 'object')
            .map(this.formatBranch);
    };

    /**
     * format branch to simplified tree view:
     * item = {
     *      title: 'titleName',
     *      path: 'relativeLink',
     *      children: [item]
     * }
     * @param {*} branch branch object
     * @param {*} prefilled values taken from branch
     */
    formatBranch = branch => {
        return Object.assign(
            {},
            branch.displayName && {
                title: branch.displayName
            },
            branch.targetUrl && {
                path: UrlUtils.getFullPathFromAbsolute(branch.targetUrl)
            },
            branch.childCategories &&
                branch.childCategories.length && {
                children: branch.childCategories.map(child => this.formatBranch(child))
            }
        );
    };
}

export default wrapComponent(CategoryTree, 'CategoryTree', true);
