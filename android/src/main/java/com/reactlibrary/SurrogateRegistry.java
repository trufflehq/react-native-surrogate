package vip.truffle.surrogate;


import vip.truffle.surrogate.SurrogateView;
import java.util.HashMap;
import java.util.Map;


public class SurrogateRegistry {
    private HashMap<String, SurrogateView> mSurrogateViews;

    public SurrogateRegistry() {
        mSurrogateViews = new HashMap<String, SurrogateView>();
    }
    
    public void put(String id, SurrogateView surrogateView) {
        mSurrogateViews.put(id, surrogateView);
    }
    
    public SurrogateView get(String id) {
        return mSurrogateViews.get(id);
    }

    public void remove(String id) {
        mSurrogateViews.remove(id);
    }
}
