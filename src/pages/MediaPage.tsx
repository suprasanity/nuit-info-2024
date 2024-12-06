// File: src/pages/MediaPage.tsx
import React, { useState, useEffect } from 'react';
import { ApiService } from "../service/ApiService";
import '../style/MediaPage.css';
import ErrorBoundary from '../components/ErrorBoundary';

const apiService = new ApiService('https://race-for-water-api.yannjeanmaire.com');

export const MediaPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [, setSelectedFile] = useState<string | null>(null);

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

  useEffect(() => {
    fetchFileNames().then(r => r);
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
        fetchFileNames(); // Fetch file names after successful upload
      } catch (error) {
        console.error('File upload failed:', error);
        alert('File upload failed');
      }
    } else {
      alert('Please select a file before uploading.');
    }
  };

  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const renderMediaPlayer = (fileName: string) => {
    const fileExtension = fileName.split('.').pop();
    const fileUrl = 'https://race-for-water-api.yannjeanmaire.com/file_storage/' + fileName;

    if (fileExtension === 'mp4' || fileExtension === 'mov' || fileExtension === 'avi') {
      return (
          <video controls>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
      );
    } else if (fileExtension === 'mp3' || fileExtension === 'm4a') {
      return (
          <audio controls>
            <source src={fileUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
      );
    } else {
      return <p>Unsupported file type</p>;
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
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleFileClick(fileName)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{fileName}</h3>
                    {renderMediaPlayer(fileName)}
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