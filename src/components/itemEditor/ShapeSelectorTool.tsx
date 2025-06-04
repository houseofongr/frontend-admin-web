import { PiSelectionPlusBold } from "react-icons/pi";
import DraggableItem from "../../features/house/editor/DraggableItem";

type ShapeSelectorProps = {
  addRect: () => void;
  addCircle: () => void;
  addEllipse: () => void;
};

export default function ShapeSelectorTool({ addRect, addCircle, addEllipse }: ShapeSelectorProps) {
  return (
    <DraggableItem _width={310} _height={130} zIndex={10} index={1} onPositionChange={() => {}} scale={1}>
      <div className="left-0 py-2 flex flex-col w-[320px]  rounded-md border-gray-900 bg-white ">
        <div className="flex justify-end items-center gap-2 mr-3 ">
          <PiSelectionPlusBold />
          <span className="text-sm">Shape Selector</span>
        </div>
        <div className="flex gap-4 justify-center py-3">
          <button className="p-3 bg-blue-400 text-xs" onClick={addRect}>
            Rectangle
          </button>
          <button className="bg-yellow-400 px-3 py-5 rounded-full text-xs" onClick={addCircle}>
            Circle
          </button>
          <button className="p-3 bg-amber-500 w-20 rounded-[80%_20%_80%_20%]  text-xs" onClick={addEllipse}>
            Ellipse
          </button>
        </div>
      </div>
    </DraggableItem>
  );
}
