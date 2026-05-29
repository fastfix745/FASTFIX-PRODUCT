import { useRef, useState, useEffect, memo } from "react";
import { GripVertical } from "lucide-react";

interface Props {
  before: string;
  after: string;
  className?: string;
}

const BeforeAfterSlider = memo(({ before, after, className = "" }: Props) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  useEffect(() => {
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      setFromClientX(x);
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full aspect-video rounded-2xl overflow-hidden select-none bg-muted ${className}`}
    >
      <img src={after} alt="Depois" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before} alt="Antes"
          className="absolute inset-0 h-full object-cover"
          style={{ width: ref.current?.offsetWidth ?? 0, maxWidth: "none" }}
          draggable={false}
        />
      </div>
      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-foreground/70 text-background text-[10px] font-bold uppercase tracking-wider">Antes</div>
      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-success text-white text-[10px] font-bold uppercase tracking-wider">Depois</div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        onMouseDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}
        onTouchStart={(e) => { dragging.current = true; setFromClientX(e.touches[0].clientX); }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
          <GripVertical className="w-4 h-4 text-foreground" />
        </div>
      </div>
    </div>
  );
});

export default BeforeAfterSlider;
