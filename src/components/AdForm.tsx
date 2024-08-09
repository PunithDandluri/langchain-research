"use client";
import React, { useState } from "react";
import AdDetails from "./AdDetails";
import TargetingOptions from "./TargetingOptions";
import PricingAvailability from "./PricingAvailability";
import PerformanceMetrics from "./PerformanceMetrics";
import Modal from "./Modal"; // Import the Modal component
import { FormData } from "../Types";

type AdFormProps = {
  setMessage: React.Dispatch<React.SetStateAction<string[]>>;
  handleFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLFormElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => Promise<void>;
};

const AdForm: React.FC<AdFormProps> = ({
  setMessage,
  handleFocus,
}: {
  setMessage: React.Dispatch<React.SetStateAction<string[]>>;
  handleFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLFormElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<FormData>({
    adTitle: "",
    description: "",
    adType: "",
    dimensions: "",
    audience: "",
    platforms: [],
    location: "",
    pricingModel: "",
    price: "",
    minBudget: "",
    availability: {
      startDate: "",
      endDate: "",
    },
    pastPerformance: "",
    ctr: "",
    conversionRate: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "select-multiple" && e.target instanceof HTMLSelectElement) {
      const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: values,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true); // Open the modal on form submission
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
        <AdDetails
          formData={formData}
          handleChange={handleChange}
          handleFocus={handleFocus}
        />
        <TargetingOptions
          formData={formData}
          handleChange={handleChange}
          handleFocus={handleFocus}
        />
        <PricingAvailability
          formData={formData}
          handleChange={handleChange}
          handleFocus={handleFocus}
        />
        <PerformanceMetrics
          formData={formData}
          handleChange={handleChange}
          handleFocus={handleFocus}
        />
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
            Go Back
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
            Next
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
      />
    </>
  );
};

export default AdForm;
