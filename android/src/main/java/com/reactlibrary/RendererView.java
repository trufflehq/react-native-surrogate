package vip.truffle.surrogate;


import android.view.View;
import android.view.ViewGroup;
import vip.truffle.surrogate.SurrogateRegistry;
import vip.truffle.surrogate.SurrogateView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class RendererView extends ReactViewGroup {
    private SurrogateRegistry mSurrogateRegistry;
    private String mId;

    public RendererView(ThemedReactContext ctx, SurrogateRegistry surrogateRegistry) {
        super(ctx);
        mSurrogateRegistry = surrogateRegistry;
    }
    
    public void setId(String id) {
        mId = id;
    }
    
    public void render() {
        if (mId != null) {
            SurrogateView surrogateView = mSurrogateRegistry.get(mId);
            if (surrogateView != null) {
                // replace this view with the surrogate view
                this._replaceView(this, surrogateView);
            }
        }
    }

    public void remove() {
        if (mId != null) {
            SurrogateView surrogateView = mSurrogateRegistry.get(mId);
            if (surrogateView != null) {
                // restore view to original surrogate, so other views can use it
                this._replaceView(surrogateView, this);
            }
        }
    }
    
    private void _replaceView(ViewGroup toView, ViewGroup fromView) {
        View child = fromView.getChildAt(0);
        while (child != null) {
            fromView.removeView(child);
            toView.addView(child);
            child = fromView.getChildAt(0);
        }
    }
}

