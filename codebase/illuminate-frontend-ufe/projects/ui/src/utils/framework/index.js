import wrapHOC from 'utils/framework/wrapHOC';
import wrapHOCComponent from 'utils/framework/wrapHOCComponent';
import Application from 'utils/framework/Application';
import wrapUFE from 'utils/framework/wrapUFE';
import wrapUFEFunctional from 'utils/framework/wrapUFEFunctional';

export const wrapComponent = (component, name, hasCtrlr) => {
    component.class = name;
    const modifiedComponent = wrapUFE(component, hasCtrlr);

    return modifiedComponent;
};

export const wrapFunctionalComponent = wrapUFEFunctional;

export default {
    Application,
    wrapComponent,
    wrapFunctionalComponent,
    wrapHOC,
    wrapHOCComponent
};
