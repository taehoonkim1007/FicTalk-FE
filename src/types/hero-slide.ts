export interface HeroSlide {
  category: string;
  story: {
    id: string;
    title: string;
    seriesTitle: string | null;
    authorName: string;
    coverColor: string;
    coverImage: string | null;
  };
  character: {
    id: string;
    name: string;
    firstMessage: string | null;
  };
  slide: {
    marketingTitle: string;
    title: string;
    description: string;
    image: string | null;
  };
}
