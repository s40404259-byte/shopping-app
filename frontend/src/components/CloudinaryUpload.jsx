import { useState } from 'react';

export default function CloudinaryUpload({ onUploaded }) {
  const [busy, setBusy] = useState(false);

  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      alert('Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', uploadPreset);

    setBusy(true);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
    const data = await res.json();
    setBusy(false);
    if (data.secure_url) onUploaded(data.secure_url);
  };

  return <input type="file" accept="image/*" disabled={busy} onChange={onChange} />;
}
