const API_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID;

// Mock data to use before an API key is provided
const mockTracks = [
  {
    id: "1",
    name: "Lofi Study",
    artist_name: "FASSounds",
    album_name: "Lofi Vibes",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=300&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    duration: 140
  },
  {
    id: "2",
    name: "Good Night",
    artist_name: "FASSounds",
    album_name: "Chill Hop",
    image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=300&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8175515.mp3",
    duration: 165
  },
  {
    id: "3",
    name: "Cinematic Ambient",
    artist_name: "Lexin_Music",
    album_name: "Background Music",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58be.mp3",
    duration: 184
  },
  {
    id: "4",
    name: "Tech House",
    artist_name: "QubeSounds",
    album_name: "Electronic Vibes",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80",
    audio: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_51cb0d3153.mp3",
    duration: 110
  }
];

export async function fetchTracks() {
  // If no API key is set, use mock data
  if (!CLIENT_ID) {
    console.warn("No VITE_API_CLIENT_ID found in .env. Using mock data.");
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(mockTracks), 500));
  }

  try {
    const response = await fetch(`${API_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&hasimage=true&audioformat=mp32`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results.map(track => ({
      id: track.id,
      name: track.name,
      artist_name: track.artist_name,
      album_name: track.album_name,
      image: track.image,
      audio: track.audio,
      duration: track.duration
    }));
  } catch (error) {
    console.error("Error fetching tracks from API:", error);
    // Fallback to mock data on error
    return mockTracks;
  }
};
