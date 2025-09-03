// for proxy of files
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
//
const mimeTypes = {
    'js': 'text/javascript',
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'gif': 'image/gif',
    'jpg': 'image/jpeg'
};

function getMimeType(urlIn) {

    if (!urlIn) {
        return undefined;
    }

    const ext = urlIn.substring(urlIn.lastIndexOf('.') + 1);

    return mimeTypes[ext];
}

export default function setMimeType(request, response) {

    const mtype = getMimeType(request.path);

    if (mtype) {
        response.setHeader('Content-Type', mtype);
    }

    return mtype;
}
