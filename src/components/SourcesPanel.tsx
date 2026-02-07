import { useState, useEffect } from 'react';
import { Upload, FileText, Image, Video, File, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface Source {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  file_size: number | null;
  created_at: string;
}

interface SourcesPanelProps {
  workspaceId: string;
}

export function SourcesPanel({ workspaceId }: SourcesPanelProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadSources();
    }
  }, [workspaceId]);

  const loadSources = async () => {
    const data = [
      {
        id: "1",
        filename: "example.pdf",
        file_type: "pdf",
        status: "indexed",
        file_size: 1234567,
        created_at: "2023-01-01",
      },
      {
        id: "2",
        filename: "photo.jpg",
        file_type: "image",
        status: "uploading",
        file_size: 2345678,
        created_at: "2023-02-01",
      },
    ];
    setSources(data);
    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const fileType = getFileType(file.type);

      const newSource = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        file_type: fileType,
        status: "indexed",
        file_size: file.size,
        created_at: new Date().toISOString(),
      };

      setSources((prev) => [newSource, ...prev]);
    }
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/pdf") return "pdf";
    return "text";
  };

  const deleteSource = async (sourceId: string) => {
    setSources((prev) => prev.filter((source) => source.id !== sourceId));
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "indexed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "uploading":
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sources
        </h2>
      </div>

      <div className="p-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop files here, or
          </p>
          <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept=".pdf,image/*,video/*,.txt,.doc,.docx"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            PDF, Images, Videos, Text
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading sources...
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="text-sm">No sources uploaded yet.</p>
            <p className="text-sm mt-2">Upload files to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {sources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400">
                    {getFileIcon(source.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {source.filename}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(source.status)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {source.status}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatFileSize(source.file_size)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSource(source.id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
