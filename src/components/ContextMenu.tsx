import React from "react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  position?: { top?: number; right?: number; left?: number; bottom?: number };
}

export default function ContextMenu({
  open,
  onClose,
  items,
  position = { right: 8, top: 33 },
}: ContextMenuProps) {
  if (!open) return null;

  return (
    <div
      className="absolute z-50 bg-white/90 shadow-lg rounded-md"
      style={{
        top: position.top,
        right: position.right,
        left: position.left,
        bottom: position.bottom,
        minWidth: 192,
      }}
      onMouseLeave={onClose}
    >
      <ul className="py-1 text-sm text-gray-700">
        {items.map(({ label, icon, onClick }, idx) => (
          <li
            key={idx}
            onClick={() => {
              onClick();
              onClose();
            }}
            className="flex items-center px-4 py-2 hover:opacity-70 cursor-pointer transition-opacity"
          >
            <span className="text-gray-500 mr-3">{icon}</span>
            <p>{label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
