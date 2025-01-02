import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useAnimatedStyle, WithSpringConfig, SharedValue, DerivedValue } from "react-native-reanimated";
import { ComposedGesture, GestureType } from "react-native-gesture-handler";
import { defaultPageInterpolator } from "./pageInterpolators";
export declare enum Preset {
    SLIDE = "slide",
    CUBE = "cube",
    STACK = "stack",
    TURN_IN = "turn-in"
}
export declare const DEFAULT_ANIMATION_CONFIG: WithSpringConfig;
export type InfinitePagerPageProps = {
    index: number;
    focusAnim: DerivedValue<number>;
    isActive: boolean;
    pageWidthAnim: SharedValue<number>;
    pageHeightAnim: SharedValue<number>;
    pageAnim: SharedValue<number>;
};
type SimultaneousGesture = ComposedGesture | GestureType;
export type InfinitePagerPageComponent = (props: InfinitePagerPageProps) => JSX.Element | null;
type AnyStyle = StyleProp<ViewStyle> | ReturnType<typeof useAnimatedStyle>;
export type InfinitePagerProps = {
    vertical?: boolean;
    PageComponent?: InfinitePagerPageComponent | React.MemoExoticComponent<InfinitePagerPageComponent>;
    renderPage?: InfinitePagerPageComponent;
    pageCallbackNode?: SharedValue<number>;
    syncNode?: SharedValue<number>;
    onPageChange?: (page: number) => void;
    pageBuffer?: number;
    style?: AnyStyle;
    pageWrapperStyle?: AnyStyle;
    pageInterpolator?: typeof defaultPageInterpolator;
    minIndex?: number;
    maxIndex?: number;
    simultaneousGestures?: SimultaneousGesture[];
    gesturesDisabled?: boolean;
    animationConfig?: Partial<WithSpringConfig>;
    flingVelocity?: number;
    preset?: Preset;
    bouncePct?: number;
    debugTag?: string;
    width?: number;
    height?: number;
    minDistance?: number;
    initialIndex?: number;
};
type ImperativeApiOptions = {
    animated?: boolean;
};
export type InfinitePagerImperativeApi = {
    getPage: () => number;
    setPage: (index: number, options: ImperativeApiOptions) => void;
    incrementPage: (options: ImperativeApiOptions) => void;
    decrementPage: (options: ImperativeApiOptions) => void;
    gestureRef: React.MutableRefObject<GestureType | undefined>;
};
export type PageInterpolatorParams = {
    index: number;
    vertical: boolean;
    focusAnim: DerivedValue<number>;
    pageAnim: DerivedValue<number>;
    pageWidth: SharedValue<number>;
    pageHeight: SharedValue<number>;
    pageBuffer: number;
};
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<InfinitePagerProps & React.RefAttributes<InfinitePagerImperativeApi>, "ref"> & React.RefAttributes<object>>>;
export default _default;
