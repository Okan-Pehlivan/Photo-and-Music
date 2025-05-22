import { useState, useRef, useEffect } from 'react'
import './App.css'

// Resim ve müzik verilerini içeren bir dizi oluşturalım
interface SlideItem {
  imageUrl: string;
  youtubeId: string;
  title?: string;
}

function App() {
  // Resim ve müzik koleksiyonu
  const slides: SlideItem[] = [
    {
      imageUrl: "https://th.bing.com/th/id/OIP.BntIdzuijYlsS3tTsCKdsAHaEK?cb=iwc2&rs=1&pid=ImgDetMain",
      youtubeId: "Rvnbs7zUXbE",
      title: "Müzik 1"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      youtubeId: "A2tXABSntNA",
      title: "Müzik 2"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      youtubeId: "XMAjVGRCcs8",
      title: "Müzik 3"
    },
    // Daha fazla resim ve müzik ekleyebilirsiniz
  ]

  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const audioPlayerRef = useRef<HTMLIFrameElement>(null)

  // Slaytı değiştirme fonksiyonu
  const changeSlide = (direction: 'next' | 'prev') => {
    // Önce mevcut müziği duraklat
    if (audioPlayerRef.current && audioPlayerRef.current.contentWindow) {
      audioPlayerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
    }

    setIsPlaying(false)

    // Yeni slayt indeksini hesapla
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  // Müziği oynat/duraklat
  const togglePlay = () => {
    if (audioPlayerRef.current && audioPlayerRef.current.contentWindow) {
      if (isPlaying) {
        audioPlayerRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
      } else {
        audioPlayerRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Slayt değiştiğinde iframe src'sini güncelle
  useEffect(() => {
    // iframe yüklendiğinde otomatik olarak çalmasını engellemek için
    setIsPlaying(false)
  }, [currentSlide])

  return (
      <div className="app-container">
        <div className="left-section">
          <div className="slide-controls">
            <button
                className="slide-button prev-button"
                onClick={() => changeSlide('prev')}
                aria-label="Önceki slayt"
            >
              {/* Boş bırakıyoruz, ok işareti CSS ile eklenecek */}
            </button>

            <div className="full-image-container">
              <img
                  src={slides[currentSlide].imageUrl}
                  alt={`Slide ${currentSlide + 1}`}
                  className="full-image"
              />
            </div>

            <button
                className="slide-button next-button"
                onClick={() => changeSlide('next')}
                aria-label="Sonraki slayt"
            >
              {/* Boş bırakıyoruz, ok işareti CSS ile eklenecek */}
            </button>
          </div>

          <div className="slide-indicators">
            {slides.map((_, index) => (
                <span
                    key={index}
                    className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentSlide(index);
                    }}
                />
            ))}
          </div>
        </div>

        <div className="right-section">
          <h2>Hoş Geldiniz</h2>
          <p>Bu sağ bölümün içeriği. Buraya istediğiniz metni, formları veya diğer içerikleri ekleyebilirsiniz.</p>

          <div className="audio-player-container">
            <h3>Şu an çalıyor: {slides[currentSlide].title}</h3>
            <div className="audio-player">
              <iframe
                  ref={audioPlayerRef}
                  src={`https://www.youtube.com/embed/${slides[currentSlide].youtubeId}?enablejsapi=1&autoplay=0&controls=1&showinfo=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-iframe"
              ></iframe>

              <div className="audio-controls">
                <button onClick={togglePlay} className="play-button">
                  {isPlaying ? "Duraklat" : "Oynat"}
                </button>
              </div>
            </div>
          </div>

          <div className="counter-section">
            <p>Sayaç: {count}</p>
            <button onClick={() => setCount(count + 1)}>
              Artır
            </button>
          </div>
        </div>
      </div>
  )
}

export default App
