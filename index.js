// main index.js

import { NativeModules } from 'react-native';
import { requireNativeComponent } from "react-native";

const { Surrogate } = NativeModules;

export const SurrogateView = requireNativeComponent('RCTSurrogateView');
export const RendererView = requireNativeComponent('RCTRendererView');

export default Surrogate;
