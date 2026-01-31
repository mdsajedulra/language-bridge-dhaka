import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CloudinaryUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  accept?: 'image' | 'video' | 'all';
  maxSizeMB?: number;
  className?: string;
  label?: string;
  showUrlInput?: boolean;
}

export const CloudinaryUpload = ({
  value,
  onChange,
  folder = 'language-bridge',
  accept = 'image',
  maxSizeMB = 10,
  className,
  label,
  showUrlInput = true,
}: CloudinaryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = {
    image: 'image/jpeg,image/png,image/gif,image/webp',
    video: 'video/mp4,video/webm',
    all: 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm',
  };

  const handleUpload = useCallback(async (file: File) => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, {
        folder,
        onProgress: setProgress,
      });
      onChange(result.secure_url);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [folder, maxSizeMB, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const handleRemove = () => {
    onChange(null);
  };

  const isImage = value && (
    value.includes('/image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(value)
  );

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label>{label}</Label>}
      
      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          {isImage ? (
            <img
              src={value}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg border bg-muted"
            />
          ) : (
            <div className="h-32 w-32 flex items-center justify-center rounded-lg border bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            uploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
              <Progress value={progress} className="h-2 w-48 mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept === 'image' && 'JPG, PNG, GIF, WebP'}
                {accept === 'video' && 'MP4, WebM'}
                {accept === 'all' && 'Images & Videos'}
                {` (max ${maxSizeMB}MB)`}
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes[accept]}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload button when there's already a value */}
      {value && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Change
        </Button>
      )}

      {/* Or enter URL manually */}
      {showUrlInput && (
        <div className="pt-2 border-t">
          <Label className="text-xs text-muted-foreground">Or enter URL manually</Label>
          <Input
            className="mt-1"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="https://..."
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
};
