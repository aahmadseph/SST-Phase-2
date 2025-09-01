import BccTabsList from 'components/Bcc/BccTabsList/BccTabsList';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

const ConnectedBccTabsList = withAfterEventsRendering(BccTabsList, ['PostLoad', 'HydrationFinished']);

export default ConnectedBccTabsList;
