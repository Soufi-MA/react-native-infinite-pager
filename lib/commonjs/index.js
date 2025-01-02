"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Preset = exports.DEFAULT_ANIMATION_CONFIG = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _pageInterpolators = require("./pageInterpolators");
var _useStableCallback = require("./useStableCallback");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// dummy value to translate pages offscreen before layout is known
const preInitSize = (0, _reactNativeReanimated.makeMutable)(99999);
let Preset = exports.Preset = /*#__PURE__*/function (Preset) {
  Preset["SLIDE"] = "slide";
  Preset["CUBE"] = "cube";
  Preset["STACK"] = "stack";
  Preset["TURN_IN"] = "turn-in";
  return Preset;
}({});
const PageInterpolators = {
  [Preset.SLIDE]: _pageInterpolators.pageInterpolatorSlide,
  [Preset.CUBE]: _pageInterpolators.pageInterpolatorCube,
  [Preset.STACK]: _pageInterpolators.pageInterpolatorStack,
  [Preset.TURN_IN]: _pageInterpolators.pageInterpolatorTurnIn
};
const DEFAULT_ANIMATION_CONFIG = exports.DEFAULT_ANIMATION_CONFIG = {
  damping: 20,
  mass: 0.2,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.2,
  restDisplacementThreshold: 0.2
};
const EMPTY_SIMULTANEOUS_GESTURES = [];
const EMPTY_ANIMATION_CONFIG = {};
function InfinitePager({
  vertical = false,
  PageComponent,
  pageCallbackNode,
  onPageChange,
  pageBuffer = 1,
  style,
  pageWrapperStyle,
  minIndex = -Infinity,
  maxIndex = Infinity,
  simultaneousGestures = EMPTY_SIMULTANEOUS_GESTURES,
  gesturesDisabled,
  animationConfig = EMPTY_ANIMATION_CONFIG,
  renderPage,
  flingVelocity = 500,
  preset = Preset.SLIDE,
  pageInterpolator = PageInterpolators[preset],
  bouncePct = 0.0,
  debugTag = "",
  width,
  height,
  minDistance,
  initialIndex = 0,
  syncNode
}, ref) {
  const orientation = vertical ? "vertical" : "horizontal";
  const pageWidth = (0, _reactNativeReanimated.useSharedValue)(width || 0);
  const pageHeight = (0, _reactNativeReanimated.useSharedValue)(height || 0);
  const pageSize = vertical ? pageHeight : pageWidth;
  const [{
    onLayoutPromise,
    onLayoutResolve
  }] = (0, _react.useState)(() => {
    let _r = _val => {};
    const _p = new Promise(resolve => {
      _r = resolve;
    });
    return {
      onLayoutPromise: _p,
      onLayoutResolve: _r
    };
  });
  const _translate = (0, _reactNativeReanimated.useSharedValue)(0);
  const translate = syncNode || _translate;
  const [curIndex, setCurIndex] = (0, _react.useState)(initialIndex);
  const gestureRef = (0, _react.useRef)();
  const pageAnimInternal = (0, _reactNativeReanimated.useSharedValue)(initialIndex);
  const pageAnim = pageCallbackNode || pageAnimInternal;
  const {
    activePagers,
    nestingDepth,
    pagers
  } = (0, _react.useContext)(InfinitePagerContext);
  const parentGestures = (0, _react.useContext)(SimultaneousGestureContext);
  const pagerId = (0, _react.useMemo)(() => {
    return `${orientation}:${nestingDepth}:${Math.random()}`;
  }, [orientation, nestingDepth]);
  (0, _react.useEffect)(() => {
    const updated = new Set(pagers.value);
    updated.add(pagerId);
    pagers.value = [...updated.values()];
    return () => {
      const updated = new Set(pagers.value);
      updated.delete(pagerId);
      pagers.value = [...updated.values()];
    };
  }, [pagerId, pagers]);
  const curIndexRef = (0, _react.useRef)(curIndex);
  curIndexRef.current = curIndex;
  const animCfgVal = (0, _reactNativeReanimated.useDerivedValue)(() => animationConfig, [animationConfig]);
  const gesturesDisabledAnim = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return !!gesturesDisabled;
  }, [gesturesDisabled]);
  const setPage = (0, _useStableCallback.useStableCallback)(async (index, options = {}) => {
    const layoutPageSize = await onLayoutPromise;
    const pSize = pageSize.value || layoutPageSize;
    const updatedTranslate = index * pSize * -1 + initialIndex * pSize;
    if (index < minIndex || index > maxIndex) return;
    if (options.animated) {
      const animCfg = {
        ...DEFAULT_ANIMATION_CONFIG,
        ...animCfgVal.value
      };
      translate.value = (0, _reactNativeReanimated.withSpring)(updatedTranslate, animCfg);
    } else {
      translate.value = updatedTranslate;
    }
  });
  (0, _react.useImperativeHandle)(ref, () => ({
    getPage: () => curIndexRef.current,
    setPage,
    incrementPage: options => {
      setPage(curIndexRef.current + 1, options);
    },
    decrementPage: options => {
      setPage(curIndexRef.current - 1, options);
    },
    gestureRef
  }), [setPage]);
  const pageIndices = [...Array(pageBuffer * 2 + 1)].map((_, i) => {
    const bufferIndex = i - pageBuffer;
    return curIndex - bufferIndex;
  });
  (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (pageSize.value) {
      pageAnim.value = initialIndex + translate.value / pageSize.value * -1;
    }
  }, [pageSize, pageAnim, translate, initialIndex]);
  const onPageChangeInternal = (0, _useStableCallback.useStableCallback)(pg => {
    onPageChange === null || onPageChange === void 0 || onPageChange(pg);
    setCurIndex(pg);
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    return Math.round(pageAnim.value);
  }, (cur, prev) => {
    if (cur !== prev) {
      (0, _reactNativeReanimated.runOnJS)(onPageChangeInternal)(cur);
    }
  }, []);
  const startTranslate = (0, _reactNativeReanimated.useSharedValue)(0);
  const minIndexAnim = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return minIndex;
  }, [minIndex]);
  const maxIndexAnim = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return maxIndex;
  }, [maxIndex]);
  const isMinIndex = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return curIndex <= minIndex;
  }, [curIndex, minIndex]);
  const isMaxIndex = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return curIndex >= maxIndex;
  }, [curIndex, maxIndex]);
  const isAtEdge = isMinIndex || isMaxIndex;
  const isAtEdgeAnim = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return isAtEdge;
  }, [isAtEdge]);
  const initTouchX = (0, _reactNativeReanimated.useSharedValue)(0);
  const initTouchY = (0, _reactNativeReanimated.useSharedValue)(0);
  const isGestureLocked = (0, _reactNativeReanimated.useDerivedValue)(() => {
    // Gesture goes to the most-nested active child of both orientations
    // All other pagers are locked
    const isDeepestInOrientation = activePagers.value.filter(v => {
      return v.split(":")[0] === orientation;
    }).every(v => {
      return Number(v.split(":")[1]) <= nestingDepth;
    });
    return activePagers.value.length && !isDeepestInOrientation;
  }, [activePagers, orientation]);
  const panGesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Pan().onBegin(evt => {
    "worklet";

    if (!isAtEdgeAnim.value) {
      const updated = activePagers.value.slice();
      updated.push(pagerId);
      activePagers.value = updated;
    }
    startTranslate.value = translate.value;
    initTouchX.value = evt.x;
    initTouchY.value = evt.y;
    if (debugTag) {
      console.log(`${debugTag} onBegin`, evt);
    }
  }).onTouchesMove((evt, mgr) => {
    "worklet";

    const mainTouch = evt.changedTouches[0];
    const evtVal = mainTouch[vertical ? "y" : "x"];
    const initTouch = vertical ? initTouchY.value : initTouchX.value;
    const evtTranslate = evtVal - initTouch;
    const swipingPastEnd = isMinIndex.value && evtTranslate > 0 || isMaxIndex.value && evtTranslate < 0;
    const shouldFailSelf = !bouncePct && swipingPastEnd || isGestureLocked.value || gesturesDisabledAnim.value;
    if (shouldFailSelf) {
      if (debugTag) {
        const failReason = swipingPastEnd ? "range" : "locked";
        const failDetails = swipingPastEnd ? `${isMinIndex.value ? "min" : "max"}, ${evtTranslate}` : "";
        console.log(`${debugTag}: ${failReason} fail (${failDetails})`, evt);
        const updated = activePagers.value.slice().filter(pId => pId !== pagerId);
        activePagers.value = updated;
      }
      mgr.fail();
    } else {
      if (!activePagers.value.includes(pagerId)) {
        const updated = activePagers.value.slice();
        updated.push(pagerId);
        activePagers.value = updated;
      }
    }
  }).onUpdate(evt => {
    "worklet";

    const evtTranslate = vertical ? evt.translationY : evt.translationX;
    const crossAxisTranslate = vertical ? evt.translationX : evt.translationY;
    const isSwipingCrossAxis = Math.abs(crossAxisTranslate) > 10 && Math.abs(crossAxisTranslate) > Math.abs(evtTranslate);
    if (isGestureLocked.value || isSwipingCrossAxis) return;
    if (debugTag) {
      console.log(`${debugTag} onUpdate: ${isGestureLocked.value ? "(locked)" : ""}`, evt);
    }
    const rawVal = startTranslate.value + evtTranslate;
    const page = initialIndex + -rawVal / pageSize.value;
    if (page >= minIndexAnim.value && page <= maxIndexAnim.value) {
      translate.value = rawVal;
    } else {
      const referenceVal = page < minIndexAnim.value ? minIndexAnim.value : maxIndexAnim.value;
      const pageOverflowPct = referenceVal - page;
      const overflowTrans = pageOverflowPct * pageSize.value;
      const maxBounceTrans = bouncePct * pageSize.value;
      const bounceTrans = pageOverflowPct * maxBounceTrans;
      const clampedVal = rawVal - overflowTrans;
      translate.value = clampedVal + bounceTrans;
    }
  }).onEnd(evt => {
    "worklet";

    const evtVelocity = vertical ? evt.velocityY : evt.velocityX;
    const evtTranslate = vertical ? evt.translationY : evt.translationX;
    const crossAxisTranslate = vertical ? evt.translationX : evt.translationY;
    const isSwipingCrossAxis = Math.abs(crossAxisTranslate) > Math.abs(evtTranslate);
    const isFling = isGestureLocked.value || isSwipingCrossAxis ? false : Math.abs(evtVelocity) > flingVelocity;
    let velocityModifier = isFling ? pageSize.value / 2 : 0;
    if (evtVelocity < 0) velocityModifier *= -1;
    let page = initialIndex + -1 * Math.round((translate.value + velocityModifier) / pageSize.value);
    if (page < minIndexAnim.value) page = minIndexAnim.value;
    if (page > maxIndexAnim.value) page = maxIndexAnim.value;
    const animCfg = Object.assign({}, DEFAULT_ANIMATION_CONFIG, animCfgVal.value);
    translate.value = (0, _reactNativeReanimated.withSpring)(-(page - initialIndex) * pageSize.value, animCfg);
    if (debugTag) {
      console.log(`${debugTag}: onEnd (${isGestureLocked.value ? "locked" : "unlocked"})`, evt);
    }
  }).onFinalize(evt => {
    "worklet";

    const updatedPagerIds = activePagers.value.slice().filter(id => id !== pagerId);
    activePagers.value = updatedPagerIds;
    if (debugTag) {
      console.log(`${debugTag}: onFinalize (${isGestureLocked.value ? "locked" : "unlocked"})`, evt);
    }
  }), [activePagers, animCfgVal, bouncePct, debugTag, flingVelocity, gesturesDisabledAnim, initTouchX, initTouchY, initialIndex, isAtEdgeAnim, isGestureLocked, isMaxIndex, isMinIndex, maxIndexAnim, minIndexAnim, pageSize, pagerId, startTranslate, translate, vertical]);
  panGesture.enabled(!gesturesDisabled).withRef(gestureRef);
  if (typeof minDistance === "number") {
    panGesture.minDistance(minDistance);
  }
  const externalGestures = (0, _react.useMemo)(() => {
    const all = [...parentGestures, ...simultaneousGestures];
    const toGestureType = all.reduce((acc, cur) => {
      acc.push(...cur.toGestureArray());
      return acc;
    }, []);
    return toGestureType;
  }, [parentGestures, simultaneousGestures]);
  panGesture.simultaneousWithExternalGesture(...externalGestures);
  const allGestures = (0, _react.useMemo)(() => {
    return [panGesture, ...externalGestures];
  }, [panGesture, externalGestures]);
  const wrapperStyle = (0, _react.useMemo)(() => {
    const s = {};
    if (width) s.width = width;
    if (height) s.height = height;
    return s;
  }, [width, height]);
  return /*#__PURE__*/_react.default.createElement(SimultaneousGestureProvider, {
    simultaneousGestures: allGestures
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: panGesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [wrapperStyle, style],
    onLayout: ({
      nativeEvent: {
        layout
      }
    }) => {
      pageWidth.value = layout.width;
      pageHeight.value = layout.height;
      onLayoutResolve(vertical ? layout.height : layout.width);
    }
  }, pageIndices.map(pageIndex => {
    return /*#__PURE__*/_react.default.createElement(PageWrapper, {
      key: `page-provider-wrapper-${pageIndex}`,
      vertical: vertical,
      pageAnim: pageAnim,
      index: pageIndex,
      pageWidth: pageWidth,
      pageHeight: pageHeight,
      isActive: pageIndex === curIndex,
      PageComponent: PageComponent,
      renderPage: renderPage,
      style: pageWrapperStyle,
      pageInterpolator: pageInterpolator,
      pageBuffer: pageBuffer,
      debugTag: debugTag,
      initialIndex: initialIndex
    });
  }))));
}
const PageWrapper = /*#__PURE__*/_react.default.memo(({
  index,
  pageAnim,
  pageWidth,
  pageHeight,
  vertical,
  PageComponent,
  renderPage,
  isActive,
  style,
  pageInterpolator,
  pageBuffer,
  initialIndex
}) => {
  const pageSize = vertical ? pageHeight : pageWidth;
  const translation = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const translate = (index - pageAnim.value) * pageSize.value;
    return translate;
  }, []);
  const focusAnim = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (!pageSize.value) {
      return index - initialIndex;
    }
    return translation.value / pageSize.value;
  }, [initialIndex]);
  const animStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    // Short circuit page interpolation to prevent buggy initial values due to possible race condition:
    // https://github.com/software-mansion/react-native-reanimated/issues/2571
    const isInitialPage = index === initialIndex;
    const hasInitialized = !!pageSize.value;
    const isInactivePageBeforeInit = !isInitialPage && !hasInitialized;
    const _pageWidth = isInactivePageBeforeInit ? preInitSize : pageWidth;
    const _pageHeight = isInactivePageBeforeInit ? preInitSize : pageHeight;
    return pageInterpolator({
      focusAnim,
      pageAnim,
      pageWidth: _pageWidth,
      pageHeight: _pageHeight,
      index,
      vertical,
      pageBuffer
    });
  }, [pageWidth, pageHeight, pageAnim, index, initialIndex, translation, vertical, pageBuffer]);
  if (PageComponent && renderPage) {
    console.warn("PageComponent and renderPage both defined, defaulting to PageComponent");
  }
  if (!PageComponent && !renderPage) {
    throw new Error("Either PageComponent or renderPage must be defined.");
  }
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: isActive ? "auto" : "none",
    style: [style, styles.pageWrapper, animStyle, isActive && styles.activePage]
  }, PageComponent ? /*#__PURE__*/_react.default.createElement(PageComponent, {
    index: index,
    isActive: isActive,
    focusAnim: focusAnim,
    pageWidthAnim: pageWidth,
    pageHeightAnim: pageHeight,
    pageAnim: pageAnim
  }) : renderPage === null || renderPage === void 0 ? void 0 : renderPage({
    index,
    isActive,
    focusAnim,
    pageWidthAnim: pageWidth,
    pageHeightAnim: pageHeight,
    pageAnim
  }));
});
var _default = exports.default = /*#__PURE__*/_react.default.memo(withWrappedProvider(/*#__PURE__*/_react.default.forwardRef(InfinitePager)));
function withWrappedProvider(Inner) {
  return /*#__PURE__*/_react.default.forwardRef((props, ref) => {
    return /*#__PURE__*/_react.default.createElement(InfinitePagerProvider, null, /*#__PURE__*/_react.default.createElement(Inner, _extends({}, props, {
      ref: ref
    })));
  });
}
const styles = _reactNative.StyleSheet.create({
  pageWrapper: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute"
  },
  activePage: {
    position: "relative"
  }
});
const InfinitePagerContext = /*#__PURE__*/_react.default.createContext({
  activePagers: (0, _reactNativeReanimated.makeMutable)([]),
  pagers: (0, _reactNativeReanimated.makeMutable)([]),
  nestingDepth: -1
});
const SimultaneousGestureContext = /*#__PURE__*/_react.default.createContext([]);
function SimultaneousGestureProvider({
  simultaneousGestures = EMPTY_SIMULTANEOUS_GESTURES,
  children
}) {
  return /*#__PURE__*/_react.default.createElement(SimultaneousGestureContext.Provider, {
    value: simultaneousGestures
  }, children);
}
function InfinitePagerProvider({
  children
}) {
  const {
    nestingDepth,
    activePagers,
    pagers
  } = (0, _react.useContext)(InfinitePagerContext);
  const rootPagers = (0, _reactNativeReanimated.useSharedValue)([]);
  const rootActivePagers = (0, _reactNativeReanimated.useSharedValue)([]);
  const value = (0, _react.useMemo)(() => {
    const isRoot = nestingDepth === -1;
    return {
      nestingDepth: nestingDepth + 1,
      activePagers: isRoot ? rootActivePagers : activePagers,
      pagers: isRoot ? rootPagers : pagers
    };
  }, [nestingDepth, activePagers, pagers, rootPagers, rootActivePagers]);
  return /*#__PURE__*/_react.default.createElement(InfinitePagerContext.Provider, {
    value: value
  }, children);
}
//# sourceMappingURL=index.js.map