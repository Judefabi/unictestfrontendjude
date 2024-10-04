import React, { useState } from "react";

interface CommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (command: string) => void;
}

const CommandsModal: React.FC<CommandsModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [url, setUrl] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [maxTime, setMaxTime] = useState(300);
  const [filter, setFilter] = useState(true);
  const [store, setStore] = useState(true);

  if (!isOpen) return null;

  const handleInsert = () => {
    const command = `[include-url: ${url} max_execution_time:${maxTime} filter:${filter} store:${store}]`;
    onInsert(command);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg"
        style={{ position: "absolute", bottom: "100px" }}>
        <h2 className="text-xl font-bold mb-4">Insert Custom Command</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-2 border rounded mb-4"
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
              className="mr-2"
            />
            Advanced Options
          </label>
        </div>
        {advanced && (
          <div className="mb-4">
            <input
              type="number"
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              placeholder="Max Execution Time"
              className="w-full p-2 border rounded mb-2"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={filter}
                onChange={(e) => setFilter(e.target.checked)}
                className="mr-2"
              />
              Filter
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={store}
                onChange={(e) => setStore(e.target.checked)}
                className="mr-2"
              />
              Store
            </label>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-blue-500 text-white rounded">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandsModal;
