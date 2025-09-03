/* eslint-disable class-methods-use-this */
class ResponseMapper {
    enhanceComponent(_component, _apiResults, _sharedContext) {
        throw new Error(`enhanceComponent() function is not implemented for '${this.constructor.name}'`);
    }

    buildExtraOptions(_api, _component) {
        return ({});
    }
}

export default ResponseMapper;
