// client/src/components/SheetEditor.jsx
import React, { useEffect, useState } from 'react';
import socket from '../socket';

const SheetEditor = ({ sheetId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Join the sheet room
    socket.emit("join-sheet", sheetId);

    // Listen for updates
    socket.on("receive-update", (newData) => {
      setContent(newData);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive-update");
    };
  }, [sheetId]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setContent(newVal);

    // Send update to others
    socket.emit("sheet-update", {
      sheetId,
      data: newVal,
    });
  };

  return (
    <textarea
      style={{ width: "100%", height: "300px" }}
      value={content}
      onChange={handleChange}
    />
  );
};

export default SheetEditor;
