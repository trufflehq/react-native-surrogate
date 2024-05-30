package vip.truffle.surrogate;


import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import vip.truffle.surrogate.SurrogateRegistry;
import vip.truffle.surrogate.SurrogateViewManager;
import vip.truffle.surrogate.RendererViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

public class SurrogatePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        SurrogateRegistry registry = new SurrogateRegistry();
        return Arrays.<ViewManager>asList(
            new SurrogateViewManager(registry),
            new RendererViewManager(registry)
        );
    }
}
