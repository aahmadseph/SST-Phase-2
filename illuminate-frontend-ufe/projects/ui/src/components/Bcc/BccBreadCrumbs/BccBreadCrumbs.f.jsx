import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { site } from 'style/config';
import { Flex, Text, Link } from 'components/ui';
import Chevron from 'components/Chevron';

const BccBreadCrumbs = ({ breadcrumbs }) => {
    const items =
        breadcrumbs &&
        breadcrumbs.map((item, index) => {
            let component, link;

            const isLastItem = index === breadcrumbs.length - 1;
            const linkColor = isLastItem || item.isSelected ? 'gray' : null;

            if (item.link && !item.isSelected) {
                link = (
                    <Link
                        href={item.link}
                        padding={2}
                        margin={-2}
                        color={linkColor}
                    >
                        {item.name}
                    </Link>
                );
            } else {
                link = item.name ? (
                    <Text
                        is='h1'
                        color={linkColor}
                    >
                        {item.name}
                    </Text>
                ) : null;
            }

            if (!isLastItem) {
                component = item.link && (
                    <Flex
                        is='li'
                        key={index.toString()}
                        alignItems='center'
                    >
                        {link}
                        <Chevron
                            direction='right'
                            size='.5em'
                            marginX={2}
                        />
                    </Flex>
                );
            } else {
                component = (
                    <li
                        key={index.toString()}
                        aria-current='page'
                    >
                        {link}
                    </li>
                );
            }

            return component;
        });

    return (
        <nav
            id='BCCBREADCRUMBS'
            aria-label='Breadcrumbs'
        >
            <Flex
                is='ol'
                height={site.BREADCRUMB_HEIGHT}
                fontSize='sm'
                alignItems='center'
            >
                {items}
            </Flex>
        </nav>
    );
};

export default wrapFunctionalComponent(BccBreadCrumbs, 'BccBreadCrumbs');
