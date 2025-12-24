
import React, { useState } from 'react';
import type { AnalyzedComplaint, PriorityLevel } from '../types';

interface AdminDashboardProps {
  complaints: AnalyzedComplaint[];
}

const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  const colorClasses = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colorClasses[priority]}`}
    >
      {priority}
    </span>
  );
};

const ComplaintDetailModal: React.FC<{ complaint: AnalyzedComplaint | null; onClose: () => void; }> = ({ complaint, onClose }) => {
    if (!complaint) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-brand-surface text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-brand-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-brand-text-primary" id="modal-title">{complaint.category}</h3>
                                <div className="mt-4 border-b border-gray-700 pb-4">
                                    <h4 className="text-sm font-medium text-brand-text-primary mb-2">Student Details</h4>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <dt className="text-brand-text-secondary">Name:</dt>
                                        <dd className="text-brand-text-primary">{complaint.studentDetails.name}</dd>
                                        <dt className="text-brand-text-secondary">Roll No:</dt>
                                        <dd className="text-brand-text-primary">{complaint.studentDetails.rollNo}</dd>
                                        <dt className="text-brand-text-secondary">Class:</dt>
                                        <dd className="text-brand-text-primary">{complaint.studentDetails.class}</dd>
                                        <dt className="text-brand-text-secondary">Division:</dt>
                                        <dd className="text-brand-text-primary">{complaint.studentDetails.division}</dd>
                                    </dl>
                                </div>
                                <div className="mt-4 space-y-4">
                                    <h4 className="text-sm font-medium text-brand-text-primary">Complaint</h4>
                                    <p className="text-sm text-brand-text-secondary whitespace-pre-wrap">{complaint.originalText}</p>
                                    {complaint.imageUrl && (
                                        <div>
                                            <p className="text-sm font-medium text-brand-text-primary mb-2">Attached Image:</p>
                                            <img src={complaint.imageUrl} alt="Complaint attachment" className="rounded-lg w-full" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-600 bg-brand-surface px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ complaints }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<AnalyzedComplaint | null>(null);

  if (complaints.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-brand-text-primary">No complaints submitted yet</h3>
        <p className="mt-1 text-sm text-brand-text-secondary">Switch to the 'Submit Complaint' tab to add a new one.</p>
      </div>
    );
  }

  return (
    <>
      <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
      <div>
        <h2 className="text-2xl font-bold text-center text-brand-text-primary mb-6">Admin Dashboard</h2>
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-brand-text-primary sm:pl-6">Category</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-text-primary">Priority</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-text-primary">Department</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-text-primary">Submitted By</th>
                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-brand-text-primary">Attachment</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-text-primary hidden md:table-cell">Submitted</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-brand-surface">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-800/40 transition-colors duration-200">
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-brand-text-primary sm:w-auto sm:max-w-none sm:pl-6">
                    {complaint.category}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Student</dt>
                      <dd className="mt-1 truncate text-brand-text-secondary">{complaint.studentDetails.name}</dd>
                    </dl>
                  </td>
                  <td className="px-3 py-4 text-sm text-brand-text-secondary"><PriorityBadge priority={complaint.priority} /></td>
                  <td className="px-3 py-4 text-sm text-brand-text-secondary">{complaint.department}</td>
                  <td className="px-3 py-4 text-sm text-brand-text-secondary">{complaint.studentDetails.name}</td>
                  <td className="px-3 py-4 text-sm text-center text-brand-text-secondary">
                    {complaint.imageUrl && (
                        <svg className="h-5 w-5 text-gray-400 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 117.44 9.56l3.45-3.45a.75.75 0 111.061 1.06l-3.45 3.45a1.125 1.125 0 001.59 1.591l3.456-3.554a3 3 0 000-4.242z" clipRule="evenodd" />
                        </svg>
                    )}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-brand-text-secondary md:table-cell">{complaint.timestamp.toLocaleString()}</td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button onClick={() => setSelectedComplaint(complaint)} className="text-brand-primary hover:text-blue-400">
                        View<span className="sr-only">, {complaint.category}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
