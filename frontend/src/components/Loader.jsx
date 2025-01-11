import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-l-slate-500 border-r-slate-500 border-black"></div>
    </div>
  );
}

export default Loader;
