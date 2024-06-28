import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ipcRenderer } from 'electron';

interface SupportFormData {
  title: string;
  description: string;
  evidence: File | null;
}

const SupportForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [evidence, setEvidence] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidence(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: SupportFormData = { title, description, evidence };
    ipcRenderer.send('submit-support-form', formData);

    ipcRenderer.once('support-form-submission-response', (event, response) => {
      if (response.success) {
        setSuccessMessage('Support request submitted successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to submit support request.');
        setSuccessMessage('');
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Support Form</h2>
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="evidence"
            className="block text-gray-700 font-bold mb-2"
          >
            Evidence
          </label>
          <input
            type="file"
            id="evidence"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupportForm;
