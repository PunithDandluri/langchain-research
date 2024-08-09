// Types.ts
export interface Availability {
  startDate: string;
  endDate: string;
}

export interface FormData {
  adTitle: string;
  description: string;
  adType: string;
  dimensions: string;
  audience: string;
  platforms: string[];
  location: string;
  pricingModel: string;
  price: string;
  minBudget: string;
  availability: Availability;
  pastPerformance: string;
  ctr: string;
  conversionRate: string;
}

export interface FormProps {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}
