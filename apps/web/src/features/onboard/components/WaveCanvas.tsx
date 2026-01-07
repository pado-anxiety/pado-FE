type WaveCanvasProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export function WaveCanvas({ canvasRef }: WaveCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
