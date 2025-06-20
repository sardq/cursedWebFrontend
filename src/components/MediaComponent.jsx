import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const MediaItem = ({ media, onDelete }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/media/resource/${media.id}`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        objectUrl = URL.createObjectURL(response.data);
        setMediaUrl(objectUrl);
      } catch (err) {
        setMediaUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [media.id]);

  if (loading) return <div className="m-2">Загрузка...</div>;

  return (
    <div className="media-item m-2 text-center">
      {mediaUrl ? (
        media.mimeType.includes('image') ? (
          <img src={mediaUrl} alt="" className="img-thumbnail" style={{ width: 200 }} />
        ) : media.mimeType.includes('video') ? (
          <video controls style={{ width: 200 }}>
            <source src={mediaUrl} type={media.mimeType} />
          </video>
        ) : (
          <div>Неизвестный формат</div>
        )
      ) : (
        <div>Ошибка загрузки</div>
      )}
      <button className="btn btn-sm btn-danger mt-2" onClick={() => onDelete(media.id)}>
        Удалить
      </button>
    </div>
  );
};

const MediaUploadComponent = forwardRef(({ examinationId, isModalOpen }, ref) => {
  const [mediaList, setMediaList] = useState([]);
  const [tempFiles, setTempFiles] = useState([]); 
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState([]);
  const [error, setError] = useState(null);

  const fetchMedia = useCallback(async () => {
    try {
      const response = await axios.get('/api/media', { params: { examinationId } });
      setMediaList(response.data || []);
    } catch {
      setError('Ошибка при загрузке медиа');
    }
  }, [examinationId]);

  useEffect(() => {
    if (examinationId && isModalOpen) fetchMedia();
    console.log("2");
  }, [examinationId, isModalOpen, fetchMedia]);

useEffect(() => {
  if (!isModalOpen) {
    tempFiles.forEach((f) => URL.revokeObjectURL(f.url));
    console.log("1");
    setTempFiles([]);
    setFilesToUpload([]);
    setMediaList([]);
    setDeletedMediaIds([]);
  }
}, [isModalOpen]);


  const handleMediaFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const previews = files.map((file, i) => {
      const tempId = `${file.name}-${i}-${Date.now()}`;
      return {
        tempId,
        url: URL.createObjectURL(file),
        type: file.type,
        file,
      };
    });

    setTempFiles((prev) => [...prev, ...previews]);
    setFilesToUpload((prev) => [
      ...prev,
      ...previews.map(({ tempId, file }) => ({ tempId, file })),
    ]);

    e.target.value = '';
  };

  const handleDeleteMedia = (mediaId) => {
    setDeletedMediaIds((prev) => [...prev, mediaId]);
    setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleDeleteTemp = (tempId) => {
    setTempFiles((prev) => prev.filter((f) => f.tempId !== tempId));
    setFilesToUpload((prev) => prev.filter((f) => f.tempId !== tempId));
  };

  useImperativeHandle(ref, () => ({
    
    handleSave: async () => {
      if (!examinationId) return;
      try {
        if (filesToUpload.length) {
          const formData = new FormData();
          filesToUpload.forEach(({ file }) => formData.append('files', file));
          formData.append('examinationId', examinationId);

          await axios.post('/api/media/load', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        for (const mediaId of deletedMediaIds) {
          await axios.delete(`/api/media/delete/${mediaId}`);
        }

        setTempFiles([]);
        setFilesToUpload([]);
        setDeletedMediaIds([]);
        await fetchMedia();
      } catch {
        setError('Ошибка при сохранении медиа');
      }
    },
    clearTemporaryMedia: () => {
    tempFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setTempFiles([]);
    setFilesToUpload([]);
    setDeletedMediaIds([]);
  }
  }));

  return (
    <div>
      <div className="form-group mb-3">
        <label>Загрузить фото/видео</label>
        <input
          type="file"
          className="form-control"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaFilesChange}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex flex-wrap media-grid">
        {tempFiles.map((file) => (
          <div key={file.tempId} className="media-item m-2 d-flex flex-column align-items-center">
            {file.type.includes('image') ? (
              <img src={file.url} alt="temp" className="img-thumbnail" style={{ width: 200 }} />
            ) : file.type.includes('video') ? (
              <video controls style={{ width: 200 }}>
                <source src={file.url} type={file.type} />
              </video>
            ) : (
              <div>Неизвестный тип</div>
            )}
            <button
              className="btn btn-sm btn-danger mt-2"
              onClick={() => handleDeleteTemp(file.tempId)}
            >
              Удалить
            </button>
          </div>
        ))}
        {mediaList.map((media) => (
          <MediaItem key={media.id} media={media} onDelete={handleDeleteMedia} />
        ))}
      </div>
    </div>
  );
});

export default MediaUploadComponent;
