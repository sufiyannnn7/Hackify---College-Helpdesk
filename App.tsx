
import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudentForm } from './components/StudentForm';
import { AdminDashboard } from './components/AdminDashboard';
import { analyzeComplaint } from './services/geminiService';
import type { AnalyzedComplaint, PriorityLevel, StudentDetails } from './types';
import { Toaster, toast } from 'react-hot-toast';

type View = 'student' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('student');
  const [complaints, setComplaints] = useState<AnalyzedComplaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleComplaintSubmit = async (
    complaintText: string,
    studentDetails: StudentDetails,
    image?: { base64: string; mimeType: string }
  ) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeComplaint(complaintText, studentDetails, image);
      const newComplaint: AnalyzedComplaint = {
        id: new Date().toISOString(),
        originalText: complaintText,
        ...analysis,
        timestamp: new Date(),
        imageUrl: image ? `data:${image.mimeType};base64,${image.base64}` : undefined,
        studentDetails,
      };
      setComplaints(prev => [newComplaint, ...prev]);
      toast.success('Complaint submitted and analyzed successfully!');
      setCurrentView('admin');
    } catch (error) {
      console.error('Error analyzing complaint:', error);
      toast.error('Failed to analyze complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
          style: {
              background: '#333',
              color: '#fff',
          },
      }} />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-brand-surface rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex justify-center mb-6 md:mb-8 border-b border-gray-700 pb-4">
            <div className="relative flex p-1 bg-gray-800 rounded-full">
              <button
                onClick={() => setCurrentView('student')}
                className={`relative z-10 w-32 md:w-40 py-2.5 text-sm font-medium leading-5 rounded-full focus:outline-none transition-colors duration-300 ${
                  currentView === 'student' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Submit Complaint
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`relative z-10 w-32 md:w-40 py-2.5 text-sm font-medium leading-5 rounded-full focus:outline-none transition-colors duration-300 ${
                  currentView === 'admin' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin Dashboard
              </button>
              <div
                className="absolute top-1 h-10 w-32 md:w-40 bg-brand-primary rounded-full transition-transform duration-300 ease-in-out"
                style={{
                  transform: currentView === 'student' ? 'translateX(0)' : 'translateX(100%)',
                }}
              ></div>
            </div>
          </div>

          <div>
            {currentView === 'student' ? (
              <StudentForm onSubmit={handleComplaintSubmit} isLoading={isLoading} />
            ) : (
              <AdminDashboard complaints={complaints} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
