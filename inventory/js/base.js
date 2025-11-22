// Helper: Wait for all images, videos, and fonts to fully load
function waitForAllResources() {
  const images = Array.from(document.images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', resolve);
    });
  });

  const videos = Array.from(document.querySelectorAll('video')).map(video => {
    if (video.readyState >= 3) return Promise.resolve();
    return new Promise(resolve => {
      video.addEventListener('loadeddata', resolve);
      video.addEventListener('error', resolve);
    });
  });

  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();

  return Promise.all([...images, ...videos, fonts]);
}

// Start loading process
window.addEventListener('load', () => {
  // wait until literally everything is ready
  waitForAllResources().then(() => {
    document.body.classList.remove('before-load');
  });
});

// When transition of loader ends, remove it from DOM
document.querySelector('.loading').addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') { // ensure it's the fade-out transition
    document.body.removeChild(e.currentTarget);
  }
});


const magnets = document.querySelectorAll(".magnetic");
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
  cursor.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
});

magnets.forEach(el => {
  const strength = 0.3; // smaller movement strength
  const maxDist = 300; // smaller activation range

  document.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);

    if (dist < maxDist) {
      const pullX = (x / rect.width) * strength * 100;
      const pullY = (y / rect.height) * strength * 100;
      el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.03)`;
    } else {
      el.style.transform = `translate(0, 0) scale(1)`;
    }
  });
});


// === Filter Panel Toggle ===
const filterToggle = document.getElementById('filterToggle');
const filterPanel = document.getElementById('filterPanel');
const closeFilter = document.getElementById('closeFilter');

filterToggle.onclick = () => filterPanel.classList.add('active');
closeFilter.onclick = () => filterPanel.classList.remove('active');

// === Search Functionality ===
const searchInput = document.getElementById('searchInput');
const carCards = document.querySelectorAll('.car-card');

searchInput.addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  carCards.forEach(card => {
    const title = card.querySelector('.car-title').textContent.toLowerCase();
    card.style.display = title.includes(term) ? 'flex' : 'none';
  });
});