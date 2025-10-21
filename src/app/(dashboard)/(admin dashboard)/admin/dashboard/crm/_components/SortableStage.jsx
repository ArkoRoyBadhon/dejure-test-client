"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableStage({ id, title, count, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 p-4 rounded-lg border"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">{title}</h2>
        <span className="bg-gray-200 rounded-full px-2 py-1 text-xs">
          {count}
        </span>
      </div>
      <div {...attributes} {...listeners}>
        {children}
      </div>
    </div>
  );
}