import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import urlUtils from 'utils/Url';

const AddPhoto = () => {
    urlUtils.redirectTo('/community/gallery?upload=true');

    return null;
};

export default wrapFunctionalComponent(AddPhoto, 'AddPhoto');
