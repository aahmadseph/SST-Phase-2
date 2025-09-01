import React from 'react';
import Root from './Root';
import withPageTemplate from './hocs/page/withPageTemplate';
import wrapFunctionalComponent from './utils/framework/wrapUFEFunctional';

const ConnectedRoot = withPageTemplate(Root);

const SpaApplication = () => <ConnectedRoot />;

export default wrapFunctionalComponent(SpaApplication, 'SpaApplication');
