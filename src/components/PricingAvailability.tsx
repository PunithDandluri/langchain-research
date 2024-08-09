"use client";
import React from "react";
import { FormProps } from "../Types";
interface PricingAvailabilityProps extends FormProps {
  handleFocus: (
    e: React.FocusEvent<
      | HTMLInputElement
      | HTMLFormElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => Promise<void>;
}
const PricingAvailability: React.FC<PricingAvailabilityProps> = ({
  formData,
  handleChange,
  handleFocus,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pricing & Availability</h3>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Pricing Model:</span>
          <select
            name="pricingModel"
            onFocus={handleFocus}
            value={formData.pricingModel}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50">
            <option value="cpm">CPM</option>
            <option value="cpc">CPC</option>
            <option value="cpa">CPA</option>
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Price (per 1000 impressions):</span>
          <input
            type="text"
            name="price"
            onFocus={handleFocus}
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Min Budget:</span>
          <input
            type="text"
            name="minBudget"
            onFocus={handleFocus}
            value={formData.minBudget}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </label>
        <div className="flex space-x-4">
          <label className="block w-1/2">
            <span className="text-gray-700">Start Date:</span>
            <input
              type="date"
              name="availability.startDate"
              value={formData.availability.startDate}
              onFocus={handleFocus}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </label>
          <label className="block w-1/2">
            <span className="text-gray-700">End Date:</span>
            <input
              type="date"
              name="availability.endDate"
              onFocus={handleFocus}
              value={formData.availability.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          </label>
        </div>
        <label className="block">
          <input
            type="checkbox"
            name="fullDateRange"
            onFocus={handleFocus}
            onChange={handleChange}
            className="mt-1 block h-4 w-4 text-green-500 border-gray-300 rounded focus:ring focus:ring-opacity-50"
          />
          <span className="text-gray-700 ml-2">
            Advertisers can choose full date range
          </span>
        </label>
      </div>
    </div>
  );
};

export default PricingAvailability;
