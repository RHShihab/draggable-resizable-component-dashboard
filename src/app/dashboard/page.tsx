'use client';

import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider, Layouts, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [compactType, setCompactType] = useState<'vertical' | 'horizontal' | null>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [layouts, setLayouts] = useState<Layouts>({ lg: generateLayout() });

  useEffect(() => {
    setMounted(true);
  }, []);

  function generateLayout(count = 5): Layout[] {
    return Array.from({ length: count }, (_, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (Math.floor(Math.random() * 6) * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
        static: Math.random() < 0.05,
      };
    });
  }

  // Capitalize helper
  function capitalize(str: string | null): string {
    if (!str) return 'No Compaction';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleNewLayout = () => {
    setLayouts({ lg: generateLayout() });
  };

  const handleCompactToggle = () => {
    setCompactType((prev) =>
      prev === 'horizontal' ? 'vertical' : prev === 'vertical' ? null : 'horizontal'
    );
  };

  const handleBreakpointChange = (bp: string) => {
    setCurrentBreakpoint(bp);
  };

  const handleLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  // Dynamically add a widget
  const handleAddWidget = () => {
    setLayouts((prevLayouts) => {
      const currentWidgets = prevLayouts.lg || [];
      const nextIndex = currentWidgets.length > 0 ? Math.max(...currentWidgets.map(w => Number(w.i))) + 1 : 0;
      const newWidget: Layout = {
        x: 0,
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 3,
        i: nextIndex.toString(),
        static: false,
      };
      return { lg: [...currentWidgets, newWidget] };
    });
  };

  // Dynamically remove last widget
  const handleRemoveWidget = () => {
    setLayouts((prevLayouts) => {
      const currentWidgets = prevLayouts.lg || [];
      if (currentWidgets.length === 0) return prevLayouts;
      const newWidgets = currentWidgets.slice(0, currentWidgets.length - 1);
      return { lg: newWidgets };
    });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-4 space-y-2">
        <div>
          Current Breakpoint: {currentBreakpoint} ({cols[currentBreakpoint]} columns)
        </div>
        <div>Compaction type: {capitalize(compactType)}</div>
        <div className="space-x-2 mt-2">
          <button onClick={handleNewLayout} className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition">
            Generate New Layout
          </button>
          <button onClick={handleCompactToggle} className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition">
            Change Compaction Type
          </button>
          <button onClick={handleAddWidget} className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition">
            Add Widget
          </button>
          <button onClick={handleRemoveWidget} className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition">
            Remove Widget
          </button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout bg-neutral-700"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
        rowHeight={30}
        cols={cols}
        breakpoints={breakpoints}
      >
        {layouts.lg?.map((l) => (
          <div
            key={l.i}
            className={`rounded-lg p-2 text-center border select-none ${
              l.static ? 'border-gray-500 bg-neutral-400' : 'border-neutral-700 bg-neutral-400'
            }`}
          >
            {l.static ? (
              <span title="Static item">🔒 Static - {l.i}</span>
            ) : (
              <span>Widget {l.i}</span>
            )}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
