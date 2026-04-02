// src/components/RevealOnScroll.tsx
import React, { useEffect, useRef, useState } from 'react';

// 1. Definisikan tipe data untuk Props
interface RevealOnScrollProps {
  children: React.ReactNode; // Tipe standar untuk elemen di dalam komponen React
  animation?: 'fade-up' | 'pop-in' | 'slide-left' | 'slide-right' | string;
  delay?: 'delay-100' | 'delay-200' | 'delay-300' | 'delay-500' | string;
  className?: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  animation = 'fade-up', // Default animasi jika tidak diisi
  delay = '', 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // 2. Beri tahu TypeScript bahwa ref ini adalah untuk elemen <div>
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simpan referensi ke variabel lokal agar aman saat cleanup
    const currentRef = ref.current;
    
    // Konfigurasi observer: Kapan animasi harus dipicu?
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Hentikan observasi setelah animasi berjalan 1x agar tidak berulang-ulang
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.1, // Trigger saat 10% elemen sudah masuk ke layar
        rootMargin: '0px 0px -50px 0px' // Pemicu sedikit lebih awal sebelum benar-benar di tengah
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup function untuk mencegah memory leak
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // 3. Logika CSS: Sembunyikan dengan opacity-0 jika belum terlihat, 
  // jalankan kelas animasi dari index.css jika sudah terlihat.
  const visibilityClass = isVisible ? `animate-enter ${animation} ${delay}` : 'opacity-0';

  return (
    <div ref={ref} className={`${visibilityClass} ${className}`}>
      {children}
    </div>
  );
};

export default RevealOnScroll;