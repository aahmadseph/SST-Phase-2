import { withPostloadedGAdTagListProps } from 'viewModel/gAdTag/withPostloadedGAdTagListProps';
import GAdTag from 'components/GAdTag/GAdTag';
import GAdTagList from 'components/GAdTag/GAdTagList';
import PostloadedGAdTagList from 'components/GAdTag/PostloadedGAdTagList';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

export default {
    GAdTag,
    GAdTagList,
    PostloadedGAdTagList: withAfterEventsRendering(withPostloadedGAdTagListProps(PostloadedGAdTagList), ['PostLoad', 'HydrationFinished'])
};
