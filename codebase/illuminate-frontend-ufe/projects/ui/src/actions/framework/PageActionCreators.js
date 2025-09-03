/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { NotImplementedException } from 'exceptions';

// interface ILocation {
//     path: string;
//     queryParams: {
//         [key: string]: Array
//     };
//     anchor: string;
// }

// interface IPageNavigationContext {
//     events: {
//         onDataLoaded: (newData: any, imagesToPreload: []) => void,
//         onError: (error: Error) => void,
//         onPageUpdated: (data: any, callback: () => void) => void
//     };
//     newLocation: ILocation;
//     previousLocation: ILocation;
//     requestConfig: { abortable: boolean };
//     newPageTemplate: PageTemplateType; // constants/PageTemplateType.js
// }

// export interface IPageActionCreators {
//     isNewPage: (pageContext: IPageNavigationContext) => boolean;
//     openPage?: (pageContext: IPageNavigationContext) => void;
//     updatePage?: (pageContext: IPageNavigationContext) => void;
// }

class PageActionCreators /* implements IPageActionCreators*/ {
    isNewPage(pageContext /*: IPageNavigationContext*/) {
        throw new NotImplementedException();
    }

    openPage(pageContext /*: IPageNavigationContext*/) {
        throw new NotImplementedException();
    }

    updatePage(pageContext /*: IPageNavigationContext*/) {
        throw new NotImplementedException();
    }
}

export default PageActionCreators;
