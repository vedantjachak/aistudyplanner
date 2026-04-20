import { e as createLucideIcon, r as reactExports, k as jsxRuntimeExports, p as useComposedRefs, q as cn, h as useStudyStore, l as motion, S as SquareCheckBig, B as Button, o as ue, n as BookOpen, C as Clock } from "./index-CviB1n4S.js";
import { P as Plus, A as AnimatePresence, B as Badge } from "./badge-D8m6OhXH.js";
import { C as Card, a as CardContent } from "./card-BbdGlSpY.js";
import { u as useId, P as Primitive, c as composeEventHandlers, a as createContextScope, b as useControllableState, d as useCallbackRef, e as Presence, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, i as DialogFooter } from "./dialog-BlnJS6wj.js";
import { I as Input } from "./input-C6_3rC4p.js";
import { c as createCollection, u as useDirection, S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, e as SelectItem, T as Trash2, L as Label } from "./select-iTk_9Jh6.js";
import { Q as QuizModal, C as CircleCheck } from "./QuizModal-PrBxIFE0.js";
import { g as generateQuizWithOllama } from "./ollama-CQFyrNv9.js";
import { S as Sparkles } from "./sparkles-DyJQeLW4.js";
import "./brain-X8ClrNe6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const SUBJECT_COLORS = {
  violet: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  cyan: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  green: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  orange: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  rose: "bg-chart-5/20 text-chart-5 border-chart-5/30"
};
const SUBJECT_PRESETS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
  "Psychology",
  "Philosophy",
  "Geography",
  "Art History",
  "Sociology",
  "Business",
  "Political Science",
  "Languages",
  "Other"
];
const PRIORITY_STYLES = {
  high: "text-destructive",
  medium: "text-chart-4",
  low: "text-chart-3"
};
const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed"
};
function AddTaskDialog({
  open,
  onClose
}) {
  const { addTask } = useStudyStore();
  const [form, setForm] = reactExports.useState({
    title: "",
    subject: "",
    customSubject: "",
    subjectColor: "violet",
    priority: "medium",
    dueDate: "",
    estimatedMinutes: 60,
    tags: ""
  });
  function handleSubmit(e) {
    e.preventDefault();
    const finalSubject = form.subject === "Other" ? form.customSubject : form.subject;
    if (!form.title.trim() || !finalSubject.trim() || !form.dueDate) {
      ue.error("Please fill all required fields");
      return;
    }
    addTask({
      id: crypto.randomUUID(),
      title: form.title,
      subject: finalSubject,
      subjectColor: form.subjectColor,
      priority: form.priority,
      dueDate: form.dueDate,
      estimatedMinutes: form.estimatedMinutes,
      status: "todo",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    });
    ue.success("Task added! 🚀");
    onClose();
    setForm({
      title: "",
      subject: "",
      customSubject: "",
      subjectColor: "violet",
      priority: "medium",
      dueDate: "",
      estimatedMinutes: 60,
      tags: ""
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md border-border bg-card",
      "data-ocid": "tasks.add_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-white" }) }),
          "Add New Task"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Task Title *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                placeholder: "e.g. Review Chapter 7 — Calculus",
                value: form.title,
                onChange: (e) => setForm({ ...form, title: e.target.value }),
                "data-ocid": "tasks.title.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Subject *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.subject || "",
                  onValueChange: (v) => setForm({ ...form, subject: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tasks.subject.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select subject" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SUBJECT_PRESETS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                  ]
                }
              )
            ] }),
            form.subject === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "customSubject", children: "Custom Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "customSubject",
                  placeholder: "e.g. Music Theory",
                  value: form.customSubject,
                  onChange: (e) => setForm({ ...form, customSubject: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color Tag" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.subjectColor,
                  onValueChange: (v) => setForm({ ...form, subjectColor: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tasks.color.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                      "violet",
                      "cyan",
                      "green",
                      "orange",
                      "rose"
                    ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.priority,
                  onValueChange: (v) => setForm({ ...form, priority: v }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tasks.priority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "high", children: "🔴 High" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "medium", children: "🟡 Medium" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "low", children: "🟢 Low" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration (min)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 5,
                  max: 480,
                  value: form.estimatedMinutes,
                  onChange: (e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) }),
                  "data-ocid": "tasks.minutes.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dueDate",
                type: "date",
                value: form.dueDate,
                onChange: (e) => setForm({ ...form, dueDate: e.target.value }),
                "data-ocid": "tasks.due_date.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tags", children: "Tags (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "tags",
                placeholder: "homework, exam, review",
                value: form.tags,
                onChange: (e) => setForm({ ...form, tags: e.target.value }),
                "data-ocid": "tasks.tags.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: onClose,
                "data-ocid": "tasks.add_dialog.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "bg-gradient-primary text-white hover:opacity-90 shadow-accent",
                "data-ocid": "tasks.add_dialog.submit_button",
                children: "Add Task"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DeleteConfirmDialog({
  taskTitle,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm border-border bg-card",
      "data-ocid": "tasks.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-destructive" }),
          "Delete Task"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Are you sure you want to delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
            '"',
            taskTitle,
            '"'
          ] }),
          "? This cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onCancel,
              "data-ocid": "tasks.delete_dialog.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: onConfirm,
              "data-ocid": "tasks.delete_dialog.confirm_button",
              children: "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function useTaskTimer(_taskId, isActive) {
  const [elapsed, setElapsed] = reactExports.useState(0);
  const intervalRef = reactExports.useRef(null);
  const startRef = reactExports.useRef(Date.now());
  const elapsedRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);
  reactExports.useEffect(() => {
    if (isActive) {
      startRef.current = Date.now() - elapsedRef.current * 1e3;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1e3));
      }, 1e3);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);
  const reset = reactExports.useCallback(() => {
    setElapsed(0);
    startRef.current = Date.now();
  }, []);
  return { elapsed, reset };
}
function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  const s = secs % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
const BURST_KEYS = ["b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7"];
function CelebrationBurst() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 overflow-hidden rounded-xl", children: BURST_KEYS.map((key, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "absolute w-2 h-2 rounded-full",
      style: {
        background: i % 2 === 0 ? "oklch(0.72 0.19 270)" : "oklch(0.68 0.16 180)",
        left: `${20 + i % 4 * 20}%`,
        top: "50%"
      },
      initial: { scale: 0, opacity: 1, y: 0, x: 0 },
      animate: {
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        y: [-20 - i * 8, -60 - i * 8],
        x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)]
      },
      transition: { duration: 0.8, ease: "easeOut" }
    },
    key
  )) });
}
function TaskCard({ task, index, onDeleteRequest, onQuizOpen }) {
  const { updateTask, completeTask, activeSession, startSession, stopSession } = useStudyStore();
  const isActiveSession = (activeSession == null ? void 0 : activeSession.taskId) === task.id;
  const [localPaused, setLocalPaused] = reactExports.useState(false);
  const [justCompleted, setJustCompleted] = reactExports.useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = reactExports.useState(false);
  const { elapsed, reset } = useTaskTimer(
    task.id,
    isActiveSession && !localPaused
  );
  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / 864e5
  );
  const isOverdue = daysUntilDue < 0 && task.status !== "completed";
  const remainingSecs = Math.max(0, task.estimatedMinutes * 60 - elapsed);
  const progressPct = Math.min(
    100,
    elapsed / (task.estimatedMinutes * 60) * 100
  );
  function handleStart() {
    startSession(task.id);
    setLocalPaused(false);
    reset();
    updateTask(task.id, { status: "in_progress" });
    ue.success(`Started: ${task.title}`);
  }
  function handlePause() {
    setLocalPaused((p) => !p);
  }
  async function handleCompleteSession() {
    stopSession();
    setLocalPaused(false);
    completeTask(task.id);
    setJustCompleted(true);
    ue.success("Session complete! 🎉 Generating AI quiz...");
    setIsGeneratingQuiz(true);
    try {
      const quiz = await generateQuizWithOllama(task);
      setJustCompleted(false);
      onQuizOpen(quiz);
    } catch (err) {
      ue.error("Failed to generate AI quiz.");
      setJustCompleted(false);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10, height: 0, marginBottom: 0 },
      transition: {
        delay: index * 0.06,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      },
      "data-ocid": `tasks.item.${index + 1}`,
      className: "relative",
      children: [
        justCompleted && !isGeneratingQuiz && /* @__PURE__ */ jsxRuntimeExports.jsx(CelebrationBurst, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: cn(
              "border overflow-hidden transition-smooth group relative",
              task.status === "completed" && "opacity-60",
              isActiveSession ? "border-primary/50 shadow-accent" : "border-border hover:border-primary/30 hover:shadow-elevated"
            ),
            children: [
              isActiveSession && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary",
                  initial: { scaleX: 0 },
                  animate: { scaleX: 1 },
                  transition: { duration: 0.4 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    type: "button",
                    whileTap: { scale: 0.85 },
                    onClick: () => {
                      if (task.status !== "completed") {
                        setJustCompleted(true);
                        completeTask(task.id);
                        ue.success("Task completed! 🎉");
                        setTimeout(() => setJustCompleted(false), 900);
                      }
                    },
                    className: cn(
                      "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-smooth flex items-center justify-center",
                      task.status === "completed" ? "border-chart-3 bg-chart-3/20" : "border-border hover:border-chart-3"
                    ),
                    "data-ocid": `tasks.checkbox.${index + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: task.status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { scale: 0 },
                        animate: { scale: 1 },
                        exit: { scale: 0 },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-chart-3" })
                      }
                    ) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: cn(
                          "text-sm font-medium text-foreground truncate",
                          task.status === "completed" && "line-through text-muted-foreground"
                        ),
                        children: task.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-[10px] px-1.5 py-0 border ${SUBJECT_COLORS[task.subjectColor]}`,
                        children: task.subject
                      }
                    ),
                    task.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: cn(
                          "text-[10px] px-1.5 py-0",
                          task.status === "in_progress" && "border-primary/40 bg-primary/10 text-primary"
                        ),
                        children: STATUS_LABELS[task.status]
                      }
                    ),
                    isActiveSession && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.span,
                      {
                        animate: { opacity: [1, 0.5, 1] },
                        transition: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5
                        },
                        className: "flex items-center gap-1 text-[10px] text-primary font-medium",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary inline-block" }),
                          "LIVE"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn("font-medium", PRIORITY_STYLES[task.priority]),
                        children: task.priority
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                      task.estimatedMinutes,
                      "m"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(isOverdue && "text-destructive font-medium"),
                        children: isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : task.status === "completed" ? "Done" : daysUntilDue === 0 ? "Due today" : `${daysUntilDue}d left`
                      }
                    ),
                    task.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "px-1.5 py-0.5 rounded bg-muted text-[10px]",
                        children: [
                          "#",
                          tag
                        ]
                      },
                      tag
                    ))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isActiveSession && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: "auto" },
                      exit: { opacity: 0, height: 0 },
                      className: "mt-3 space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                            localPaused ? "Paused —" : "Elapsed —",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground font-semibold ml-1", children: formatTime(elapsed) })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                            "Remaining:",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: cn(
                                  "font-mono font-semibold ml-1",
                                  remainingSecs === 0 ? "text-chart-3" : "text-foreground"
                                ),
                                children: remainingSecs === 0 ? "Done!" : formatTime(remainingSecs)
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            className: "h-full bg-gradient-primary rounded-full",
                            animate: { width: `${progressPct}%` },
                            transition: { duration: 0.5 }
                          }
                        ) })
                      ]
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0 self-start", children: [
                  isGeneratingQuiz && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary animate-pulse flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3" }),
                    "Generating Quiz..."
                  ] }) }),
                  task.status !== "completed" && !isGeneratingQuiz && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: !isActiveSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileTap: { scale: 0.9 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "h-7 gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10",
                      onClick: handleStart,
                      "data-ocid": `tasks.start_button.${index + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 fill-current" }),
                        "Start"
                      ]
                    }
                  ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileTap: { scale: 0.9 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "h-7 w-7 p-0 border-border",
                        onClick: handlePause,
                        "data-ocid": `tasks.pause_button.${index + 1}`,
                        children: localPaused ? /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 fill-current text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3 h-3 text-muted-foreground" })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileTap: { scale: 0.9 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "h-7 w-7 p-0 border-chart-3/40 text-chart-3 hover:bg-chart-3/10",
                        onClick: handleCompleteSession,
                        "data-ocid": `tasks.complete_session_button.${index + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3 fill-current" })
                      }
                    ) })
                  ] }) }),
                  task.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: task.status,
                      onValueChange: (v) => updateTask(task.id, { status: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "h-7 text-xs w-28 border-border",
                            "data-ocid": `tasks.status.select.${index + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todo", children: "To Do" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "in_progress", children: "In Progress" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth",
                      onClick: () => onDeleteRequest(task),
                      "data-ocid": `tasks.delete_button.${index + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
function EmptyState({ hasSearch }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      className: "py-16 flex flex-col items-center gap-4 border border-dashed border-border rounded-2xl bg-card/40",
      "data-ocid": "tasks.empty_state",
      children: hasSearch ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-10 h-10 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No tasks found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Try a different search term" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "relative",
            animate: { y: [0, -6, 0] },
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center",
                  animate: { scale: [1, 1.2, 1] },
                  transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 0.5
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-white" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg", children: "No tasks yet!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Add your first study task to get started. Complete sessions to unlock AI-powered quizzes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: ["Start session", "Complete task", "Take quiz"].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium text-[10px]", children: i + 1 }),
          step,
          i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "→" })
        ] }, step)) })
      ] })
    }
  );
}
function TasksPage() {
  const { tasks, openQuiz } = useStudyStore();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const { deleteTask } = useStudyStore();
  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length
  };
  function handleQuizOpen(quiz) {
    openQuiz(quiz);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -16 },
          animate: { opacity: 1, x: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-display font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4.5 h-4.5 text-white" }) }),
              "Task Manager"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              counts.todo + counts.in_progress,
              " active · ",
              counts.completed,
              " ",
              "completed"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.1 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "bg-gradient-primary text-white hover:opacity-90 shadow-accent gap-2",
              onClick: () => setAddOpen(true),
              "data-ocid": "tasks.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Add Task"
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.15 },
        className: "flex flex-col sm:flex-row gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search tasks or subjects…",
                className: "pl-9",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                "data-ocid": "tasks.search_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tabs,
            {
              value: filter,
              onValueChange: (v) => setFilter(v),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-ocid": "tasks.filter.tab", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "all", children: [
                  "All (",
                  counts.all,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "todo", children: [
                  "Todo (",
                  counts.todo,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "in_progress", children: [
                  "Active (",
                  counts.in_progress,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "completed", children: [
                  "Done (",
                  counts.completed,
                  ")"
                ] })
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "tasks.list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { hasSearch: !!search }, "empty") : filteredTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TaskCard,
      {
        task,
        index: i,
        onDeleteRequest: setDeleteTarget,
        onQuizOpen: handleQuizOpen
      },
      task.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddTaskDialog, { open: addOpen, onClose: () => setAddOpen(false) }),
    deleteTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        taskTitle: deleteTarget.title,
        onConfirm: () => {
          deleteTask(deleteTarget.id);
          ue.success("Task deleted");
          setDeleteTarget(null);
        },
        onCancel: () => setDeleteTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuizModal, {})
  ] });
}
export {
  TasksPage as default
};
