import React from 'react';

const MediaViewer = ({ media }) => {
  
  const baseMediaUrl = "http://localhost:8080/api/media/resource"; 

  if (!media || media.length === 0) return <p>Нет прикреплённых файлов</p>;

  return (
    <div className="media-viewer">
      {media.map(file => {
        const ext = file.filename.split('.').pop().toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
        const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);

       const fileUrl = `${baseMediaUrl}/${file.id}?t=${Date.now()}`;
        console.log(fileUrl);
        return (
          <div key={file.id} className="mb-3">
            <p>{file.filename}</p>
            {isImage && <img src={fileUrl} alt={file.filename}  style={{ width: '200px', height: 'auto' }} className="img-fluid" />}
            {isVideo && (
              <video controls className="w-100">
                <source src={fileUrl} type={file.mimeType}  style={{
    width: '200px',
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'contain'
  }}/>
                Ваш браузер не поддерживает видео.
              </video>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MediaViewer;
