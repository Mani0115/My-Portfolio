/**
 * Video Optimization Script
 * Improves loading and playback performance of video reels
 */

document.addEventListener('DOMContentLoaded', function() {
  // Optimize video reels
  optimizeVideoReels();
  setupLazyVideoLoading();
  optimizeVideoPlayback();
});

/**
 * Optimize video reel containers for faster rendering
 */
function optimizeVideoReels() {
  const videoCards = document.querySelectorAll('.reel-card-vertical-9-16');
  
  videoCards.forEach((card, index) => {
    const video = card.querySelector('video');
    const poster = card.getAttribute('data-poster');
    const driveEmbed = card.getAttribute('data-drive-embed');
    
    if (video && poster) {
      // Use optimized poster URL
      video.poster = getOptimizedThumbnail(poster);
      
      // Set preload to 'metadata' instead of 'none' for faster scrubbing
      video.preload = 'metadata';
      
      // Enable lazy loading with Intersection Observer
      video.loading = 'lazy';
    }
    
    // Stagger initialization for smoother performance
    if (index % 5 === 0) {
      setTimeout(() => prepareVideoForPlayback(card), index * 100);
    }
  });
}

/**
 * Convert Google Drive thumbnail to optimized version
 */
function getOptimizedThumbnail(driveUrl) {
  // Extract Drive file ID
  const fileIdMatch = driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    // Return smaller, optimized thumbnail
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }
  return driveUrl;
}

/**
 * Setup intersection observer for lazy loading videos
 */
function setupLazyVideoLoading() {
  const videoCards = document.querySelectorAll('.reel-card-vertical-9-16');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target.querySelector('video');
        if (video && !video.src) {
          loadVideoSource(entry.target, video);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before visible
  });
  
  videoCards.forEach(card => observer.observe(card));
}

/**
 * Load video source efficiently
 */
function loadVideoSource(card, videoElement) {
  const driveEmbed = card.getAttribute('data-drive-embed');
  
  if (driveEmbed) {
    const fileIdMatch = driveEmbed.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Use embed URL with export parameter for better compatibility
      const videoUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      // Create source element
      const source = document.createElement('source');
      source.src = videoUrl;
      source.type = 'video/mp4';
      
      videoElement.appendChild(source);
      videoElement.load();
    }
  }
}

/**
 * Optimize video playback settings
 */
function optimizeVideoPlayback() {
  const videoCards = document.querySelectorAll('.reel-card-vertical-9-16');
  
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.reel-center-play-button');
    
    if (video && playBtn) {
      // Click to play
      playBtn.addEventListener('click', () => {
        playVideo(video, playBtn);
      });
      
      // Card click to play
      card.addEventListener('click', (e) => {
        if (e.target !== playBtn && !video.playing) {
          playVideo(video, playBtn);
        }
      });
      
      // Stop video when clicking outside
      document.addEventListener('click', (e) => {
        if (!card.contains(e.target) && video.playing) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  });
}

/**
 * Play video with optimizations
 */
function playVideo(video, playBtn) {
  if (!video.src && !video.querySelector('source')) {
    loadVideoSource(video.closest('.reel-card-vertical-9-16'), video);
  }
  
  video.play().catch(err => {
    console.log('Video play error:', err);
    // Fallback: show error message
    const card = video.closest('.reel-card-vertical-9-16');
    if (card) {
      card.classList.add('video-error');
    }
  });
  
  playBtn.style.display = 'none';
}

/**
 * Prepare video for playback
 */
function prepareVideoForPlayback(card) {
  const video = card.querySelector('video');
  if (video) {
    // Preload metadata
    video.addEventListener('loadedmetadata', () => {
      card.classList.add('video-ready');
    }, { once: true });
  }
}

/**
 * Add mute button functionality
 */
document.addEventListener('click', (e) => {
  if (e.target.closest('.reel-mute-button')) {
    const muteBtn = e.target.closest('.reel-mute-button');
    const video = muteBtn.closest('.reel-card-vertical-9-16')?.querySelector('video');
    
    if (video) {
      video.muted = !video.muted;
      muteBtn.querySelector('.mute-icon').textContent = video.muted ? '🔇' : '🔊';
    }
  }
});
