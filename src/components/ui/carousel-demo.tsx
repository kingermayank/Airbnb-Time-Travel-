import { Carousel, type CarouselSlide } from '@/components/ui/carousel';

const slideData: CarouselSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=2000&auto=format&fit=crop',
    alt: 'Mystic Mountains',
    layoutId: 'demo-slide-0',
  },
  {
    src: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Urban Dreams',
    layoutId: 'demo-slide-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Neon Nights',
    layoutId: 'demo-slide-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Desert Whispers',
    layoutId: 'demo-slide-3',
  },
];

export function CarouselDemo() {
  return (
    <div className="relative w-full py-10">
      <Carousel slides={slideData} />
    </div>
  );
}
