import Empty from 'constants/empty';

const EventType = {
    Applied: 'Applied',
    Default: '',
    Failed: 'Failed',
    Loaded: 'Loaded',
    Ready: 'Ready',
    ServiceCtrlrsApplied: 'Service Ctrlrs Applied'
};

const ServiceCtrlrsApplied = EventType.ServiceCtrlrsApplied.replace(/ /g, Empty.String);

const CatalogEngineReady = 'CatalogEngineReady';
const CategoriesFetched = 'CategoriesFetched';
const ConstructorBeaconDisabled = 'ConstructorBeaconDisabled';
const ConstructorBeaconInitialized = 'ConstructorBeaconInitialized';
const DebouncedResize = 'DebouncedResize';
const DebouncedScroll = 'DebouncedScroll';
const DOMContentLoaded = 'DOMContentLoaded';
const HeadscriptRuntime = 'HeadscriptRuntime';
const HeadscriptRuntimeApplied = `${HeadscriptRuntime}${EventType.Applied}`;
const HeadscriptRuntimeLoaded = `${HeadscriptRuntime}${EventType.Loaded}`;
const HydrationFinished = 'HydrationFinished';
const Immediate = 'Immediate';
const ImmediateReady = `${Immediate}${EventType.Ready}`;
const ImmediateServiceCtrlrsApplied = `${Immediate}${ServiceCtrlrsApplied}`;
const InPageComps = 'InPageComps';
const InPageCompsLoaded = `${InPageComps}${EventType.Loaded}`;
const InPageCompsReady = `${InPageComps}${EventType.Ready}`;
const InPageCompsServiceCtrlrsApplied = `${InPageComps}${ServiceCtrlrsApplied}`;
const LazyLoadComplete = 'LazyLoadComplete';
const load = 'load';
const nebOnsiteLoaded = 'neb_OnsiteLoaded';
const OrderInfo = 'OrderInfo';
const MasterList = 'MasterList';
const OrderInfoCtrlrsApplied = `${OrderInfo}${ServiceCtrlrsApplied}`;
const OrderInfoLoaded = `${OrderInfo}${EventType.Loaded}`;
const OrderInfoReady = `${OrderInfo}${EventType.Ready}`;
const PostLoad = 'PostLoad';
const PostLoadCtrlrsApplied = 'PostLoadCtrlrsApplied';
const ProductInfo = 'ProductInfo';
const ProductInfoCtrlrsApplied = `${ProductInfo}${ServiceCtrlrsApplied}`;
const ProductInfoLoaded = `${ProductInfo}${EventType.Loaded}`;
const ProductInfoReady = `${ProductInfo}${EventType.Ready}`;
const ProfileUpdated = 'ProfileUpdated';
const SearchInfoLoaded = 'SearchInfoLoaded';
const SearchInfoReady = 'SearchInfoReady';
const ShowQuickLookModal = 'ShowQuickLookModal';
const TestTarget = 'TestTarget';
const TestTargetCtrlrsApplied = `${TestTarget}${ServiceCtrlrsApplied}`;
const TestTargetLoaded = `${TestTarget}${EventType.Loaded}`;
const TestTargetReady = `${TestTarget}${EventType.Ready}`;
const TestTargetResult = 'TestTargetResult';
const TestTargetServiceReady = 'TestTargetServiceReady';
const UserInfo = 'UserInfo';
const UserInfoCtrlrsApplied = `${UserInfo}${ServiceCtrlrsApplied}`;
const UserInfoLoaded = `${UserInfo}${EventType.Loaded}`;
const UserInfoReady = `${UserInfo}${EventType.Ready}`;
const VisitorAPILoaded = 'VisitorAPILoaded';
const P13NData = 'P13NData';
const P13NDataReady = `${P13NData}${EventType.Ready}`;
const P13NDataLoaded = `${P13NData}${EventType.Loaded}`;
const BasketInfoLoaded = 'BasketInfoLoaded';
const AuthTokenReceived = 'AuthTokenReceived';
const AuthTokenFailed = 'AuthTokenFailed';
const MasterListLoaded = `${MasterList}${EventType.Loaded}`;

export {
    CatalogEngineReady,
    CategoriesFetched,
    ConstructorBeaconDisabled,
    ConstructorBeaconInitialized,
    DebouncedResize,
    DebouncedScroll,
    DOMContentLoaded,
    EventType,
    HeadscriptRuntime,
    HeadscriptRuntimeApplied,
    HeadscriptRuntimeLoaded,
    HydrationFinished,
    Immediate,
    ImmediateReady,
    ImmediateServiceCtrlrsApplied,
    InPageComps,
    InPageCompsLoaded,
    InPageCompsReady,
    InPageCompsServiceCtrlrsApplied,
    LazyLoadComplete,
    load,
    nebOnsiteLoaded,
    OrderInfo,
    OrderInfoCtrlrsApplied,
    OrderInfoLoaded,
    OrderInfoReady,
    PostLoad,
    PostLoadCtrlrsApplied,
    ProductInfo,
    ProductInfoCtrlrsApplied,
    ProductInfoLoaded,
    ProductInfoReady,
    ProfileUpdated,
    SearchInfoLoaded,
    SearchInfoReady,
    ShowQuickLookModal,
    TestTarget,
    TestTargetCtrlrsApplied,
    TestTargetLoaded,
    TestTargetReady,
    TestTargetResult,
    TestTargetServiceReady,
    UserInfo,
    UserInfoCtrlrsApplied,
    UserInfoLoaded,
    UserInfoReady,
    VisitorAPILoaded,
    P13NData,
    P13NDataReady,
    P13NDataLoaded,
    BasketInfoLoaded,
    AuthTokenReceived,
    AuthTokenFailed,
    MasterListLoaded
};
