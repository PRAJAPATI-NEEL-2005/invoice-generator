import React from "react";

function Alert({ alert }) {
  const typeClasses = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <>
      {alert && (
        <div
          className={`fixed top-[70px] right-5 z-[9999] min-w-[250px] max-w-[90%] rounded-lg px-5 py-3 text-sm font-medium border shadow-md transition-all duration-300 ${
            typeClasses[alert.type] || typeClasses.info
          }`}
          role="alert"
        >
          <strong className="capitalize">{alert.type}:</strong> {alert.message}
        </div>
      )}
    </>
  );
}

export default Alert;
