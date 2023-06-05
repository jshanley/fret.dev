import { Graphics as IGraphics } from '@pixi/graphics';
import { Graphics, Stage } from '@pixi/react';
import { useCallback, useMemo } from 'react';
import { range, scalePoint } from 'd3';

import colors from 'open-color';

const nutColor = colors.gray[2];
const fretColor = colors.gray[4];
const stringColor = colors.gray[5];

const padding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
const outerWidth = 1024;
const outerHeight = 192;
const width = outerWidth - padding.left - padding.right;
const height = outerHeight - padding.top - padding.bottom;

const displayPaddingX = 20;

function fretPosition(fret: number, scaleLength: number) {
  const pos = scaleLength - scaleLength / Math.pow(2, fret / 12);
  return pos;
}

function relativePositionBetweenNutAndBridge(fret: number) {
  return fretPosition(fret, 1);
}

function portionOfShownFretboard(fret: number, fretsShown: number) {
  const positionOfLastFret = relativePositionBetweenNutAndBridge(fretsShown);
  const positionOfFret = relativePositionBetweenNutAndBridge(fret);
  return positionOfFret / positionOfLastFret;
}

function pixelPosition(fret: number) {
  const w = width - 2 * displayPaddingX;
  return displayPaddingX + portionOfShownFretboard(fret, 24) * w;
}

export const Fretboard = () => {
  const frets = useMemo(() => {
    return range(0, 25);
  }, []);

  const strings = useMemo(() => {
    return range(1, 7).map((n) => n.toString());
  }, []);

  const stringScale = useMemo(() => {
    return scalePoint().domain(strings).range([0, height]).padding(0.5);
  }, [strings]);

  const drawFrets = useCallback(
    (g: IGraphics) => {
      g.clear();
      for (const fret of frets) {
        const lineStyle =
          fret === 0
            ? { width: 8, color: nutColor }
            : { width: 4, color: fretColor };

        const x = pixelPosition(fret);
        const y1 = 0;
        const y2 = height;
        g.lineStyle(lineStyle);
        g.moveTo(x, y1);
        g.lineTo(x, y2);
      }
    },
    [frets]
  );
  const drawStrings = useCallback(
    (g: IGraphics) => {
      g.clear();
      const lineStyle = { width: 2, color: stringColor };
      g.lineStyle(lineStyle);
      for (const string of strings) {
        const x1 = 0;
        const x2 = width;
        const y = stringScale(string)!;
        g.moveTo(x1, y);
        g.lineTo(x2, y);
      }
    },
    [strings, stringScale]
  );

  return (
    <div style={{ padding: 20 }}>
      <Stage
        width={outerWidth}
        height={outerHeight}
        options={{ backgroundColor: 0xffffff }}
      >
        <Graphics draw={drawFrets} />
        <Graphics draw={drawStrings} />
      </Stage>
    </div>
  );
};
