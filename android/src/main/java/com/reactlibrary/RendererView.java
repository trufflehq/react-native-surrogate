package vip.truffle.surrogate;


import android.view.View;
import android.view.ViewGroup;
import vip.truffle.surrogate.SurrogateRegistry;
import vip.truffle.surrogate.SurrogateView;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import android.util.Log;

public class RendererView extends ReactViewGroup {
    private SurrogateRegistry mSurrogateRegistry;
    private String mId;

    public RendererView(ThemedReactContext ctx, SurrogateRegistry surrogateRegistry) {
        super(ctx);
        mSurrogateRegistry = surrogateRegistry;
    }
    
    public void setId(String id) {
        mId = id;
        SurrogateView surrogateView = mSurrogateRegistry.get(id);
        if (surrogateView != null) {
            // replace this view with the surrogate view
            this._replaceView(this, surrogateView);
        }
    }

    public void remove() {
        if (mId != null) {
            // restore view to original surrogate, so other views can use it
            SurrogateView surrogateView = mSurrogateRegistry.get(mId);
            if (surrogateView != null) {
                this._replaceView(surrogateView, this);
            }
        }
    }
    
    private void _replaceView(ViewGroup fromView, ViewGroup toView) {
        fromView.removeAllViews();
        View child = toView.getChildAt(0);
        while (child != null) {
            toView.removeView(child);
            fromView.addView(child);
            child = toView.getChildAt(0);
        }
    }
}

