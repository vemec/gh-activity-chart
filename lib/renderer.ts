import { ContributionData } from './github';
import { generateSVG, SVGOptions } from './svg-renderer';
import sharp from 'sharp';

export interface RenderOptions extends SVGOptions {
  format?: 'svg' | 'png';
}

export async function renderChart(data: ContributionData, options: RenderOptions): Promise<Buffer | string> {
  const {
    format = 'svg',
  } = options;

  const svg = generateSVG(data, options);

  if (format === 'png') {
    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  return svg;
}
