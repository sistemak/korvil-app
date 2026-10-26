import React, { useState, useRef } from 'react';
import { Video, Upload, Settings, Play, Pause, RotateCcw, RotateCw } from 'lucide-react';

const VideoEditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setUrl(URL.createObjectURL(selected));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const rotateLeft = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.style.transform;
    const angle = current.match(/rotate\((\d+)deg\)/)?.[1] ?? '0';
    const newAngle = (parseInt(angle) - 90) % 360;
    videoRef.current.style.transform = `rotate(${newAngle}deg)`;
  };

  const rotateRight = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.style.transform;
    const angle = current.match(/rotate\((\d+)deg\)/)?.[1] ?? '0';
    const newAngle = (parseInt(angle) + 90) % 360;
    videoRef.current.style.transform = `rotate(${newAngle}deg)`;
  };

  return (
    <div className="p-4 bg-zinc-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><Video /> Editor de Vídeos</h1>
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded">
          <Upload /> Carregar vídeo
          <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      {url && (
        <div className="mb-4">
          <video ref={videoRef} src={url} controls className="w-full max-h-96 rounded border border-cyan-500" />
        </div>
      )}
      {file && (
        <div className="flex gap-2">
          <button onClick={togglePlay} className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button onClick={rotateLeft} className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded"><RotateCcw /></button>
          <button onClick={rotateRight} className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded"><RotateCw /></button>
        </div>
      )}
      <div className="mt-6">
        <p className="text-sm text-cyan-400">Evolua a versão a cada 1 hora. Use a API de backend para salvar alterações.</p>
      </div>
    </div>
  );
};

export default VideoEditor;
