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

// Cursor follow
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
});

/* --------------------------------------------------
   IMAGE UPLOAD PREVIEW (Only if the field exists)
-------------------------------------------------- */
const imagesInput = document.getElementById('images');
const preview = document.getElementById('preview');

if (imagesInput && preview) {
  imagesInput.addEventListener('change', (e) => {
    preview.innerHTML = '';
    const files = Array.from(e.target.files).slice(0, 12);

    if (files.length === 0) return;

    files.forEach(file => {
      const name = file.name.toLowerCase();
      if (!(name.endsWith('.jpg') || name.endsWith('.jpeg'))) {
        alert(`Only .JPG or .JPEG images are allowed. File "${file.name}" was not accepted.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.alt = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
}


/* --------------------------------------------------
   FINANCE FORM VALIDATION + DEMO SUBMISSION
-------------------------------------------------- */
const financeForm = document.getElementById('financeForm');

if (financeForm) {
  financeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Required field validation
    const required = financeForm.querySelectorAll('[required]');
    for (let el of required) {
      if (!el.value.trim() || (el.type === 'checkbox' && !el.checked)) {
        el.focus();
        alert('Please fill all required fields.');
        return;
      }
    }

    const fd = new FormData(financeForm);

    const summary = {
      name: fd.get('firstName') + ' ' + fd.get('lastName'),
      birthYear: fd.get('birthYear'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      down: fd.get('down'),
      term: fd.get('term'),
      notes: fd.get('notes') || 'None'
    };

    alert(
      'Your finance application has been submitted!\n\n' +
      `Name: ${summary.name}\n` +
      `Birth Year: ${summary.birthYear}\n` +
      `Email: ${summary.email}\n` +
      `Phone: ${summary.phone}\n` +
      `Down Payment: $${summary.down}\n` +
      `Term: ${summary.term} months\n` +
      `Notes: ${summary.notes}\n\n` +
      'Our finance team will contact you shortly.'
    );

    financeForm.reset();
  });
}


/* --------------------------------------------------
   OPTIONAL: Tips Video (Only if element exists)
-------------------------------------------------- */
const tips = document.getElementById('tipsVideo');

if (tips) {
  tips.addEventListener('click', () => {
    window.open('https://www.youtube.com/', '_blank');
  });
  tips.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') tips.click();
  });
}

// TYPES LIST -----------------------------------------------------------------

document.querySelectorAll('.types-list li').forEach(li => {
  const text = li.textContent.trim();
  li.innerHTML = `<div class="marquee-inner">${text}</div>`;

  let tween = null;
  
  li.addEventListener('mouseenter', () => {
    const inner = li.querySelector('.marquee-inner');
    // duplicate text until it’s wide enough
    const parentWidth = li.offsetWidth;
    while (inner.offsetWidth < parentWidth * 2) {
      inner.innerHTML += " &nbsp; " + text;
    }

    // Create infinite marquee
    tween = gsap.to(inner, {
      xPercent: -50,
      ease: "none",
      repeat: -1,
      duration: 30
    });
  });

  li.addEventListener('mouseleave', () => {
    if (tween) tween.kill();
    const inner = li.querySelector('.marquee-inner');
    inner.style.transform = "translateX(0)";
    inner.innerHTML = text; // reset to clean state
  });
});