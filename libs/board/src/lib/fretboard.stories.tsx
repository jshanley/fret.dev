import type { Meta } from '@storybook/react';
import { Fretboard } from './fretboard';

const Story: Meta<typeof Fretboard> = {
  component: Fretboard,
  title: 'Fretboard',
};
export default Story;

export const Primary = {
  args: {},
};
