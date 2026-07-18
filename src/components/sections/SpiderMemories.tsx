import React from 'react';

// Import all 10 existing images from gdg-last-glimpses
import img1 from '../../assets/images/gdg-last-glimpses/image1.jpg';
import img2 from '../../assets/images/gdg-last-glimpses/image2.jpg';
import img3 from '../../assets/images/gdg-last-glimpses/image3.jpg';
import img4 from '../../assets/images/gdg-last-glimpses/image4.jpg';
import img5 from '../../assets/images/gdg-last-glimpses/image5.jpg';
import img6 from '../../assets/images/gdg-last-glimpses/image6.jpg';
import img7 from '../../assets/images/gdg-last-glimpses/image7.jpg';
import img8 from '../../assets/images/gdg-last-glimpses/image8.jpg';
import img9 from '../../assets/images/gdg-last-glimpses/image9.jpg';

interface GalleryItem {
  src: string;
  title: string;
}

export const SpiderMemories: React.FC = () => {
  const GALLERY_ITEMS: GalleryItem[] = [
    { src: img1, title: "GDG Orientation Day" },
    { src: img2, title: "Registration Dashboard Setup" },
    { src: img3, title: "Arena Setup & Gaming Showdown" },
    { src: img4, title: "Interactive Tech Keynote" },
    { src: img5, title: "GDG Recruitment Portal Launch" },
    { src: img6, title: "Code Jam & Debugging Session" },
    { src: img7, title: "Developer Keynote Speeches" },
    { src: img8, title: "GDG Project Pitching Round" },
    { src: img9, title: "Developer Interview & Review" }
  ];

  return (
    <section
      id="spider-memories"
      className="relative w-full bg-[#020202] py-20 px-6 sm:px-12 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header Block */}
        <div className="text-center space-y-2">
          <h2 className="title-spiderman text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-shadow-glow">
            SPIDEY MEMORIES
          </h2>
        </div>

        {/* Talva-Inspired Symmetrical Widescreen Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`group relative w-full aspect-[16/9] overflow-hidden bg-zinc-950 border border-zinc-900/35 hover:border-zinc-800 transition-colors duration-300 cursor-pointer ${idx === 8 ? 'hidden sm:block' : ''}`}
            >
              {/* Image element with lazy loading and hover scale */}
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-102 transform-gpu"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
