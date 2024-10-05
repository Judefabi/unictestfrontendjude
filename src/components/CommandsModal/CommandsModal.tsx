import React, { useState } from "react";
import { X } from "lucide-react";
import { FiLink } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [maxTime, setMaxTime] = useState(300);
  const [filter, setFilter] = useState(true);
  const [store, setStore] = useState(true);

  if (!isOpen) return null;

  // this function handles inserting the comamnd to into teh prompt from teh commands modal and it takes a default filter and maxtime value but with sue state, users can change these values
  const handleInsert = () => {
    const command = `[include-url: ${url} max_execution_time:${maxTime} filter:${filter} store:${store}]`;
    onInsert(command);
    onClose();
  };

  return (
    <div className="bg-card text-card-foreground p-4 rounded-lg absolute left-5 bottom-40 z-50 w-[543px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Commands</h2>
        <X
          size={18}
          className="cursor-pointer font-semibold"
          onClick={onClose}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-background p-5 rounded-md">
          <div className="flex gap-x-1">
            <BiWorld />
            <span className="text-label-medium text-foreground font-semibold">
              WEB SEARCH
            </span>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Term"
              className="w-full bg-background text-muted-foreground text-[15px]"
            />
            <div className="space-x-2 flex items-center">
              <button className="text-label-large bg-background border border-muted-foreground text-foreground p-2 rounded-lg">
                Advanced
              </button>
              <button className="text-label-large bg-card text-card-foreground p-2 rounded-lg">
                Insert
              </button>
            </div>
          </div>
        </div>

        <div className="bg-background p-5 rounded-md">
          <div className="flex gap-x-1">
            <FiLink />
            <span className="text-label-medium text-foreground font-semibold">
              INCLUDE URL
            </span>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full bg-background text-muted-foreground text-[15px]"
            />
            <div className="space-x-2 flex items-center">
              <button
                className="text-label-large bg-background border border-muted-foreground text-foreground p-2 rounded-lg"
                onClick={() => setAdvanced(!advanced)}>
                Advanced
              </button>
              <button
                onClick={handleInsert}
                className="text-label-large bg-card text-card-foreground p-2 rounded-lg"
                disabled={!url.trim()}>
                Insert
              </button>
            </div>
          </div>

          {/* tese advanced options are shown if the user clicks on advances but otherwise they are hidden by default */}
          {advanced && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  Max Execution Time
                </label>
                <input
                  type="number"
                  value={maxTime}
                  onChange={(e) => setMaxTime(Number(e.target.value))}
                  className="w-full bg-background text-muted-foreground text-[15px] mt-1 p-2 rounded border border-muted-foreground"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="filter"
                  checked={filter}
                  onChange={(e) => setFilter(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="filter"
                  className="text-sm text-muted-foreground">
                  Filter
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="store"
                  checked={store}
                  onChange={(e) => setStore(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="store"
                  className="text-sm text-muted-foreground">
                  Store
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandsModal;
