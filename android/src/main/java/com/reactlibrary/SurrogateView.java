package vip.truffle.surrogate;


import vip.truffle.surrogate.SurrogateRegistry;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import android.util.Log;

public class SurrogateView extends ReactViewGroup {
    private SurrogateRegistry mSurrogateRegistry;
    String mId = null;

    public SurrogateView(ThemedReactContext ctx, SurrogateRegistry surrogateRegistry) {
        super(ctx);
        mSurrogateRegistry = surrogateRegistry;
    }
    
    public void setId(String id) {
        mSurrogateRegistry.remove(mId);
        mId = id;
        mSurrogateRegistry.put(id, this);
    }

    public void remove() {
        if (mId != null) {
            mSurrogateRegistry.remove(mId);
        }
    }
}
