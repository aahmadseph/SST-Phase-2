import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

function iSplitEDDExperienceDisplayed() {
    const splitEDDExperience = Storage.local.getItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE) || false;

    return splitEDDExperience;
}

export default { iSplitEDDExperienceDisplayed };
