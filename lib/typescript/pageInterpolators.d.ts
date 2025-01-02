import { useAnimatedStyle } from "react-native-reanimated";
import { PageInterpolatorParams } from ".";
export declare function pageInterpolatorSlide({ focusAnim, pageWidth, pageHeight, vertical, }: PageInterpolatorParams): ReturnType<typeof useAnimatedStyle>;
export declare function pageInterpolatorCube({ focusAnim, pageWidth, pageHeight, vertical, }: PageInterpolatorParams): {
    transform: ({
        perspective: number;
        translateY?: undefined;
        rotateX?: undefined;
    } | {
        translateY: number;
        perspective?: undefined;
        rotateX?: undefined;
    } | {
        rotateX: string;
        perspective?: undefined;
        translateY?: undefined;
    })[] | ({
        perspective: number;
        translateX?: undefined;
        rotateY?: undefined;
    } | {
        translateX: number;
        perspective?: undefined;
        rotateY?: undefined;
    } | {
        rotateY: string;
        perspective?: undefined;
        translateX?: undefined;
    })[];
    opacity: number;
};
export declare function pageInterpolatorStack({ focusAnim, pageWidth, pageHeight, pageBuffer, vertical, }: PageInterpolatorParams): {
    transform: ({
        translateX: number;
        translateY?: undefined;
        scale?: undefined;
    } | {
        translateY: number;
        translateX?: undefined;
        scale?: undefined;
    } | {
        scale: number;
        translateX?: undefined;
        translateY?: undefined;
    })[];
    opacity: number;
};
export declare function pageInterpolatorTurnIn({ focusAnim, pageWidth, pageHeight, vertical, }: PageInterpolatorParams): {
    transform: ({
        perspective: number;
        translateX?: undefined;
        translateY?: undefined;
        rotateY?: undefined;
        rotateX?: undefined;
        scale?: undefined;
    } | {
        translateX: number;
        perspective?: undefined;
        translateY?: undefined;
        rotateY?: undefined;
        rotateX?: undefined;
        scale?: undefined;
    } | {
        translateY: number;
        perspective?: undefined;
        translateX?: undefined;
        rotateY?: undefined;
        rotateX?: undefined;
        scale?: undefined;
    } | {
        rotateY: string;
        perspective?: undefined;
        translateX?: undefined;
        translateY?: undefined;
        rotateX?: undefined;
        scale?: undefined;
    } | {
        rotateX: string;
        perspective?: undefined;
        translateX?: undefined;
        translateY?: undefined;
        rotateY?: undefined;
        scale?: undefined;
    } | {
        scale: number;
        perspective?: undefined;
        translateX?: undefined;
        translateY?: undefined;
        rotateY?: undefined;
        rotateX?: undefined;
    })[];
};
export declare const defaultPageInterpolator: typeof pageInterpolatorSlide;
