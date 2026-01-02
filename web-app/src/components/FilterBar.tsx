"use client";

import { Search, Filter, X } from "lucide-react";
import { Priority, Status } from "@/types";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onPriorityFilter: (priority: Priority | "ALL") => void;
  onStatusFilter: (status: Status | "ALL") => void;
}

export function FilterBar({
  onSearch,
  onPriorityFilter,
  onStatusFilter,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-sm transition-all">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex w-full md:w-auto items-center gap-3">
        <div className="flex-1 md:w-40 relative group">
          <select
            onChange={(e) => onPriorityFilter(e.target.value as any)}
            className="w-full appearance-none pl-3 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value={Priority.High}>High Priority</option>
            <option value={Priority.Medium}>Medium Priority</option>
            <option value={Priority.Low}>Low Priority</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-gray-500" />
        </div>

        <div className="flex-1 md:w-40 relative group">
          <select
            onChange={(e) => onStatusFilter(e.target.value as any)}
            className="w-full appearance-none pl-3 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value={Status.Pending}>Pending</option>
            <option value={Status.InProgress}>In Progress</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-gray-500" />
        </div>
      </div>
    </div>
  );
}
