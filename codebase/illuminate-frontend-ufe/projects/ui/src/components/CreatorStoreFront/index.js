import CreatorStoreFront from 'components/CreatorStoreFront/CreatorStoreFront';
import { withCreatorStoreFrontProps } from 'viewModel/creatorStoreFront/withCreatorStoreFrontProps';

const ConnectedCreatorStoreFront = withCreatorStoreFrontProps(CreatorStoreFront);

export default ConnectedCreatorStoreFront;
