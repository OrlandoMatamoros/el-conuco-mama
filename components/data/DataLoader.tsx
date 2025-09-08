import React, { useState } from 'react';

export default function DataLoader() {
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Cargar Datos CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {file && <p className="text-green-600">Archivo cargado: {file.name}</p>}
    </div>
  );
}
