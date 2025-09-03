import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EnhancedContentSelector from 'selectors/page/enhancedContent/enhancedContentSelector';

const { enhancedContentSelector } = EnhancedContentSelector;

const withEnhancedContentProps = connect(
    createStructuredSelector({
        content: enhancedContentSelector
    })
);

export { withEnhancedContentProps };
