import React, { useState } from 'react';
import '../Styles/dragdrop.css';

const DragDropFiles = () => {
    const [files, setFiles] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault(); // Mencegah browser default behavior
    };

    const handleDrop = (e) => {
        e.preventDefault();
        let newFiles = Array.from(e.dataTransfer.files);
        setFiles(currentFiles => [...currentFiles, ...newFiles]);
    };

    const handleFileChange = (e) => {
        let newFiles = Array.from(e.target.files);
        setFiles(currentFiles => [...currentFiles, ...newFiles]);
    };

    return (
        <div className="upload-container">
            <div className="upload-header">Upload Your Files</div>
            <div 
                className="drop-area" 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}>
                Drag files here or click to upload
                <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="file-input" 
                />
            </div>
            <div className="file-display-area">
                {files.map((file, index) => (
                    <div key={index} className="file-item">
                        {file.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DragDropFiles;
