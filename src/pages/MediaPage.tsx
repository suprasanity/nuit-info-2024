// File: src/pages/MediaPage.tsx
import React, { useState, useEffect } from 'react';
import { ApiService } from "../service/ApiService";
import '../style/MediaPage.css';
import ErrorBoundary from '../components/ErrorBoundary';

const apiService = new ApiService('http://localhost:8000');

export const MediaPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFileNames = async () => {
      try {
        const response = await apiService.get('/file_storage/all');
        if (response && Array.isArray(response.files)) {
          setFileNames(response.files);
        } else {
          console.error('Expected an array of file names');
        }
      } catch (error) {
        console.error('Failed to fetch file names:', error);
      }
    };

    fetchFileNames();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiService.post('/file_storage', formData);
        alert('File uploaded successfully');
      } catch (error) {
        console.error('File upload failed:', error);
        alert('File upload failed');
      }
    } else {
      alert('Please select a file before uploading.');
    }
  };

  return (
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-center mb-12 text-blue-900">
            Médiathèque
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fileNames.map((fileName, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{fileName}</h3>
                  </div>
                </div>
            ))}
          </div>

          <div className="mt-8">
            <input type="file" onChange={handleFileChange} />
            <button
                onClick={handleUpload}
                className="upload-button"
            >
              Upload File
            </button>
          </div>
        </div>
      </ErrorBoundary>
  );
};