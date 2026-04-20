import { i as interpolate, f as frame, a as isMotionValue, J as JSAnimation, u as useConstant, m as motionValue, r as reactExports, M as MotionConfigContext, b as useIsomorphicLayoutEffect, c as cancelFrame, d as collectMotionValues, e as createLucideIcon, R as React2, g as clsx, h as useStudyStore, j as useNavigate, k as jsxRuntimeExports, l as motion, B as Button, Z as Zap, C as Clock, n as BookOpen, o as ue } from "./index-CviB1n4S.js";
import { A as AnimatePresence, P as Plus, B as Badge } from "./badge-D8m6OhXH.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BbdGlSpY.js";
import { C as CircleCheck, Q as QuizModal } from "./QuizModal-PrBxIFE0.js";
import { S as Sparkles } from "./sparkles-DyJQeLW4.js";
import { i as isFunction, C as Curve, T as Text, f as filterProps, p as polarToCartesian, a as isNil, L as Layer, g as getValueByDataKey, b as adaptEventsOfChild, S as Shape, A as Animate, c as get, d as interpolateNumber, e as isEqual, h as isNumber, j as Label, k as LabelList, u as uniqueId, G as Global, m as mathSign, l as findAllByType, n as Cell, o as getMaxRadius, q as getPercentValue, w as warn, r as generateCategoricalChart, P as PolarAngleAxis, s as PolarRadiusAxis, t as formatAxisMap, F as Flame, v as TrendingUp, R as ResponsiveContainer, B as BarChart, x as CartesianGrid, X as XAxis, Y as YAxis, y as Tooltip, z as Bar, D as Sector } from "./BarChart-vK651tQv.js";
import { B as Brain } from "./brain-X8ClrNe6.js";
import "./dialog-BlnJS6wj.js";
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function attachFollow(value, source, options = {}) {
  const initialValue = value.get();
  let activeAnimation = null;
  let latestValue = initialValue;
  let latestSetter;
  const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
  const stopAnimation = () => {
    if (activeAnimation) {
      activeAnimation.stop();
      activeAnimation = null;
    }
    value.animation = void 0;
  };
  const startAnimation = () => {
    const currentValue = asNumber(value.get());
    const targetValue = asNumber(latestValue);
    if (currentValue === targetValue) {
      stopAnimation();
      return;
    }
    const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
    stopAnimation();
    activeAnimation = new JSAnimation({
      keyframes: [currentValue, targetValue],
      velocity,
      // Default to spring if no type specified (matches useSpring behavior)
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...options,
      onUpdate: latestSetter
    });
  };
  const scheduleAnimation = () => {
    var _a;
    startAnimation();
    value.animation = activeAnimation ?? void 0;
    (_a = value["events"].animationStart) == null ? void 0 : _a.notify();
    activeAnimation == null ? void 0 : activeAnimation.then(() => {
      var _a2;
      value.animation = void 0;
      (_a2 = value["events"].animationComplete) == null ? void 0 : _a2.notify();
    });
  };
  value.attach((v, set) => {
    latestValue = v;
    latestSetter = (latest) => set(parseValue(latest, unit));
    frame.postRender(scheduleAnimation);
  }, stopAnimation);
  if (isMotionValue(source)) {
    let skipNextAnimation = options.skipInitialAnimation === true;
    const removeSourceOnChange = source.on("change", (v) => {
      if (skipNextAnimation) {
        skipNextAnimation = false;
        value.jump(parseValue(v, unit), false);
      } else {
        value.set(parseValue(v, unit));
      }
    });
    const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
    return () => {
      removeSourceOnChange();
      removeValueOnDestroy();
    };
  }
  return stopAnimation;
}
function parseValue(v, unit) {
  return unit ? v + unit : v;
}
function asNumber(v) {
  return typeof v === "number" ? v : parseFloat(v);
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && (options == null ? void 0 : options.clamp) !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useFollowValue(source, options = {}) {
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  const getFromSource = () => isMotionValue(source) ? source.get() : source;
  if (isStatic) {
    return useTransform(getFromSource);
  }
  const value = useMotionValue(getFromSource());
  reactExports.useInsertionEffect(() => {
    return attachFollow(value, source, options);
  }, [value, JSON.stringify(options)]);
  return value;
}
function useSpring(source, options = {}) {
  return useFollowValue(source, { type: "spring", ...options });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["rect", { x: "9", y: "9", width: "6", height: "6", rx: "1", key: "1ssd4o" }]
];
const CircleStop = createLucideIcon("circle-stop", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
var _Pie;
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Pie = /* @__PURE__ */ function(_PureComponent) {
  function Pie2(props) {
    var _this;
    _classCallCheck(this, Pie2);
    _this = _callSuper(this, Pie2, [props]);
    _defineProperty(_this, "pieRef", null);
    _defineProperty(_this, "sectorRefs", []);
    _defineProperty(_this, "id", uniqueId("recharts-pie-"));
    _defineProperty(_this, "handleAnimationEnd", function() {
      var onAnimationEnd = _this.props.onAnimationEnd;
      _this.setState({
        isAnimationFinished: true
      });
      if (isFunction(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      var onAnimationStart = _this.props.onAnimationStart;
      _this.setState({
        isAnimationFinished: false
      });
      if (isFunction(onAnimationStart)) {
        onAnimationStart();
      }
    });
    _this.state = {
      isAnimationFinished: !props.isAnimationActive,
      prevIsAnimationActive: props.isAnimationActive,
      prevAnimationId: props.animationId,
      sectorToFocus: 0
    };
    return _this;
  }
  _inherits(Pie2, _PureComponent);
  return _createClass(Pie2, [{
    key: "isActiveIndex",
    value: function isActiveIndex(i) {
      var activeIndex = this.props.activeIndex;
      if (Array.isArray(activeIndex)) {
        return activeIndex.indexOf(i) !== -1;
      }
      return i === activeIndex;
    }
  }, {
    key: "hasActiveIndex",
    value: function hasActiveIndex() {
      var activeIndex = this.props.activeIndex;
      return Array.isArray(activeIndex) ? activeIndex.length !== 0 : activeIndex || activeIndex === 0;
    }
  }, {
    key: "renderLabels",
    value: function renderLabels(sectors) {
      var isAnimationActive = this.props.isAnimationActive;
      if (isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, label = _this$props.label, labelLine = _this$props.labelLine, dataKey = _this$props.dataKey, valueKey = _this$props.valueKey;
      var pieProps = filterProps(this.props, false);
      var customLabelProps = filterProps(label, false);
      var customLabelLineProps = filterProps(labelLine, false);
      var offsetRadius = label && label.offsetRadius || 20;
      var labels = sectors.map(function(entry, i) {
        var midAngle = (entry.startAngle + entry.endAngle) / 2;
        var endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
        var labelProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
          stroke: "none"
        }, customLabelProps), {}, {
          index: i,
          textAnchor: Pie2.getTextAnchor(endPoint.x, entry.cx)
        }, endPoint);
        var lineProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
          fill: "none",
          stroke: entry.fill
        }, customLabelLineProps), {}, {
          index: i,
          points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint]
        });
        var realDataKey = dataKey;
        if (isNil(dataKey) && isNil(valueKey)) {
          realDataKey = "value";
        } else if (isNil(dataKey)) {
          realDataKey = valueKey;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          /* @__PURE__ */ React2.createElement(Layer, {
            key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
          }, labelLine && Pie2.renderLabelLineItem(labelLine, lineProps, "line"), Pie2.renderLabelItem(label, labelProps, getValueByDataKey(entry, realDataKey)))
        );
      });
      return /* @__PURE__ */ React2.createElement(Layer, {
        className: "recharts-pie-labels"
      }, labels);
    }
  }, {
    key: "renderSectorsStatically",
    value: function renderSectorsStatically(sectors) {
      var _this2 = this;
      var _this$props2 = this.props, activeShape = _this$props2.activeShape, blendStroke = _this$props2.blendStroke, inactiveShapeProp = _this$props2.inactiveShape;
      return sectors.map(function(entry, i) {
        if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
        var isActive = _this2.isActiveIndex(i);
        var inactiveShape = inactiveShapeProp && _this2.hasActiveIndex() ? inactiveShapeProp : null;
        var sectorOptions = isActive ? activeShape : inactiveShape;
        var sectorProps = _objectSpread(_objectSpread({}, entry), {}, {
          stroke: blendStroke ? entry.fill : entry.stroke,
          tabIndex: -1
        });
        return /* @__PURE__ */ React2.createElement(Layer, _extends({
          ref: function ref(_ref) {
            if (_ref && !_this2.sectorRefs.includes(_ref)) {
              _this2.sectorRefs.push(_ref);
            }
          },
          tabIndex: -1,
          className: "recharts-pie-sector"
        }, adaptEventsOfChild(_this2.props, entry, i), {
          // eslint-disable-next-line react/no-array-index-key
          key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
        }), /* @__PURE__ */ React2.createElement(Shape, _extends({
          option: sectorOptions,
          isActive,
          shapeType: "sector"
        }, sectorProps)));
      });
    }
  }, {
    key: "renderSectorsWithAnimation",
    value: function renderSectorsWithAnimation() {
      var _this3 = this;
      var _this$props3 = this.props, sectors = _this$props3.sectors, isAnimationActive = _this$props3.isAnimationActive, animationBegin = _this$props3.animationBegin, animationDuration = _this$props3.animationDuration, animationEasing = _this$props3.animationEasing, animationId = _this$props3.animationId;
      var _this$state = this.state, prevSectors = _this$state.prevSectors, prevIsAnimationActive = _this$state.prevIsAnimationActive;
      return /* @__PURE__ */ React2.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "pie-".concat(animationId, "-").concat(prevIsAnimationActive),
        onAnimationStart: this.handleAnimationStart,
        onAnimationEnd: this.handleAnimationEnd
      }, function(_ref2) {
        var t = _ref2.t;
        var stepData = [];
        var first = sectors && sectors[0];
        var curAngle = first.startAngle;
        sectors.forEach(function(entry, index) {
          var prev = prevSectors && prevSectors[index];
          var paddingAngle = index > 0 ? get(entry, "paddingAngle", 0) : 0;
          if (prev) {
            var angleIp = interpolateNumber(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
            var latest = _objectSpread(_objectSpread({}, entry), {}, {
              startAngle: curAngle + paddingAngle,
              endAngle: curAngle + angleIp(t) + paddingAngle
            });
            stepData.push(latest);
            curAngle = latest.endAngle;
          } else {
            var endAngle = entry.endAngle, startAngle = entry.startAngle;
            var interpolatorAngle = interpolateNumber(0, endAngle - startAngle);
            var deltaAngle = interpolatorAngle(t);
            var _latest = _objectSpread(_objectSpread({}, entry), {}, {
              startAngle: curAngle + paddingAngle,
              endAngle: curAngle + deltaAngle + paddingAngle
            });
            stepData.push(_latest);
            curAngle = _latest.endAngle;
          }
        });
        return /* @__PURE__ */ React2.createElement(Layer, null, _this3.renderSectorsStatically(stepData));
      });
    }
  }, {
    key: "attachKeyboardHandlers",
    value: function attachKeyboardHandlers(pieRef) {
      var _this4 = this;
      pieRef.onkeydown = function(e) {
        if (!e.altKey) {
          switch (e.key) {
            case "ArrowLeft": {
              var next = ++_this4.state.sectorToFocus % _this4.sectorRefs.length;
              _this4.sectorRefs[next].focus();
              _this4.setState({
                sectorToFocus: next
              });
              break;
            }
            case "ArrowRight": {
              var _next = --_this4.state.sectorToFocus < 0 ? _this4.sectorRefs.length - 1 : _this4.state.sectorToFocus % _this4.sectorRefs.length;
              _this4.sectorRefs[_next].focus();
              _this4.setState({
                sectorToFocus: _next
              });
              break;
            }
            case "Escape": {
              _this4.sectorRefs[_this4.state.sectorToFocus].blur();
              _this4.setState({
                sectorToFocus: 0
              });
              break;
            }
          }
        }
      };
    }
  }, {
    key: "renderSectors",
    value: function renderSectors() {
      var _this$props4 = this.props, sectors = _this$props4.sectors, isAnimationActive = _this$props4.isAnimationActive;
      var prevSectors = this.state.prevSectors;
      if (isAnimationActive && sectors && sectors.length && (!prevSectors || !isEqual(prevSectors, sectors))) {
        return this.renderSectorsWithAnimation();
      }
      return this.renderSectorsStatically(sectors);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.pieRef) {
        this.attachKeyboardHandlers(this.pieRef);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;
      var _this$props5 = this.props, hide = _this$props5.hide, sectors = _this$props5.sectors, className = _this$props5.className, label = _this$props5.label, cx = _this$props5.cx, cy = _this$props5.cy, innerRadius = _this$props5.innerRadius, outerRadius = _this$props5.outerRadius, isAnimationActive = _this$props5.isAnimationActive;
      var isAnimationFinished = this.state.isAnimationFinished;
      if (hide || !sectors || !sectors.length || !isNumber(cx) || !isNumber(cy) || !isNumber(innerRadius) || !isNumber(outerRadius)) {
        return null;
      }
      var layerClass = clsx("recharts-pie", className);
      return /* @__PURE__ */ React2.createElement(Layer, {
        tabIndex: this.props.rootTabIndex,
        className: layerClass,
        ref: function ref(_ref3) {
          _this5.pieRef = _ref3;
        }
      }, this.renderSectors(), label && this.renderLabels(sectors), Label.renderCallByParent(this.props, null, false), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, sectors, false));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (prevState.prevIsAnimationActive !== nextProps.isAnimationActive) {
        return {
          prevIsAnimationActive: nextProps.isAnimationActive,
          prevAnimationId: nextProps.animationId,
          curSectors: nextProps.sectors,
          prevSectors: [],
          isAnimationFinished: true
        };
      }
      if (nextProps.isAnimationActive && nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curSectors: nextProps.sectors,
          prevSectors: prevState.curSectors,
          isAnimationFinished: true
        };
      }
      if (nextProps.sectors !== prevState.curSectors) {
        return {
          curSectors: nextProps.sectors,
          isAnimationFinished: true
        };
      }
      return null;
    }
  }, {
    key: "getTextAnchor",
    value: function getTextAnchor(x, cx) {
      if (x > cx) {
        return "start";
      }
      if (x < cx) {
        return "end";
      }
      return "middle";
    }
  }, {
    key: "renderLabelLineItem",
    value: function renderLabelLineItem(option, props, key) {
      if (/* @__PURE__ */ React2.isValidElement(option)) {
        return /* @__PURE__ */ React2.cloneElement(option, props);
      }
      if (isFunction(option)) {
        return option(props);
      }
      var className = clsx("recharts-pie-label-line", typeof option !== "boolean" ? option.className : "");
      return /* @__PURE__ */ React2.createElement(Curve, _extends({}, props, {
        key,
        type: "linear",
        className
      }));
    }
  }, {
    key: "renderLabelItem",
    value: function renderLabelItem(option, props, value) {
      if (/* @__PURE__ */ React2.isValidElement(option)) {
        return /* @__PURE__ */ React2.cloneElement(option, props);
      }
      var label = value;
      if (isFunction(option)) {
        label = option(props);
        if (/* @__PURE__ */ React2.isValidElement(label)) {
          return label;
        }
      }
      var className = clsx("recharts-pie-label-text", typeof option !== "boolean" && !isFunction(option) ? option.className : "");
      return /* @__PURE__ */ React2.createElement(Text, _extends({}, props, {
        alignmentBaseline: "middle",
        className
      }), label);
    }
  }]);
}(reactExports.PureComponent);
_Pie = Pie;
_defineProperty(Pie, "displayName", "Pie");
_defineProperty(Pie, "defaultProps", {
  stroke: "#fff",
  fill: "#808080",
  legendType: "rect",
  cx: "50%",
  cy: "50%",
  startAngle: 0,
  endAngle: 360,
  innerRadius: 0,
  outerRadius: "80%",
  paddingAngle: 0,
  labelLine: true,
  hide: false,
  minAngle: 0,
  isAnimationActive: !Global.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  nameKey: "name",
  blendStroke: false,
  rootTabIndex: 0
});
_defineProperty(Pie, "parseDeltaAngle", function(startAngle, endAngle) {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
});
_defineProperty(Pie, "getRealPieData", function(itemProps) {
  var data = itemProps.data, children = itemProps.children;
  var presentationProps = filterProps(itemProps, false);
  var cells = findAllByType(children, Cell);
  if (data && data.length) {
    return data.map(function(entry, index) {
      return _objectSpread(_objectSpread(_objectSpread({
        payload: entry
      }, presentationProps), entry), cells && cells[index] && cells[index].props);
    });
  }
  if (cells && cells.length) {
    return cells.map(function(cell) {
      return _objectSpread(_objectSpread({}, presentationProps), cell.props);
    });
  }
  return [];
});
_defineProperty(Pie, "parseCoordinateOfPie", function(itemProps, offset) {
  var top = offset.top, left = offset.left, width = offset.width, height = offset.height;
  var maxPieRadius = getMaxRadius(width, height);
  var cx = left + getPercentValue(itemProps.cx, width, width / 2);
  var cy = top + getPercentValue(itemProps.cy, height, height / 2);
  var innerRadius = getPercentValue(itemProps.innerRadius, maxPieRadius, 0);
  var outerRadius = getPercentValue(itemProps.outerRadius, maxPieRadius, maxPieRadius * 0.8);
  var maxRadius = itemProps.maxRadius || Math.sqrt(width * width + height * height) / 2;
  return {
    cx,
    cy,
    innerRadius,
    outerRadius,
    maxRadius
  };
});
_defineProperty(Pie, "getComposedData", function(_ref4) {
  var item = _ref4.item, offset = _ref4.offset;
  var itemProps = item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.type.defaultProps), item.props) : item.props;
  var pieData = _Pie.getRealPieData(itemProps);
  if (!pieData || !pieData.length) {
    return null;
  }
  var cornerRadius = itemProps.cornerRadius, startAngle = itemProps.startAngle, endAngle = itemProps.endAngle, paddingAngle = itemProps.paddingAngle, dataKey = itemProps.dataKey, nameKey = itemProps.nameKey, valueKey = itemProps.valueKey, tooltipType = itemProps.tooltipType;
  var minAngle = Math.abs(itemProps.minAngle);
  var coordinate = _Pie.parseCoordinateOfPie(itemProps, offset);
  var deltaAngle = _Pie.parseDeltaAngle(startAngle, endAngle);
  var absDeltaAngle = Math.abs(deltaAngle);
  var realDataKey = dataKey;
  if (isNil(dataKey) && isNil(valueKey)) {
    warn(false, 'Use "dataKey" to specify the value of pie,\n      the props "valueKey" will be deprecated in 1.1.0');
    realDataKey = "value";
  } else if (isNil(dataKey)) {
    warn(false, 'Use "dataKey" to specify the value of pie,\n      the props "valueKey" will be deprecated in 1.1.0');
    realDataKey = valueKey;
  }
  var notZeroItemCount = pieData.filter(function(entry) {
    return getValueByDataKey(entry, realDataKey, 0) !== 0;
  }).length;
  var totalPadingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPadingAngle;
  var sum = pieData.reduce(function(result, entry) {
    var val = getValueByDataKey(entry, realDataKey, 0);
    return result + (isNumber(val) ? val : 0);
  }, 0);
  var sectors;
  if (sum > 0) {
    var prev;
    sectors = pieData.map(function(entry, i) {
      var val = getValueByDataKey(entry, realDataKey, 0);
      var name = getValueByDataKey(entry, nameKey, i);
      var percent = (isNumber(val) ? val : 0) / sum;
      var tempStartAngle;
      if (i) {
        tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }
      var tempEndAngle = tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
      var midAngle = (tempStartAngle + tempEndAngle) / 2;
      var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
      var tooltipPayload = [{
        name,
        value: val,
        payload: entry,
        dataKey: realDataKey,
        type: tooltipType
      }];
      var tooltipPosition = polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle);
      prev = _objectSpread(_objectSpread(_objectSpread({
        percent,
        cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition
      }, entry), coordinate), {}, {
        value: getValueByDataKey(entry, realDataKey),
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entry,
        paddingAngle: mathSign(deltaAngle) * paddingAngle
      });
      return prev;
    });
  }
  return _objectSpread(_objectSpread({}, coordinate), {}, {
    sectors,
    data: pieData
  });
});
var PieChart = generateCategoricalChart({
  chartName: "PieChart",
  GraphicalChild: Pie,
  validateTooltipEventTypes: ["item"],
  defaultTooltipEventType: "item",
  legendContent: "children",
  axisComponents: [{
    axisType: "angleAxis",
    AxisComp: PolarAngleAxis
  }, {
    axisType: "radiusAxis",
    AxisComp: PolarRadiusAxis
  }],
  formatAxisMap,
  defaultProps: {
    layout: "centric",
    startAngle: 0,
    endAngle: 360,
    cx: "50%",
    cy: "50%",
    innerRadius: 0,
    outerRadius: "80%"
  }
});
const SUBJECT_COLORS = {
  violet: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  cyan: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  green: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  orange: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  rose: "bg-chart-5/20 text-chart-5 border-chart-5/30"
};
const PRIORITY_BADGE = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  low: "bg-chart-3/20 text-chart-3 border-chart-3/30"
};
const CHART_COLORS = [
  "oklch(0.72 0.19 270)",
  "oklch(0.68 0.16 180)",
  "oklch(0.62 0.2 120)",
  "oklch(0.68 0.18 50)",
  "oklch(0.6 0.22 15)"
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sampleQuizzes = {
  Mathematics: [
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "-1"],
      correctIndex: 1
    },
    {
      question: "In linear algebra, what does 'rank' of a matrix refer to?",
      options: [
        "Number of rows",
        "Number of non-zero rows in row echelon form",
        "Number of columns",
        "Trace of the matrix"
      ],
      correctIndex: 1
    },
    {
      question: "Which theorem states every matrix satisfies its characteristic equation?",
      options: ["Rank-Nullity", "Cayley-Hamilton", "Spectral", "Jordan"],
      correctIndex: 1
    }
  ],
  Chemistry: [
    {
      question: "What type of bond involves sharing electrons?",
      options: ["Ionic", "Covalent", "Hydrogen", "Metallic"],
      correctIndex: 1
    },
    {
      question: "Which functional group is characteristic of alcohols?",
      options: ["-COOH", "-NH2", "-OH", "-CHO"],
      correctIndex: 2
    },
    {
      question: "What is the primary product of glucose fermentation?",
      options: ["Acetic acid", "Ethanol", "Methanol", "Lactic acid"],
      correctIndex: 1
    }
  ],
  Physics: [
    {
      question: "Newton's second law relates force to which quantities?",
      options: [
        "Speed and distance",
        "Mass and acceleration",
        "Velocity and time",
        "Energy and power"
      ],
      correctIndex: 1
    },
    {
      question: "Which law describes conservation of energy?",
      options: [
        "First Law of Thermodynamics",
        "Ohm's Law",
        "Hooke's Law",
        "Boyle's Law"
      ],
      correctIndex: 0
    },
    {
      question: "What is the SI unit of electric resistance?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctIndex: 2
    }
  ]
};
function ProgressRing({ percent }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const springPercent = useSpring(0, { stiffness: 60, damping: 15 });
  const strokeDashoffset = useTransform(
    springPercent,
    (v) => circumference - v / 100 * circumference
  );
  reactExports.useEffect(() => {
    springPercent.set(percent);
  }, [percent, springPercent]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-32 flex-shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        className: "w-full h-full -rotate-90",
        viewBox: "0 0 128 128",
        role: "img",
        "aria-label": `Daily goal ${percent}% complete`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "64",
              cy: "64",
              r: radius,
              fill: "none",
              strokeWidth: "8",
              className: "stroke-muted"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "ring-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.72 0.19 270)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.68 0.16 180)" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.circle,
            {
              cx: "64",
              cy: "64",
              r: radius,
              fill: "none",
              strokeWidth: "8",
              stroke: "url(#ring-gradient)",
              strokeLinecap: "round",
              strokeDasharray: circumference,
              style: { strokeDashoffset }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.span,
        {
          className: "text-2xl font-display font-bold text-foreground",
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.6, duration: 0.4 },
          children: [
            percent,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium mt-0.5", children: "Complete" })
    ] })
  ] });
}
function useElapsedTime(startTime) {
  const [elapsed, setElapsed] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1e3));
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [startTime]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor(elapsed % 3600 / 60);
  const s = elapsed % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function ActiveSessionBanner() {
  const { activeSession, tasks, stopSession, openQuiz, completeTask } = useStudyStore();
  const timer = useElapsedTime((activeSession == null ? void 0 : activeSession.startTime) ?? null);
  if (!activeSession) return null;
  const task = tasks.find((t) => t.id === activeSession.taskId);
  function handleStop() {
    stopSession();
    ue.success("Session saved!", { duration: 2e3 });
  }
  function handleComplete() {
    if (!task) return;
    completeTask(task.id);
    stopSession();
    const questions = sampleQuizzes[task.subject] ?? sampleQuizzes.Mathematics;
    openQuiz({
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      questions: questions.map((q, i) => ({ id: String(i), ...q })),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    ue.success(`"${task.title}" completed! Quiz unlocked 🎯`, {
      duration: 3e3
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -16 },
      transition: { duration: 0.4 },
      "data-ocid": "active_session.banner",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/40 bg-primary/5 overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary animate-pulse-gentle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-4 h-4 text-primary animate-pulse-gentle" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Active Session" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate", children: (task == null ? void 0 : task.title) ?? "Unknown Task" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xl font-mono font-bold text-primary tabular-nums",
                  "data-ocid": "active_session.timer",
                  children: timer
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "elapsed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-8 border-border text-muted-foreground hover:text-destructive hover:border-destructive/30",
                  onClick: handleStop,
                  "data-ocid": "active_session.stop_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "w-3.5 h-3.5 mr-1" }),
                    "Stop"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "h-8 bg-gradient-primary text-white hover:opacity-90",
                  onClick: handleComplete,
                  "data-ocid": "active_session.complete_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
                    "Done"
                  ]
                }
              )
            ] })
          ] })
        ] }) })
      ] })
    }
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  colorClass,
  delay
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.4 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border hover:shadow-elevated transition-smooth hover:-translate-y-0.5 group overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 font-medium", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
            }
          )
        ] }) })
      ] })
    }
  );
}
function TaskCard({ task, index }) {
  const { completeTask, startSession, activeSession, stopSession, openQuiz } = useStudyStore();
  const isSessionActive = (activeSession == null ? void 0 : activeSession.taskId) === task.id;
  function handleComplete() {
    completeTask(task.id);
    stopSession();
    const questions = sampleQuizzes[task.subject] ?? sampleQuizzes.Mathematics;
    openQuiz({
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      questions: questions.map((q, i) => ({ id: String(i), ...q })),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    ue.success(`"${task.title}" completed! Quiz unlocked 🎯`, {
      duration: 3e3
    });
  }
  function handleSession() {
    if (isSessionActive) {
      stopSession();
      ue.success("Session saved!", { duration: 2e3 });
    } else {
      startSession(task.id);
      ue.info(`Started: ${task.title}`, { duration: 2e3 });
    }
  }
  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / 864e5
  );
  const isOverdue = daysUntilDue < 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.08, duration: 0.35 },
      "data-ocid": `task.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `group relative overflow-hidden border transition-smooth hover:shadow-elevated hover:-translate-y-0.5 ${isSessionActive ? "border-primary/50 shadow-accent" : "border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-smooth" }),
            isSessionActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary animate-pulse-gentle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-[10px] font-medium px-2 py-0.5 ${SUBJECT_COLORS[task.subjectColor]}`,
                      children: task.subject
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-[10px] font-medium px-2 py-0.5 capitalize ${PRIORITY_BADGE[task.priority]}`,
                      children: task.priority
                    }
                  ),
                  isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "destructive",
                      className: "text-[10px] px-2 py-0.5",
                      children: "Overdue"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm leading-snug truncate", children: task.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                    task.estimatedMinutes,
                    "m"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : daysUntilDue === 0 ? "Due today" : `${daysUntilDue}d left` })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: `h-8 px-2 text-xs ${isSessionActive ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-primary"}`,
                    onClick: handleSession,
                    "aria-label": isSessionActive ? "Stop session" : "Start session",
                    "data-ocid": `task.session_button.${index + 1}`,
                    children: isSessionActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-8 px-2 text-xs text-muted-foreground hover:text-chart-3",
                    onClick: handleComplete,
                    "aria-label": "Mark task complete",
                    "data-ocid": `task.complete_button.${index + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }) })
          ]
        }
      )
    }
  );
}
function WeeklyChart({
  sessions
}) {
  const [animated, setAnimated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);
  const data = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    return DAYS.map((day, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (today.getDay() - 1 + 7) % 7 + i);
      const dateStr = d.toISOString().split("T")[0];
      const minutes = sessions.filter((s) => s.date === dateStr).reduce((sum, s) => sum + s.durationMinutes, 0);
      return {
        day,
        minutes,
        isToday: dateStr === today.toISOString().split("T")[0]
      };
    });
  }, [sessions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    BarChart,
    {
      data,
      barSize: 20,
      margin: { top: 4, right: 4, left: -24, bottom: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartesianGrid,
          {
            vertical: false,
            strokeDasharray: "3 3",
            stroke: "oklch(0.3 0 0 / 0.3)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "day",
            tick: { fontSize: 11, fill: "oklch(0.6 0 0)" },
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            tick: { fontSize: 10, fill: "oklch(0.6 0 0)" },
            axisLine: false,
            tickLine: false,
            tickFormatter: (v) => v > 0 ? `${v}m` : ""
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            cursor: { fill: "oklch(0.72 0.19 270 / 0.08)" },
            contentStyle: {
              background: "oklch(0.2 0 0)",
              border: "1px solid oklch(0.3 0 0)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "oklch(0.94 0 0)"
            },
            formatter: (value) => [`${value}m`, "Studied"]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "minutes",
            radius: [4, 4, 0, 0],
            isAnimationActive: animated,
            animationDuration: 800,
            children: data.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Cell,
              {
                fill: entry.isToday ? "url(#bar-gradient)" : "oklch(0.72 0.19 270 / 0.35)"
              },
              entry.day
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "bar-gradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.72 0.19 270)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.68 0.16 180)" })
        ] }) })
      ]
    }
  ) });
}
function SubjectDonut({ tasks }) {
  const [activeIdx, setActiveIdx] = reactExports.useState(null);
  const [animated, setAnimated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);
  const data = reactExports.useMemo(() => {
    const subjectMap = {};
    for (const t of tasks) {
      subjectMap[t.subject] = (subjectMap[t.subject] ?? 0) + t.estimatedMinutes;
    }
    return Object.entries(subjectMap).map(([name, value]) => ({ name, value }));
  }, [tasks]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 text-muted-foreground text-sm", children: "No subjects yet" });
  }
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Sector,
      {
        cx,
        cy,
        innerRadius,
        outerRadius: outerRadius + 6,
        startAngle,
        endAngle,
        fill
      }
    ) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: 120, height: 120, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Pie,
      {
        data,
        cx: "50%",
        cy: "50%",
        innerRadius: 34,
        outerRadius: 52,
        dataKey: "value",
        isAnimationActive: animated,
        animationBegin: 0,
        animationDuration: 900,
        activeIndex: activeIdx ?? void 0,
        activeShape: renderActiveShape,
        onMouseEnter: (_, idx) => setActiveIdx(idx),
        onMouseLeave: () => setActiveIdx(null),
        children: data.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Cell,
          {
            fill: CHART_COLORS[data.indexOf(entry) % CHART_COLORS.length]
          },
          entry.name
        ))
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-1.5 min-w-0", children: data.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-2 h-2 rounded-full flex-shrink-0",
          style: { background: CHART_COLORS[i % CHART_COLORS.length] }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate flex-1", children: entry.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-medium text-foreground", children: [
        entry.value,
        "m"
      ] })
    ] }, entry.name)) })
  ] });
}
function QuizScoreCard({
  score,
  total,
  subject,
  date,
  index
}) {
  const pct = Math.round(score / total * 100);
  const colorClass = pct >= 80 ? "text-chart-3 bg-chart-3/10 border-chart-3/20" : pct >= 50 ? "text-chart-4 bg-chart-4/10 border-chart-4/20" : "text-destructive bg-destructive/10 border-destructive/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: 0.6 + index * 0.07 },
      "data-ocid": `quiz.score_card.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 text-center ${colorClass}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 mx-auto mb-1 opacity-80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-display font-bold tabular-nums", children: [
          pct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium opacity-70 truncate", children: subject ?? "Quiz" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] opacity-50 mt-0.5", children: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }) })
      ] })
    }
  );
}
function NewUserEmptyState({ onAddTask }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "flex flex-col items-center justify-center py-16 px-6 text-center",
      "data-ocid": "dashboard.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground mb-2", children: "Welcome, Scholar!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed", children: "Your AI-powered study planner is ready. Add your first task to start tracking progress, earning streaks, and unlocking quizzes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "bg-gradient-primary text-white hover:opacity-90 shadow-accent",
            onClick: onAddTask,
            "data-ocid": "dashboard.empty_state.add_task_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
              "Add Your First Task"
            ]
          }
        )
      ]
    }
  );
}
function DashboardPage() {
  const { tasks, sessions, quizResults, quizState, activeSession } = useStudyStore();
  const [showAllTasks, setShowAllTasks] = reactExports.useState(false);
  const navigate = useNavigate();
  const isNewUser = tasks.length === 0;
  const stats = reactExports.useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const total = tasks.length;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayMinutes = sessions.filter((s) => s.date === todayStr).reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalStudyTime = sessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );
    const streak = sessions.length > 0 ? Math.min(sessions.length, 7) : 0;
    const avgScore = quizResults.length > 0 ? Math.round(
      quizResults.reduce((sum, r) => sum + r.score / r.total * 100, 0) / quizResults.length
    ) : 0;
    const dailyGoalMinutes = 120;
    const dailyGoalPct = Math.min(
      100,
      Math.round(todayMinutes / dailyGoalMinutes * 100)
    );
    return {
      completed,
      total,
      todayMinutes,
      totalStudyTime,
      streak,
      avgScore,
      dailyGoalPct
    };
  }, [tasks, sessions, quizResults]);
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const upcomingTasks = [...pendingTasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  ).slice(0, 3);
  const displayedTasks = showAllTasks ? pendingTasks : pendingTasks.slice(0, 4);
  const overallProgress = stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0;
  const recentQuizResults = quizResults.slice(0, 5);
  const enrichedQuizResults = reactExports.useMemo(
    () => recentQuizResults.map((r) => ({
      ...r,
      subject: void 0
    })),
    [recentQuizResults]
  );
  function handleStartTask() {
    navigate({ to: "/tasks" });
  }
  const greetingHour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "flex items-start justify-between gap-4",
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl sm:text-3xl font-display font-bold text-foreground", children: [
              greeting,
              ", Scholar",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse-gentle inline-block", children: "👋" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [
              pendingTasks.length,
              " tasks remaining · ",
              overallProgress,
              "% weekly goal"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.2 },
              className: "hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary", children: "AI Ready" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activeSession && /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveSessionBanner, {}) }),
    isNewUser ? /* @__PURE__ */ jsxRuntimeExports.jsx(NewUserEmptyState, { onAddTask: handleStartTask }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15, duration: 0.45 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border overflow-hidden relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-primary opacity-[0.04] pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressRing, { percent: stats.dailyGoalPct }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-center sm:text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground", children: "Daily Goal Progress" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                  stats.todayMinutes,
                  "m studied today · goal: 2h"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 relative h-2 rounded-full overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    className: "absolute inset-y-0 left-0 rounded-full bg-gradient-primary",
                    initial: { width: 0 },
                    animate: { width: `${stats.dailyGoalPct}%` },
                    transition: {
                      delay: 0.7,
                      duration: 0.9,
                      ease: "easeOut"
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-4 flex-wrap justify-center sm:justify-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-chart-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: stats.streak }),
                    " ",
                    "day streak"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-chart-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                      stats.completed,
                      "/",
                      stats.total
                    ] }),
                    " ",
                    "complete"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-3.5 h-3.5 text-chart-1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: stats.avgScore > 0 ? `${stats.avgScore}%` : "—" }),
                    " ",
                    "quiz avg"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex sm:flex-col gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "bg-gradient-primary text-white hover:opacity-90 shadow-accent text-xs",
                    onClick: handleStartTask,
                    "data-ocid": "dashboard.start_new_task_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                      "New Task"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "border-primary/30 text-primary hover:bg-primary/10 text-xs",
                    onClick: () => navigate({ to: "/tasks" }),
                    "data-ocid": "dashboard.view_all_tasks_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-1" }),
                      "All Tasks"
                    ]
                  }
                )
              ] })
            ] }) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: CircleCheck,
            label: "Completed",
            value: `${stats.completed}/${stats.total}`,
            sub: "tasks this week",
            colorClass: "bg-chart-3/20 text-chart-3",
            delay: 0.2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: Clock,
            label: "Today",
            value: `${stats.todayMinutes}m`,
            sub: "studied today",
            colorClass: "bg-chart-1/20 text-chart-1",
            delay: 0.25
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: TrendingUp,
            label: "Total Time",
            value: `${Math.floor(stats.totalStudyTime / 60)}h ${stats.totalStudyTime % 60}m`,
            sub: "all sessions",
            colorClass: "bg-chart-2/20 text-chart-2",
            delay: 0.3
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            icon: Flame,
            label: "Streak",
            value: `${stats.streak}d`,
            sub: "days studying",
            colorClass: "bg-chart-4/20 text-chart-4",
            delay: 0.35
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4, duration: 0.45 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border h-full",
                "data-ocid": "dashboard.weekly_chart.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-display font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
                    "Weekly Study Time"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeeklyChart, { sessions }) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.45, duration: 0.45 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border h-full",
                "data-ocid": "dashboard.subject_chart.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-display font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-secondary" }),
                    "Study by Subject"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SubjectDonut, { tasks }) })
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.45 },
            className: "lg:col-span-2",
            "data-ocid": "dashboard.upcoming_tasks.section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-display font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-chart-2" }),
                  "Upcoming Tasks"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-primary text-xs gap-1 h-7 px-2",
                    onClick: () => navigate({ to: "/tasks" }),
                    "data-ocid": "dashboard.upcoming_tasks.view_all_link",
                    children: [
                      "View all",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-5 px-5", children: upcomingTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-8 border border-dashed border-border rounded-xl",
                  "data-ocid": "dashboard.upcoming_tasks.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-chart-3 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "All caught up!" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "No upcoming tasks. Add new ones to keep learning." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: upcomingTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaskCard, { task, index: i }, task.id)) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.55, duration: 0.45 },
            "data-ocid": "dashboard.quiz_scores.section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm font-display font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-4 h-4 text-chart-4" }),
                "Recent Quizzes"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pb-5 px-5", children: enrichedQuizResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-6 border border-dashed border-border rounded-xl",
                  "data-ocid": "dashboard.quiz_scores.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-7 h-7 text-muted-foreground/50 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Complete tasks to unlock AI quizzes" })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: enrichedQuizResults.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                QuizScoreCard,
                {
                  score: r.score,
                  total: r.total,
                  subject: r.subject,
                  date: r.completedAt,
                  index: i
                },
                r.id
              )) }) })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6, duration: 0.45 },
          "data-ocid": "dashboard.all_tasks.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-display font-semibold text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
                "All Pending Tasks",
                pendingTasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] px-1.5 py-0",
                    children: pendingTasks.length
                  }
                )
              ] }),
              pendingTasks.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-primary text-xs gap-1 h-7 px-2",
                  onClick: () => setShowAllTasks(!showAllTasks),
                  "data-ocid": "dashboard.all_tasks.show_all_toggle",
                  children: [
                    showAllTasks ? "Show less" : "See all",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronRight,
                      {
                        className: `w-3 h-3 transition-smooth ${showAllTasks ? "rotate-90" : ""}`
                      }
                    )
                  ]
                }
              )
            ] }),
            pendingTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-10 border border-dashed border-border rounded-xl",
                "data-ocid": "dashboard.all_tasks.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-9 h-9 text-chart-3 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: "All tasks complete!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-4", children: "You've finished everything. Ready for more?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "bg-gradient-primary text-white hover:opacity-90",
                      onClick: handleStartTask,
                      "data-ocid": "dashboard.all_tasks.add_more_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                        "Add More Tasks"
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: displayedTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaskCard, { task, index: i }, task.id)) }) })
          ]
        }
      )
    ] }),
    quizState.activeQuiz && /* @__PURE__ */ jsxRuntimeExports.jsx(QuizModal, {})
  ] });
}
export {
  DashboardPage as default
};
