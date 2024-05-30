package vip.truffle.surrogate;


import vip.truffle.surrogate.SurrogateRegistry;
import vip.truffle.surrogate.SurrogateView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SurrogateViewManager extends ViewGroupManager<SurrogateView> {
    public static final String REACT_CLASS = "RCTSurrogateView";
    private SurrogateRegistry mRegistry;

    public SurrogateViewManager(SurrogateRegistry registry) {
        mRegistry = registry;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public SurrogateView createViewInstance(ThemedReactContext context) {
        return new SurrogateView(context, mRegistry);
    }

    @Override
    public void onDropViewInstance(SurrogateView surrogateView) {
        surrogateView.remove();
    }

    @ReactProp(name = "id")
    public void setId(SurrogateView surrogateView, String id) {
        surrogateView.setId(id);
    }
}
