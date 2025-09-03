import wrapComponentRender from 'utils/framework/wrapComponentRender';

const wrapUFE = (comp, hasCtrlr) => {
    comp.prototype.hasCtrlr = hasCtrlr;
    comp.componentName = comp.displayName = comp.prototype.displayName = comp.prototype.class = comp.class || comp.name;
    comp.prototype.render = wrapComponentRender().wrapComponentRender(comp);
    comp.isComponent = true;

    return comp;
};

export default wrapUFE;
