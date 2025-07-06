import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin shadow-lg" />
    </div>
  );
};

export default Loader;
