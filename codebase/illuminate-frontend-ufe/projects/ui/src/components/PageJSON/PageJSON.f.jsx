/* eslint max-len: [2, 200], jsx-quotes: 0 */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
// const jsesc = require("jsesc");

const PageJSON = function ({ name, data }) {
    // https://joreteg.com/blog/improving-redux-state-transfer-performance
    // const jsonString = jsesc(JSON.stringify(data), {
    //     json: true,
    //     isScriptContext: true
    // });
    // return <script id={this.props.name} type="text/javascript" dangerouslySetInnerHTML={`window.__REDUX_STATE__ = JSON.parse(${jsonString})`}></script>;

    return (
        <script
            id={name}
            type='text/json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        ></script>
    );
};

export default wrapFunctionalComponent(PageJSON, 'PageJSON');
