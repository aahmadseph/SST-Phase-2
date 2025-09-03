// For debugging reasons disable Jest cache in the npm command.
// Example for command in package.json:
// "test": "jest --no-cache",
const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(path.resolve('config/babel/sephora-gql-plugin-config.json'), 'utf8'));

module.exports = function sephoraJestGqlPlugin(babel) {
    const { types } = babel;

    return {
        name: 'sephora-gql-plugin',
        visitor: {
            ImportDeclaration: function (importDeclaration) {
                try {
                    const importSource = importDeclaration.node.source.value;

                    if (importSource.endsWith('.gql')) {
                        const cleanImportSource = importSource.includes('../') ? importSource.split('../').pop() : importSource;
                        const queryManifest = manifest[cleanImportSource];
                        // console.log('[sephora-gql-plugin] Query SHA256:', queryManifest.id);
                        // console.log('[sephora-gql-plugin] Query name:', queryManifest.name);
                        const leftOperand = types.identifier(queryManifest.name);
                        const rightOperand = types.stringLiteral(queryManifest.id);
                        const assignmentExpression = types.variableDeclarator(leftOperand, rightOperand);
                        const variableDeclaration = types.variableDeclaration('const', [assignmentExpression]);
                        importDeclaration.replaceWith(variableDeclaration);
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('[sephora-gql-plugin] Error:', error);

                    throw error;
                }
            }
        }
    };
};
