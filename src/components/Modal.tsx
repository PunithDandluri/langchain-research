import { FormData } from "@/Types";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Ad Form Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Ad Title:</strong> {formData.adTitle}
          </p>
          <p>
            <strong>Description:</strong> {formData.description}
          </p>
          <p>
            <strong>Ad Type:</strong> {formData.adType}
          </p>
          <p>
            <strong>Dimensions:</strong> {formData.dimensions}
          </p>
          <p>
            <strong>Audience:</strong> {formData.audience}
          </p>
          <p>
            <strong>Platforms:</strong> {formData.platforms.join(", ")}
          </p>
          <p>
            <strong>Location:</strong> {formData.location}
          </p>
          <p>
            <strong>Pricing Model:</strong> {formData.pricingModel}
          </p>
          <p>
            <strong>Price:</strong> {formData.price}
          </p>
          <p>
            <strong>Min Budget:</strong> {formData.minBudget}
          </p>
          <p>
            <strong>Availability:</strong> {formData.availability.startDate} -{" "}
            {formData.availability.endDate}
          </p>
          <p>
            <strong>Past Performance:</strong> {formData.pastPerformance}
          </p>
          <p>
            <strong>CTR:</strong> {formData.ctr}
          </p>
          <p>
            <strong>Conversion Rate:</strong> {formData.conversionRate}
          </p>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
