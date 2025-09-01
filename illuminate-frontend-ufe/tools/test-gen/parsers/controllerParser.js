const quiz = require('../quiz');

const ControllerParser = {
    getMethods: parsedObj => {
        return parsedObj.filter(elem => elem.type === 'ExpressionStatement');
    },
    getDependenciesFromParsedObj: parsedObj => {
        return parsedObj.filter(
            elem =>
                elem.type === 'VariableDeclaration' &&
                elem.declarations[0] &&
                elem.declarations[0].init &&
                elem.declarations[0].init.callee &&
                elem.declarations[0].init.callee.name === 'require'
        );
    },
    getDependencyName: dep => {
        return dep.declarations[0].id.name;
    },
    getDependencyNames: (dependencies, selectedMethod) => {
        let ctrlrDepNames = dependencies.map(dep => ControllerParser.getDependencyName(dep));
        ctrlrDepNames.push('this');
        const selectedMethodBody =
            (selectedMethod &&
                selectedMethod.expression &&
                selectedMethod.expression.right &&
                selectedMethod.expression.right.body &&
                selectedMethod.expression.right.body.body) ||
            quiz.errorReport('We expect your controller method to have a format like ' + 'Comp.prototype.method = function(args) {...');

        const methodDepNames = ControllerParser.getDependenciesFromParsedObj(selectedMethodBody);

        if (methodDepNames.length) {
            ctrlrDepNames = ctrlrDepNames.concat(methodDepNames.map(dep => ControllerParser.getDependencyName(dep)));
        }

        return ctrlrDepNames;
    }
};

module.exports = ControllerParser;
