const path = require('path');
const fs = require('fs');
const os = require('os');

// Regular expressions
const propTypesRegex = /\.propTypes\s*=[^;]*;/;
const contextTypesRegex = /\.prototype\.contextTypes\s*=[^;]*;/;
const childContextTypesRegex = /\.prototype\.childContextTypes\s*=[^;]*;/;

function normalizeResourcePath(resourcePath) {
    if (os.platform() === 'win32') {
        // Replace path separators to posix separator
        return resourcePath.split(path.win32.sep).join(path.posix.sep);
    }

    return resourcePath;
}

module.exports = function (content, map) {
    // Loader is cacheable by default, add this.cacheable(false) if no cache is desired

    var output = '';

    // eslint-disable-next-line no-param-reassign
    content += os.EOL;

    function addToOutput(text) {
        output += `// Added by sephora-jsx-loader.js${os.EOL}`;
        output += text;
    }

    var resourcePath = normalizeResourcePath(this.resourcePath),
        fileName = path.basename(this.resourcePath),
        componentExt = path.extname(fileName),
        componentName = fileName.match(/^([^\.]*)/)[0],
        componentDoubleExt = fileName.match(/(\..*)$/)[0],
        componentHasPropTypes = propTypesRegex.test(content) || contextTypesRegex.test(content) || childContextTypesRegex.test(content),
        componentIsPage = resourcePath.indexOf('/projects/ui/src/pages/') > -1;

    componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    addToOutput(`var React = require('react');${os.EOL}`); //Required for react
    addToOutput(`var Application = require('utils/framework/Application').default; // eslint-disable-line max-len${os.EOL}`);
    addToOutput(`var wrapComponentRenderModule = require('utils/framework/wrapComponentRender').default; // eslint-disable-line max-len${os.EOL}`);
    // We need create-react-class for React 16.
    // eslint-disable-next-line quotes
    addToOutput(`var createClass = require('create-react-class')\n\n`);

    addToOutput(`var wrapComponentRender = wrapComponentRenderModule().wrapComponentRender; // eslint-disable-line max-len${os.EOL}`);

    // console.log('componentExt: '+componentExt);
    // If module is a UFE jsx template
    if (componentExt === '.jsx') {
        if (componentHasPropTypes) {
            // We add this here to components that reference PropTypes so that we can strip out the
            // package from the production build.
            addToOutput(
                `if (process.env.NODE_ENV === 'development' && !React.PropTypes) {
    React.PropTypes = require('prop-types');
}${os.EOL}`
            );
        }

        addToOutput(`/* eslint-disable max-len */${os.EOL}`);

        addToOutput(`var ${componentName}Class;`);

        addToOutput(`/* eslint-enable max-len */${os.EOL}`);

        // Add main component content to final output
        output += content;

        if (this.query.name === 'ComponentBuild') {
            addToOutput(`Application.components.setByName('${componentName}', ${componentName}); ${os.EOL}`);
        }
        // if (componentPathJSX !== null) {
        //     // let componentPath = componentPathJSX.substr(0, componentPathJSX.lastIndexOf('/'));

        //     // Write path to components folder as component property.
        //     // This enables us to have a more flexible folder structure and still use webpacks
        //     // dynamic loading features.
        //     addToOutput(`${componentName}.prototype.path = '${componentName}'; // eslint-disable-line max-len${os.EOL}`);
        // }

        // This has to be modified in case we ever wanted a template with a controller.
        if (!componentIsPage) {
            //If module is not a page template

            // If module is a frontend component template
            // if(resourcePath.indexOf(COMPONENT_PATH) !== -1) {
            // If component has a controller and is not a root component

            var hasLegacyCtrlr = fs.existsSync(this.context + path.sep + componentName + '.c.js');

            // if (fs.existsSync(componentPath) && !/prototype\.isRootComponent\s*=\s*true/.test(content)) {
            // if (this.query.name === 'ComponentBuild' && !isAsync(content) && fs.existsSync(this.context + path.sep + componentName + '.c.js')) {
            // addToOutput(`/* eslint-disable max-len */${os.EOL}`);
            // addToOutput('hasLegacyCtrlr: ' + hasLegacyCtrlr + ' ' + this.context + path.sep + componentName + '.c.js');
            if (hasLegacyCtrlr || componentDoubleExt === '.ctrlr.jsx') {
                // TODO: If you can get both builds pointing to a single mapped file
                // remove the build specific if() and use the line below instead
                // addToOutput(`if (!Sephora.isNodeRender) {
                addToOutput(`/* eslint-disable max-len */${os.EOL}`);

                if (this.query.name === 'ComponentBuild') {
                    if (hasLegacyCtrlr) {
                        addToOutput(`Object.assign(${componentName}.prototype, require('./${componentName}.c.js'));`);
                    }

                    addToOutput(
                        `var originalDidMount = ${componentName}.prototype.componentDidMount;
${componentName}.prototype.componentDidMount = function(){
    //console.log('Non-root componentDidMount Fired: ${componentName}');
    if (originalDidMount) {
        originalDidMount.apply(this);
    }
    if (this.ctrlr) {
        this.ctrlr(this.props.ctrlrArgs);
    }
};
//console.log('Applied non-root componentDidMount: ${componentName}');
`
                    );
                }

                addToOutput(`${componentName}.prototype.hasCtrlr = 'true';${os.EOL}`);
                addToOutput(`/* eslint-enable max-len */${os.EOL}`);
            }
            // }
            //TODO: Automatically cache all backend components. This will have to be done differently now
            // else if(resourcePath.indexOf(COMPONENT_PATH) !== -1) {
            //     addToOutput(componentName+'.prototype.cache = "backend"\n');
            // }
        }

        addToOutput(`/* eslint-disable max-len */${os.EOL}`);
        // Add components class name
        addToOutput(`${componentName}.prototype.class = ${componentName}.prototype.displayName = '${componentName}';${os.EOL}`);
        addToOutput(`${componentName}.prototype.render = wrapComponentRender(${componentName});${os.EOL}`);

        // Converts module to a react component and exports it
        // addToOutput('var '+componentName+'Class = createClass('+componentName+'.prototype);\n');
        // // Add reference to react class to all component instances. This is currently used by the component render wrapper
        // addToOutput(componentName+"Class.prototype.classRef = "+componentName+"Class;\n");
        // // Add class properties to newly created react class
        // addToOutput('Object.assign('+componentName+'Class, '+componentName+');\n');
        // addToOutput('module.exports = '+componentName+'Class;');
        addToOutput('// ' + componentDoubleExt);

        if (componentDoubleExt !== '.ctrlr.jsx') {
            addToOutput(`
${componentName}.prototype.getInitialState = function() {
    ${componentName}.apply(this, this.props.constructorArgs);
    return this.state;
};
${componentName}.prototype.originClass = ${componentName};
${componentName}Class = createClass(${componentName}.prototype);
${componentName}Class.prototype.classRef = ${componentName}Class;
Object.assign(${componentName}Class, ${componentName});
${componentName}Class.isComponent = true;
module.exports = ${componentName}Class;
`);
        } else {
            addToOutput(`
module.exports = ${componentName}Class = ${componentName};
`);
        }

        addToOutput(`/* eslint-enable max-len */${os.EOL}`);
        // This code followed the if statement above
        // The purpose was to enable autobinding of the super components functions.
        // This practice was intentionally avoided by react team so we have decided not to
        // implement it for now.

        // else {
        //
        //     // `+componentName+`.prototype.super = `+componentName+`.prototype.__proto__;
        //
        //     let _super = {},
        //         SuperClass = `+componentName+`.prototype.__proto__,
        //         SuperClassProps = Object.getOwnPropertyNames(SuperClass);
        //
        //     if(!SuperClass.hasOwnProperty('isReactComponent')) {
        //         let prop;
        //         `+componentName+`.prototype.super = {};
        //         SuperClassProps.forEach(function(value) {
        //             if(typeof SuperClass[value] === 'function') {
        //                 _super[value] = function() {
        //                     return SuperClass[value].apply(this._self, arguments);
        //                 }
        //             }
        //         });
        //     }
        //     `+componentName+`.prototype.getSuper = function() {
        //         // This may not be a good idea if we can't always wrap the constructor function,
        //         // also there will probably be a best practice for this in the future, and it is
        //         // unlikely to be this.
        //         _super._self = this;
        //         this.super = _super;
        //     }
        //
        //     module.exports = `+componentName+`;
        // }

        // else if module is a UFE controller
    } else if (componentDoubleExt === '.c.js') {
        addToOutput(`var ${componentName} = Application.components.getByName('${componentName}'); ${os.EOL}`);
        addToOutput(
            `${componentName}.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate; // eslint-disable-line max-len${os.EOL}`
        );
        // Add main component content to final output
        output += content;

        addToOutput(`module.exports = ${componentName}.prototype; // eslint-disable-line max-len${os.EOL}`);
    }

    addToOutput(os.EOL);
    this.callback(null, output, map);
};
