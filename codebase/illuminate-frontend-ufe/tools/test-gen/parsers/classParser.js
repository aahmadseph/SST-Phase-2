const quiz = require('../quiz');

const ClassParser = {
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
        let classDepNames = dependencies.map(dep => ClassParser.getDependencyName(dep));
        classDepNames.push('this');
        const selectedMethodBody =
            (selectedMethod &&
                selectedMethod.expression &&
                selectedMethod.expression.right &&
                selectedMethod.expression.right.body &&
                selectedMethod.expression.right.body.body) ||
            quiz.errorReport('We expect your class method to have a format like ' + 'method = (args) => {...');

        const methodDepNames = ClassParser.getDependenciesFromParsedObj(selectedMethodBody);

        if (methodDepNames.length) {
            classDepNames = classDepNames.concat(methodDepNames.map(dep => ClassParser.getDependencyName(dep)));
        }

        return classDepNames;
    }
};

module.exports = ClassParser;
