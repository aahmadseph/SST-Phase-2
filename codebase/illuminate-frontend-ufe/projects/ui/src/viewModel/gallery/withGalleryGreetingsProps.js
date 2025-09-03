import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/GalleryGreetings/locales', 'GalleryGreetings');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        link: getTextFromResource(getText, 'link'),
        boxTitle: getTextFromResource(getText, 'boxTitle'),
        boxDescription: getTextFromResource(getText, 'boxDescription'),
        boxLink: getTextFromResource(getText, 'boxLink'),
        boxCTA: getTextFromResource(getText, 'boxCTA')
    })
});

const withGalleryGreetingsProps = wrapHOC(connect(fields));

export {
    withGalleryGreetingsProps, fields
};
