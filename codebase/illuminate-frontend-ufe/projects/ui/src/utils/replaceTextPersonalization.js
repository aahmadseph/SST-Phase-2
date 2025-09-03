export default function (obj, oldText, newText) {
    try {
        return JSON.parse(JSON.stringify(obj).replace(oldText, newText));
    } catch {
        return obj;
    }
}
