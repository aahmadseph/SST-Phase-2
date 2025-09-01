import ApplicationEvents from 'utils/framework/ApplicationEvents';
import ComponentsCache from 'utils/framework/ComponentsCache';

class Application {
    static events = ApplicationEvents;
    static _components = ComponentsCache;

    static get components() {
        return this._components;
    }
}

export default Application;
