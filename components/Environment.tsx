'use client';

import { useState } from 'react';
import { EnvironmentImage } from '@/types';

interface EnvironmentProps {
  images: EnvironmentImage[];
}

export default function Environment({ images }: EnvironmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section id="environment" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">公司环境</h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].description}
              className="w-full h-80 md:h-96 object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="text-center mt-6">
            <p className="text-lg text-gray-600">{images[currentIndex].description}</p>
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-secondary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                index === currentIndex ? 'ring-4 ring-secondary' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.description}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
