let _components = {};

class ComponentsCache {
    static getByName = name => {
        return _components[name];
    };

    static setByName = (name, component) => {
        _components[name] = component;
    };

    static clear = () => {
        _components = {};
    };
}

export default ComponentsCache;
