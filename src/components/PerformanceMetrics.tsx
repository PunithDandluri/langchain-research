"use client";
import React from "react";
import { FormProps } from "../Types";
interface PerformanceMetricsProps extends FormProps {
  handleFocus: (
    e: React.FocusEvent<
      | HTMLInputElement
      | HTMLFormElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => Promise<void>;
}
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  formData,
  handleChange,
  handleFocus,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Past Performance Data:</span>
          <textarea
            name="pastPerformance"
            value={formData.pastPerformance}
            onChange={handleChange}
            onFocus={handleFocus}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">
            Expected Click-through Rate (CTR):
          </span>
          <input
            type="text"
            name="ctr"
            value={formData.ctr}
            onFocus={handleFocus}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Conversion Rate:</span>
          <input
            type="text"
            name="conversionRate"
            onFocus={handleFocus}
            value={formData.conversionRate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
