import React, { Component, useLayoutEffect, useMemo } from 'react';
import { NativeModules, requireNativeComponent, View } from 'react-native';
import type { LayoutRectangle, NativeMethods } from 'react-native';
import { observable, opaqueObject } from '@legendapp/state';
import { observer, useObservable, useObserveEffect } from '@legendapp/state/react';

// we have to do some extra stuff in js to ensure only one renderer is pulling from a surrogate at a time.
// also some code to style the surrogate view to the same size as the renderer view

const { Surrogate } = NativeModules;

type NativeSurrogateViewProps = {
  id: string;
} & React.ComponentProps<typeof View>;

const NativeSurrogateView = requireNativeComponent<NativeSurrogateViewProps>('RCTSurrogateView');

type NativeRendererViewProps = {
  id: string;
} & React.ComponentProps<typeof View>;

const NativeRendererView = requireNativeComponent<NativeRendererViewProps>('RCTRendererView');

const NATIVE_DELAY_MS = 1; // if surrogates aren't working properly, try increasing this a bit

type Surrogate = {
  view: View | null;
  isReady: boolean;
  isMountLocked: boolean;
};

const surrogates$ = observable<Record<string, Surrogate>>({}); // id -> Surrogate

export const SurrogateView = React.memo(({ id, children }: { id: string; children: React.ReactNode }) => {
  // immediately create the surrogate
  useMemo(() => {
    surrogates$[id].set({
      view: null,
      isReady: false,
      isMountLocked: false,
    });
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      surrogates$[id].isReady.set(true);
    }, NATIVE_DELAY_MS);
    return () => {
      surrogates$[id].delete();
    };
  }, []);

  return (
    <NativeSurrogateView
      id={id}
      ref={(view: Component<NativeSurrogateViewProps, {}, any> & Readonly<NativeMethods>) => {
        surrogates$[id].view.set(opaqueObject(view));
      }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
      children={children}
    />
  );
});
SurrogateView.displayName = 'SurrogateView';


export const RendererView = observer(({ id }: { id: string }) => {
  const viewportLayout$ = useObservable<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

  // wait until component with mount lock is unmounted before we mount this one
  const isMountLocked = surrogates$[id].isMountLocked.get();
  const isMountedHere$ = useObservable<boolean>(false);

  useLayoutEffect(() => {
    if (!isMountLocked) {
      surrogates$[id].isMountLocked.set(true);
      isMountedHere$.set(true);
    }
  }, [isMountLocked]);

  useLayoutEffect(() => {
    return () => {
      // give time for surrogate to be restored
      setTimeout(() => {
        surrogates$[id].isMountLocked.set(false);
      }, NATIVE_DELAY_MS);
    };
  }, []);

  // we have to manually set size of the cached view, because it uses the cache setter's parent size.
  // this is because react native sets size via the uimanager
  useObserveEffect(() => {
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

  return (
    <View onLayout={(e) => viewportLayout$.set(e.nativeEvent.layout)} style={{ flex: 1 }}>
      <NativeRendererView id={id} style={{ flex: 1 }} />
    </View>
  );
});

export default Surrogate;
