import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ZoomIn, ZoomOut, RotateCw, Check, X, Shield, Move } from 'lucide-react';
import { playSound } from '../../utils/sound';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  soundEnabled?: boolean;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  soundEnabled = true
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset transform state when a new image source is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile / Android (drag & pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    } else if (e.touches.length === 2) {
      // 2-finger pinch
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
      setInitialZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && initialDistance !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialDistance;
      const nextZoom = Math.min(Math.max(initialZoom * ratio, 0.8), 3.5);
      setZoom(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialDistance(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    playSound('click', soundEnabled);
    setRotation(prev => (prev + 90) % 360);
  };

  // Zoom slider helper
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  // Generate cropped image on 512x512 Canvas
  const handleConfirmCrop = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const targetSize = 512;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Enable high-quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear background
      ctx.fillStyle = '#090D18';
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Measure visible viewport
      const containerRect = containerRef.current.getBoundingClientRect();
      const circleDiameter = Math.min(containerRect.width, containerRect.height) * 0.78;
      const scaleFactor = targetSize / circleDiameter;

      ctx.save();
      // Move origin to center of output canvas
      ctx.translate(targetSize / 2, targetSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Account for pan and zoom relative to center
      const drawX = position.x * scaleFactor;
      const drawY = position.y * scaleFactor;

      const img = imageRef.current;
      // Dimensions of the image element as displayed at scale 1
      const displayedWidth = img.width * zoom * scaleFactor;
      const displayedHeight = img.height * zoom * scaleFactor;

      ctx.drawImage(
        img,
        -displayedWidth / 2 + drawX,
        -displayedHeight / 2 + drawY,
        displayedWidth,
        displayedHeight
      );

      ctx.restore();

      // Export as compact, high-quality JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      playSound('achievement', soundEnabled);
      onCropComplete(compressedDataUrl);
    } catch (err) {
      console.error('Failed to crop and compress profile photo', err);
    }
  }, [position, zoom, rotation, soundEnabled, onCropComplete]);

  if (!isOpen) return null;

  return (
    <div
      id="image-crop-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        id="image-crop-modal-container"
        className="relative w-full max-w-md bg-[#0b1220] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,229,255,0.12)] overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Modal Tactical Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#0e172a]/70">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
                Crop System Identity
              </h3>
              <p className="text-[10px] text-cyan-400/80 font-mono">
                Circular Avatar Calibrator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-cyan-500/10 transition-all cursor-pointer"
            aria-label="Close Crop Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Viewport Area */}
        <div className="relative p-4 flex flex-col items-center justify-center bg-[#070b14]">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.3)] cursor-grab active:cursor-grabbing flex items-center justify-center bg-[#090D18]"
          >
            {/* The Raw Source Image with Dynamic Transform */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Target"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.05s ease-out'
              }}
              className="max-w-none max-h-none pointer-events-none select-none"
            />

            {/* Tactical Circular Reticle & Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 rounded-full">
              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/40" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/40" />
              </div>

              {/* Concentric Guide Ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/20" />

              {/* Tactical Corner Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            </div>

            {/* Drag & Pinch Tip Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/75 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 pointer-events-none flex items-center gap-1.5 shadow-md">
              <Move className="w-2.5 h-2.5" />
              <span>Drag to reposition • Pinch to zoom</span>
            </div>
          </div>

          {/* Coordinates & Natural Dimensions Info */}
          <div className="mt-2.5 flex items-center justify-between w-full max-w-xs text-[9px] font-mono text-zinc-500">
            <span>RES: 512×512 HD</span>
            <span>ZOOM: {Math.round(zoom * 100)}%</span>
            <span>ROT: {rotation}°</span>
          </div>
        </div>

        {/* Tactical Controls (Zoom Slider & Rotation) */}
        <div className="px-5 py-3.5 space-y-3 bg-[#0d1527] border-t border-cyan-500/15">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input
              type="range"
              min="0.8"
              max="3.5"
              step="0.05"
              value={zoom}
              onChange={handleZoomChange}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <ZoomIn className="w-3.5 h-3.5 text-zinc-400 shrink-0" />

            <button
              onClick={handleRotate}
              title="Rotate 90° Clockwise"
              className="p-2 rounded-xl bg-[#111c33] border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer ml-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-5 py-4 border-t border-cyan-500/20 bg-[#0e172a] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-700/60 text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.35)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Identity</span>
          </button>
        </div>
      </div>
    </div>
  );
};
