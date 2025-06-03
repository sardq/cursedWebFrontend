import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MediaUploadComponent = ({ examinationId }) => {
  const [mediaList, setMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!examinationId) return;

    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/media`, {
          params: { examinationId }
        });
        setMediaList(response.data || []);
      } catch (err) {
        setError('Ошибка при загрузке медиа: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [examinationId]);

  const handleMediaFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('examinationId', examinationId);

      const response = await axios.post('/api/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMediaList(prev => [...prev, ...(response.data || [])]);
    } catch (err) {
      setError('Ошибка при загрузке файлов: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Удалить файл?')) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/media/${mediaId}`);
      setMediaList(prev => prev.filter(m => m.id !== mediaId));
    } catch (err) {
      setError('Ошибка при удалении медиа: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMediaItem = (media) => {
    const resourceUrl = `/api/media/${media.id}/resource`;
    const type = media.resource || '';
    const isImage = type.includes('image');
    const isVideo = type.includes('video');

    return (
      <div key={media.id} className="media-item m-2">
        {isImage && (
          <img
            src={resourceUrl}
            alt={`Media ${media.id}`}
            className="img-thumbnail"
            style={{ width: '200px', height: 'auto' }}
            onError={(e) => (e.target.src = '/placeholder.png')}
          />
        )}
        {isVideo && (
          <video
            controls
            className="video-thumbnail"
            style={{ width: '200px', height: 'auto' }}
          >
            <source src={resourceUrl} type={type} />
            Ваш браузер не поддерживает видео.
          </video>
        )}
        {!isImage && !isVideo && (
          <div className="text-muted">Неизвестный тип файла</div>
        )}
        <button
          className="btn btn-sm btn-danger mt-2"
          onClick={() => handleDeleteMedia(media.id)}
        >
          Удалить
        </button>
      </div>
    );
  };

  return (
    <div className="media-upload-container">
      <div className="form-group mb-3">
        <label>Загрузить фото/видео</label>
        <input
          type="file"
          className="form-control"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaFilesChange}
          disabled={isLoading}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <div className="text-center">Загрузка...</div>}

      <div className="d-flex flex-wrap media-grid">
        {mediaList.map(renderMediaItem)}
      </div>
    </div>
  );
};

export default MediaUploadComponent;
