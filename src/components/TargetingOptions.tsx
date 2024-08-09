"use client";
import React from "react";
import { FormProps } from "../Types";
interface TargetingOptionsProps extends FormProps {
  handleFocus: (
    e: React.FocusEvent<
      | HTMLInputElement
      | HTMLFormElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => Promise<void>;
}
const TargetingOptions: React.FC<TargetingOptionsProps> = ({
  formData,
  handleChange,
  handleFocus,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Targeting Options</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Audience Demographics:</span>
          <input
            type="text"
            onFocus={handleFocus}
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Platforms:</span>
          <select
            name="platforms"
            onFocus={handleFocus}
            multiple={true}
            value={formData.platforms}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50">
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="app">App</option>
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Geographic Targeting:</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onFocus={handleFocus}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
      </div>
    </div>
  );
};

export default TargetingOptions;
