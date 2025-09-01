import { wrapFunctionalComponent } from 'utils/framework';
import styled from '@emotion/styled';
import shouldForwardProp from 'style/shouldForwardProp';

function getStyledComponent({ InnerComp, styledProps }) {
    let StyledComponent = styled(InnerComp, { shouldForwardProp })(...styledProps);
    StyledComponent = wrapFunctionalComponent(StyledComponent, 'StyledComponent');

    return StyledComponent;
}

export default getStyledComponent;
