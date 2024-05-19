import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DisplayGenre from './DisplayGenre';
import '../styles/MusicPlayerStyles.css';
import musicPlayerImage from '../images/player2.png';

const MusicPlayer = () => {
  const [file, setFile] = useState(null);
  const [showGenre, setShowGenre] = useState(false);
  const [predictedGenre, setPredictedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  let file_path = '';

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'audio/mp3' });

  const handlePredictGenre = async () => {
    file_path = file.path;
    setShowGenre(false);
    setPredictedGenre('');
    setLoading(true);

    const formData = new FormData();
    formData.append('audioFilePath', file_path);

    try {
      const response = await fetch('http://localhost:5000/predict-genre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioFilePath: file_path })
      });

      if (response.ok) {
        const data = await response.json();
        setPredictedGenre(data.predicted_genre);
        setShowGenre(true);
      } else {
        console.error('Failed to predict genre');
        toast.error('Failed to predict genre', { position: "top-center" });
      }
    } catch (error) {
      console.error('Error predicting genre:', error);
      toast.error('Error predicting genre', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
        
      <div {...getRootProps()} className="dropzone text-center">
        <input {...getInputProps()} />
        <button type="button" className="btn btn-warning btn-lg">
            Upload the Song <i className="fa-solid fa-upload"></i>
        </button>
        <p className="mb-0 fs-4 text-white">Drag 'n' drop an MP3 file here, or click to select one</p>
      </div>
      {file && (
        <div className="mt-5">
            
          <h4 className='text-white'>{file.name}</h4>
          <div className="mt-4">
            <button type="button" className="btn btn-warning btn-lg" onClick={handlePredictGenre}>
                Predict Genre <i className="fa-solid fa-music"></i>
            </button>
          </div>
          <div>
            {loading ? (
              <div className="loader mt-4"></div>
            ) : showGenre && (
              <DisplayGenre predictedGenre={predictedGenre} />
            )}
          </div>
          <div className="d-flex justify-content-center">
            <ReactPlayer 
                url={URL.createObjectURL(file)} 
                controls 
                config={{
                    file: {
                        attributes: {
                            poster: musicPlayerImage
                        }
                    }
                }}
                style={{ maxWidth: '50%', maxHeight: '50%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default MusicPlayer;