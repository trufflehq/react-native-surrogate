"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererView = exports.SurrogateView = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const state_1 = require("@legendapp/state");
const react_2 = require("@legendapp/state/react");
const { Surrogate } = react_native_1.NativeModules;
const NativeSurrogateView = (0, react_native_1.requireNativeComponent)('RCTSurrogateView');
const NativeRendererView = (0, react_native_1.requireNativeComponent)('RCTRendererView');
const NATIVE_DELAY_MS = 1; // if surrogates aren't working properly, try increasing this a bit
const surrogates$ = (0, state_1.observable)({}); // id -> Surrogate
exports.SurrogateView = react_1.default.memo(({ id, children }) => {
    // immediately create the surrogate
    (0, react_1.useMemo)(() => {
        surrogates$[id].set({
            view: null,
            isReady: false,
            isMountLocked: false,
        });
    }, []);
    (0, react_1.useLayoutEffect)(() => {
        setTimeout(() => {
            surrogates$[id].isReady.set(true);
        }, NATIVE_DELAY_MS);
        return () => {
            surrogates$[id].delete();
        };
    }, []);
    return (<NativeSurrogateView id={id} ref={(view) => {
            surrogates$[id].view.set((0, state_1.opaqueObject)(view));
        }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }} children={children}/>);
});
exports.SurrogateView.displayName = 'SurrogateView';
exports.RendererView = (0, react_2.observer)(({ id }) => {
    const viewportLayout$ = (0, react_2.useObservable)({ x: 0, y: 0, width: 0, height: 0 });
    // wait until component with mount lock is unmounted before we mount this one
    const isMountLocked = surrogates$[id].isMountLocked.get();
    const isMountedHere$ = (0, react_2.useObservable)(false);
    (0, react_1.useLayoutEffect)(() => {
        if (!isMountLocked) {
            surrogates$[id].isMountLocked.set(true);
            isMountedHere$.set(true);
        }
    }, [isMountLocked]);
    (0, react_1.useLayoutEffect)(() => {
        return () => {
            // give time for surrogate to be restored
            setTimeout(() => {
                surrogates$[id].isMountLocked.set(false);
            }, NATIVE_DELAY_MS);
        };
    }, []);
    // we have to manually set size of the cached view, because it uses the cache setter's parent size.
    // this is because react native sets size via the uimanager
    (0, react_2.useObserveEffect)(() => {
        const view = surrogates$[id].view.get();
        if (view) {
            view.setNativeProps({
                style: {
                    width: viewportLayout$.get().width,
                    height: viewportLayout$.get().height,
                },
            });
        }
    });
    if (!surrogates$[id].view.get() || !isMountedHere$.get() || !surrogates$[id].isReady.get()) {
        return null;
    }
    return (<react_native_1.View onLayout={(e) => viewportLayout$.set(e.nativeEvent.layout)} style={{ flex: 1 }}>
      <NativeRendererView id={id} style={{ flex: 1 }}/>
    </react_native_1.View>);
});
exports.default = Surrogate;
