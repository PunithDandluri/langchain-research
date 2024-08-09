"use client";
import React from "react";
import { FormProps } from "../Types";

interface AdDetailsProps extends FormProps {
  handleFocus: (
    e: React.FocusEvent<
      | HTMLInputElement
      | HTMLFormElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => Promise<void>;
}

const AdDetails: React.FC<AdDetailsProps> = ({ formData, handleChange, handleFocus }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Ad Details</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Ad Title:</span>
          <input
            type="text"
            name="adTitle"
            value={formData.adTitle}
            onChange={handleChange}
            onFocus={handleFocus}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Description:</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onFocus={handleFocus}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Ad Type:</span>
          <select
            name="adType"
            value={formData.adType}
            onChange={handleChange}
            onFocus={handleFocus}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50">
            <option value="banner">Banner</option>
            <option value="video">Video</option>
            <option value="native">Native</option>
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Dimensions:</span>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onFocus={handleFocus}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
      </div>
    </div>
  );
};

export default AdDetails;
