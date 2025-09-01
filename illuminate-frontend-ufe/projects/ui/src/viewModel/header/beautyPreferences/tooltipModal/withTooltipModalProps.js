import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Header/BeautyPreferences/TooltipModal/locales', 'TooltipModal');

const withTooltipModalProps = wrapHOC(
    connect(
        createStructuredSelector({
            tooltipColorIQTitle: getTextFromResource(getText, 'tooltipColorIQTitle'),
            tooltipColorIQSubtitle1: getTextFromResource(getText, 'tooltipColorIQSubtitle1'),
            tooltipColorIQSubtitle2: getTextFromResource(getText, 'tooltipColorIQSubtitle2'),
            buttonGotIt: getTextFromResource(getText, 'buttonGotIt')
        })
    )
);

export { withTooltipModalProps };
