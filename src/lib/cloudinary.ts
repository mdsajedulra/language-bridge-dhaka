// Cloudinary configuration and upload utility
const CLOUD_NAME = 'dw9jqevhl';
const UPLOAD_PRESET = 'language_bridge_upload';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface UploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
}

export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  const { folder = 'language-bridge', onProgress } = options;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Supported: JPG, PNG, GIF, WebP, MP4, WebM');
  }

  // Validate file size (max 10MB for images, 100MB for videos)
  const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    throw new Error(`File size exceeds ${maxMB}MB limit`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response as CloudinaryUploadResult);
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
};

export const getCloudinaryUrl = (publicId: string, options?: { width?: number; height?: number; crop?: string }) => {
  let transformation = '';
  if (options) {
    const parts = [];
    if (options.width) parts.push(`w_${options.width}`);
    if (options.height) parts.push(`h_${options.height}`);
    if (options.crop) parts.push(`c_${options.crop}`);
    if (parts.length > 0) transformation = parts.join(',') + '/';
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformation}${publicId}`;
};
