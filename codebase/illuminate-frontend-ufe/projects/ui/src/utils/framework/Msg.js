/* eslint max-len: [2, 250] */
// This is the global object containing all Sephora's log messages
var Msg = {};

Msg.Error = {};
Msg.Warning = {};

Msg.Error.DocumentInRoot =
    'Sephora: You cannot access the document object from the Root Build. Please use "global" instead or check isNodeRender for the build cycle. If this is coming from third party code please ignore.';
Msg.Error.WindowInRoot =
    'Sephora: You cannot access the window object from the Root Build. Please use "global" instead or check isNodeRender for the build cycle. If this is coming from third party code please ignore.';

export default Msg;
