import React from "react";

// Small inline loading indicator, styled in index.css (.spinner).
function Spinner({ className = "" }) {
  return <span className={`spinner ${className}`} role="status" aria-label="Loading" />;
}

export default Spinner;
