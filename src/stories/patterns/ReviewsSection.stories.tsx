import type { Meta, StoryObj } from '@storybook/react';
import { ReviewsSection } from '@/design-system/patterns';

const meta = {
  title: 'Patterns/ReviewsSection',
  component: ReviewsSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reviews section: title (★ rating · N reviews), score bars, review cards grid, "Show all N reviews" (Button secondary).',
      },
    },
  },
} satisfies Meta<typeof ReviewsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const ratingCategories = [
  { name: 'Stability', score: 5 },
  { name: 'Communication', score: 5 },
  { name: 'Check-in', score: 5 },
  { name: 'Accuracy', score: 5 },
  { name: 'Location', score: 4.9 },
  { name: 'Value', score: 4.7 },
];

const reviews = [
  {
    reviewerName: 'Jose',
    bookingContext: 'Booked from December 2021 · New York',
    snippet: 'Incredible experience. The pod was exactly as described and the view of Mars from the window was unforgettable.',
  },
  {
    reviewerName: 'Luke',
    bookingContext: 'Booked from January 2022 · London',
    snippet: 'Best trip of my life. Would definitely come back.',
  },
  {
    reviewerName: 'Shayne',
    bookingContext: 'Booked from February 2022 · Tokyo',
    snippet: 'The host was very responsive. The decontamination process was smooth.',
  },
  {
    reviewerName: 'Josh',
    bookingContext: 'Booked from March 2022 · Sydney',
    snippet: 'Clean, comfortable, and out of this world. Literally.',
  },
];

export const Default: Story = {
  args: {
    overallRating: 4.8,
    totalReviews: 78,
    ratingCategories,
    reviews,
    initialReviewsCount: 4,
  },
};
