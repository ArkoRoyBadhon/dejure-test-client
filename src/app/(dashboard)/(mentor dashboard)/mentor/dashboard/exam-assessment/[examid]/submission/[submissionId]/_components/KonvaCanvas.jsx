"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import { Button } from "@/components/ui/button";

const KonvaCanvas = forwardRef(
  (
    { imageElement, isEvaluated = false, onDrawingChange, isStudent = false },
    ref
  ) => {
    const [lines, setLines] = useState([]);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [konvaImage, setKonvaImage] = useState(null);

    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const isDrawing = useRef(false);

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      getDataURL: () => {
        if (!stageRef.current) return null;
        return stageRef.current.toDataURL({
          mimeType: "image/png",
          quality: 1,
        });
      },
      clearDrawing: () => setLines([]),
    }));

    const handleMouseDown = (e) => {
      if (isEvaluated || isStudent) return;

      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current || isEvaluated || isStudent) return;

      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines([...lines.slice(0, -1), lastLine]);
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const clearDrawing = () => setLines([]);

    // Notify parent when drawing changes
    useEffect(() => {
      if (onDrawingChange) {
        onDrawingChange(lines.length > 0);
      }
    }, [lines]);

    // Resize canvas based on container
    useEffect(() => {
      const resize = () => {
        if (containerRef.current) {
          const { offsetWidth, offsetHeight } = containerRef.current;
          setStageSize({ width: offsetWidth, height: offsetHeight });
        }
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    // Load background image for Konva
    useEffect(() => {
      if (!imageElement) return;

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageElement.src || imageElement;
      img.onload = () => {
        setKonvaImage(img);
      };
    }, [imageElement]);

    return (
      <div className="space-y-4">
        <div
          ref={containerRef}
          className="w-full h-[500px] border rounded-lg overflow-hidden relative"
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              {konvaImage && (
                <KonvaImage
                  image={konvaImage}
                  width={stageSize.width}
                  height={stageSize.height}
                />
              )}

              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation="source-over"
                />
              ))}
            </Layer>
          </Stage>
        </div>

        {!isEvaluated && (
          <div className="flex gap-2">
            {!isStudent && (
              <Button
                variant="outline"
                onClick={clearDrawing}
                disabled={lines.length === 0}
              >
                Clear Marking
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

KonvaCanvas.displayName = "KonvaCanvas";

export default KonvaCanvas;
