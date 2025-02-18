import React from "react";

const Grid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 max-w-sm mx-auto border border-gray-300">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-center w-20 h-20 border border-gray-500 bg-gray-100"
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default Grid;
