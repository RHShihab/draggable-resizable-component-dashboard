"use client";

import { useState, useCallback } from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const toggleButtonWidget = () => (
  <div className="text-green-400">Toggle Button</div>
);
const pushButtonWidget = () => (
  <div className="text-yellow-400">Push Button</div>
);
const sliderWidget = () => <div className="text-pink-400">Slider</div>;

const widgetMap = {
  toggleButton: toggleButtonWidget,
  pushButton: pushButtonWidget,
  slider: sliderWidget,
};

type Item = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "toggleButton" | "pushButton" | "slider"; // Extendable component types
};

const defaultSizes: Record<Item["type"], { w: number; h: number }> = {
  toggleButton: { w: 2, h: 2 },
  pushButton: { w: 4, h: 4 },
  slider: { w: 4, h: 2 },
};

export default function DashboardPage() {
  const [layoutItems, setLayoutItems] = useState<Item[]>([]);
  const [counter, setCounter] = useState(0);
  const [draggingType, setDraggingType] = useState<Item["type"] | null>(null);
  const droppingItem =
    draggingType && defaultSizes[draggingType]
      ? {
          i: "__dropping-ghost__",
          w: defaultSizes[draggingType].w,
          h: defaultSizes[draggingType].h,
        }
      : { i: "__dropping-ghost__", w: 2, h: 2 }; // fallback

  const handleLayoutChange = (layout: Layout[]) => {
    setLayoutItems(
      layout.map(({ i, x, y, w, h, type }) => ({ i, x, y, w, h, type }))
    );
  };

  // Add item on drop
  const handleDrop = useCallback(
    (_: any, layoutItem: Layout, e: DragEvent) => {
      const type =
        (e?.dataTransfer?.getData("componentType") as Item["type"]) ||
        "toggleButton";

      const size = defaultSizes[type] || { w: 2, h: 2 }; // fallback

      const newItem: Item = {
        i: `item-${counter}`,
        x: layoutItem.x,
        y: layoutItem.y,
        w: size.w,
        h: size.h,
        type,
      };

      setLayoutItems((prev) => [...prev, newItem]);
      setCounter((c) => c + 1);
      setDraggingType(null);
    },
    [counter]
  );

  // Item Update
  const handleItemUpdate = (
    _layout: Layout[],
    _oldItem: Layout,
    newItem: Layout
  ) => {
    setLayoutItems((prev) =>
      prev.map((item) =>
        item.i === newItem.i
          ? { ...item, x: newItem.x, y: newItem.y, w: newItem.w, h: newItem.h }
          : item
      )
    );
  };

  // Remove item by id
  const removeItem = (id: string) => {
    setLayoutItems((prev) => prev.filter((item) => item.i !== id));
  };

  const handleDragStart = (e: React.DragEvent, type: Item["type"]) => {
    e.dataTransfer.setData("componentType", type);
    setDraggingType(type);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Open IoT Dashboard</h1>

      {/* Component List */}
      <div className="flex space-x-4 mb-4">
        <div
          className="bg-zinc-700 p-4 rounded cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, "toggleButton")}
        >
          <span>Toggle Button</span>
        </div>

        <div
          className="bg-zinc-700 p-4 rounded cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, "pushButton")}
        >
          <span>Push Button</span>
        </div>

        <div
          className="bg-zinc-700 p-4 rounded cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, "slider")}
        >
          <span>Slider</span>
        </div>
      </div>

      {/* Dashboard Layout */}
      <ResponsiveGridLayout
        className="layout bg-blue-900 min-h-screen"
        layouts={{ lg: layoutItems }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        droppingItem={droppingItem}
        rowHeight={60}
        isDroppable
        compactType={null}
        preventCollision
        onDrop={handleDrop}
        onDragStop={handleItemUpdate}
        onResizeStop={handleItemUpdate}
        draggableHandle=".drag-handle" // 👈 Only elements with this class are draggable
      >
        {layoutItems.map((item) => {
          const Component = widgetMap[item.type] || (() => <div>Unknown</div>);
          return (
            <div
              key={item.i}
              className="bg-zinc-800 rounded-xl p-2 shadow-lg overflow-hidden"
            >
              <div className="flex justify-between items-center text-white cursor-move">
                <div className="drag-handle flex-1/2">{item.i}</div>
                <button
                  onClick={() => removeItem(item.i)}
                  className="text-red-400 hover:text-red-600 text-xl font-bold"
                >
                  ✖
                </button>
              </div>
              <div className="mt-2">
                <Component />
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
