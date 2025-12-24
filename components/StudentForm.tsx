
import React, { useState, useRef } from 'react';
import type { StudentDetails } from '../types';

interface StudentFormProps {
  onSubmit: (complaint: string, studentDetails: StudentDetails, image?: { base64: string, mimeType: string }) => Promise<void>;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });


export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [complaintText, setComplaintText] = useState('');
  const [studentDetails, setStudentDetails] = useState<StudentDetails>({ name: '', class: '', division: '', rollNo: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintText.trim() && !isLoading && isStudentDetailsFilled) {
      let imageData: { base64: string; mimeType: string; } | undefined = undefined;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        imageData = { base64, mimeType: imageFile.type };
      }
      onSubmit(complaintText.trim(), studentDetails, imageData);
    }
  };

  const placeholderText = `Please describe your problem or complaint in detail. For example:
- "The Wi-Fi in the library's second floor is not working."
- "The projector in classroom 3B is broken and my class is tomorrow."
- "There is a water leakage in the bathroom of room 201 in the boys' hostel."`;
  
  // FIX: Added 'typeof field === 'string'' to satisfy TypeScript compiler, as Object.values can return 'unknown[]'.
  const isStudentDetailsFilled = Object.values(studentDetails).every(field => typeof field === 'string' && field.trim() !== '');
  const isFormSubmittable = !isLoading && complaintText.trim() && isStudentDetailsFilled;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-brand-text-primary mb-2">Submit a Complaint</h2>
      <p className="text-center text-brand-text-secondary mb-6">Let us know what's wrong. Our AI will help route your issue to the right people.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-brand-text-secondary mb-2">Student Details</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" required value={studentDetails.name} onChange={handleDetailChange} className="block w-full text-sm bg-gray-800 border-gray-600 placeholder-gray-500 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-200" />
            <input type="text" name="rollNo" placeholder="Roll Number" required value={studentDetails.rollNo} onChange={handleDetailChange} className="block w-full text-sm bg-gray-800 border-gray-600 placeholder-gray-500 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-200" />
            <input type="text" name="class" placeholder="Class (e.g., SE, TE)" required value={studentDetails.class} onChange={handleDetailChange} className="block w-full text-sm bg-gray-800 border-gray-600 placeholder-gray-500 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-200" />
            <input type="text" name="division" placeholder="Division (e.g., A, B)" required value={studentDetails.division} onChange={handleDetailChange} className="block w-full text-sm bg-gray-800 border-gray-600 placeholder-gray-500 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-200" />
          </div>
        </div>
        
        <div>
          <label htmlFor="complaint" className="block text-sm font-medium text-brand-text-secondary mb-2">
            Your Complaint
          </label>
          <textarea
            id="complaint"
            rows={6}
            className="block w-full text-sm bg-gray-800 border-gray-600 placeholder-gray-500 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-200"
            placeholder={placeholderText}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
                Attach an Image (Optional)
            </label>
            {!imagePreview ? (
            <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-brand-primary transition-colors"
            >
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                        <p className="pl-1">Click to upload a file</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
            </div>
             ) : (
                <div className="mt-2 relative">
                    <img src={imagePreview} alt="Complaint preview" className="rounded-lg max-h-60 w-auto mx-auto" />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                        <span className="sr-only">Remove image</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
             )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormSubmittable}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Analyzing...
              </>
            ) : (
              'Submit & Analyze'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
