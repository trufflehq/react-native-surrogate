package vip.truffle.surrogate;


import vip.truffle.surrogate.SurrogateRegistry;
import vip.truffle.surrogate.RendererView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RendererViewManager extends ViewGroupManager<RendererView> {
    public static final String REACT_CLASS = "RCTRendererView";
    private SurrogateRegistry mRegistry;

    public RendererViewManager(SurrogateRegistry registry) {
        mRegistry = registry;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RendererView createViewInstance(ThemedReactContext context) {
        return new RendererView(context, mRegistry);
    }

    @Override
    public void onDropViewInstance(RendererView rendererView) {
        rendererView.remove();
    }

    @ReactProp(name = "id")
    public void setId(RendererView rendererView, String id) {
        rendererView.setId(id);
    }
}
