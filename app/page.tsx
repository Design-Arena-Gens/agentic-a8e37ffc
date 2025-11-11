'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const styles = [
    { id: 'realistic', name: 'Realistik', desc: 'Potret realistis seperti foto' },
    { id: 'anime', name: 'Anime', desc: 'Gaya anime/manga Jepang' },
    { id: 'oil-painting', name: 'Lukisan Minyak', desc: 'Gaya lukisan minyak klasik' },
    { id: 'watercolor', name: 'Cat Air', desc: 'Lukisan cat air lembut' },
    { id: 'pencil', name: 'Sketsa Pensil', desc: 'Gambar sketsa pensil' },
    { id: 'digital-art', name: 'Digital Art', desc: 'Seni digital modern' },
    { id: 'pop-art', name: 'Pop Art', desc: 'Gaya pop art warna-warni' },
    { id: 'fantasy', name: 'Fantasi', desc: 'Karakter fantasi epik' },
  ]

  const suggestions = [
    'Seorang wanita muda dengan rambut panjang, senyum lembut',
    'Pria dewasa dengan janggut, tatapan bijaksana',
    'Anak perempuan ceria dengan bunga di rambut',
    'Wanita elegan dengan gaun merah, pose anggun',
    'Pria tampan dengan jas hitam, latar belakang kota',
  ]

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Silakan masukkan deskripsi gambar')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat gambar')
      }

      setImageUrl(data.imageUrl)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-art-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Gagal mengunduh gambar')
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">🎨 AI Art Generator</h1>
          <p className="text-xl text-white/90">Generator Seni Gambar Manusia untuk Instagram</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Buat Gambar Seni</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Gambar
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-800"
                rows={4}
                placeholder="Contoh: Seorang wanita cantik dengan rambut panjang hitam, senyum manis, latar belakang taman bunga..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pilih Gaya Seni
              </label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      style === s.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-600">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contoh Prompt
              </label>
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(sug)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateImage}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Membuat Gambar...
                </span>
              ) : (
                '✨ Buat Gambar'
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Hasil Gambar</h2>

            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Generated art"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="mx-auto h-24 w-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">Gambar akan muncul di sini</p>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="space-y-3">
                <button
                  onClick={downloadImage}
                  className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md"
                >
                  📥 Download Gambar
                </button>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold mb-2">📱 Cara Upload ke Instagram:</p>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Klik tombol "Download Gambar"</li>
                    <li>Buka aplikasi Instagram di HP</li>
                    <li>Klik tombol + untuk post baru</li>
                    <li>Pilih gambar yang sudah di-download</li>
                    <li>Edit dan tambahkan caption</li>
                    <li>Klik "Share" untuk posting</li>
                  </ol>
                </div>

                <button
                  onClick={() => {
                    setImageUrl('')
                    setPrompt('')
                  }}
                  className="w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all shadow-md"
                >
                  🔄 Buat Gambar Baru
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 Tips Membuat Gambar Bagus:</h3>
          <ul className="space-y-2 text-white/90">
            <li>• Deskripsikan detail wajah: bentuk mata, rambut, ekspresi</li>
            <li>• Sebutkan pakaian dan aksesori yang diinginkan</li>
            <li>• Tambahkan latar belakang yang sesuai</li>
            <li>• Gunakan kata sifat untuk mood: ceria, elegan, misterius, dll</li>
            <li>• Pilih gaya seni yang sesuai dengan tema Instagram Anda</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
