"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPageInterpolator = void 0;
exports.pageInterpolatorCube = pageInterpolatorCube;
exports.pageInterpolatorSlide = pageInterpolatorSlide;
exports.pageInterpolatorStack = pageInterpolatorStack;
exports.pageInterpolatorTurnIn = pageInterpolatorTurnIn;
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
function pageInterpolatorSlide({
  focusAnim,
  pageWidth,
  pageHeight,
  vertical
}) {
  "worklet";

  const translateX = vertical ? 0 : (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], [-pageWidth.value, 0, pageWidth.value]);
  const translateY = vertical ? (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], [-pageHeight.value, 0, pageHeight.value]) : 0;
  return {
    transform: [{
      translateX
    }, {
      translateY
    }]
  };
}
function pageInterpolatorCube({
  focusAnim,
  pageWidth,
  pageHeight,
  vertical
}) {
  "worklet";

  const size = vertical ? pageHeight.value : pageWidth.value;

  // FIXME: how to calculate this programatically?
  const ratio = _reactNative.Platform.OS === "android" ? 1.23 : 2;
  const perspective = size;
  const angle = Math.atan(perspective / (size / 2));
  const inputVal = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 1], [1, -1]);
  const inputRange = [-1, 1];
  const translate = (0, _reactNativeReanimated.interpolate)(inputVal, inputRange, [size / ratio, -size / ratio], _reactNativeReanimated.Extrapolate.CLAMP);
  const rotate = (0, _reactNativeReanimated.interpolate)(inputVal, inputRange, [angle, -angle], _reactNativeReanimated.Extrapolate.CLAMP);
  const translate1 = (0, _reactNativeReanimated.interpolate)(inputVal, inputRange, [size / 2, -size / 2], _reactNativeReanimated.Extrapolate.CLAMP);
  const extra = size / ratio / Math.cos(angle / 2) - size / ratio;
  const translate2 = (0, _reactNativeReanimated.interpolate)(inputVal, inputRange, [-extra, extra], _reactNativeReanimated.Extrapolate.CLAMP);
  return {
    transform: vertical ? [{
      perspective
    }, {
      translateY: translate
    }, {
      rotateX: `${-rotate}rad`
    }, {
      translateY: translate1
    }, {
      translateY: translate2
    }] : [{
      perspective
    }, {
      translateX: translate
    }, {
      rotateY: `${rotate}rad`
    }, {
      translateX: translate1
    }, {
      translateX: translate2
    }],
    opacity: (0, _reactNativeReanimated.interpolate)(inputVal, [-2, -1, 0, 1, 2], [0, 0.9, 1, 0.9, 0])
  };
}
function pageInterpolatorStack({
  focusAnim,
  pageWidth,
  pageHeight,
  pageBuffer,
  vertical
}) {
  "worklet";

  const translateX = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], vertical ? [10, 0, -10] : [-pageWidth.value * 1.3, 0, -10]);
  const translateY = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-0.5, 0, 1], vertical ? [-pageHeight.value * 1.3, 0, -10] : [10, 0, -10]);
  const opacity = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-pageBuffer, -pageBuffer + 1, 0, pageBuffer - 1, pageBuffer], [0, 1, 1, 1, 1]);
  const scale = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-pageBuffer, -pageBuffer + 1, 0, pageBuffer - 1, pageBuffer], [0.1, 0.9, 0.9, 0.9, 0.1]);
  return {
    transform: [{
      translateX
    }, {
      translateY
    }, {
      scale
    }],
    opacity
  };
}
function pageInterpolatorTurnIn({
  focusAnim,
  pageWidth,
  pageHeight,
  vertical
}) {
  "worklet";

  const translateX = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], vertical ? [0, 0, 0] : [-pageWidth.value * 0.4, 0, pageWidth.value * 0.4]);
  const translateY = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], vertical ? [-pageHeight.value * 0.5, 0, pageHeight.value * 0.5] : [0, 0, 0]);
  const scale = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 0, 1], [0.4, 0.5, 0.4]);
  const rotateY = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 1], vertical ? [0, 0] : [75, -75], _reactNativeReanimated.Extrapolate.CLAMP);
  const rotateX = (0, _reactNativeReanimated.interpolate)(focusAnim.value, [-1, 1], vertical ? [-75, 75] : [0, 0], _reactNativeReanimated.Extrapolate.CLAMP);
  return {
    transform: [{
      perspective: 1000
    }, {
      translateX
    }, {
      translateY
    }, {
      rotateY: `${rotateY}deg`
    }, {
      rotateX: `${rotateX}deg`
    }, {
      scale
    }]
  };
}
const defaultPageInterpolator = exports.defaultPageInterpolator = pageInterpolatorSlide;
//# sourceMappingURL=pageInterpolators.js.map