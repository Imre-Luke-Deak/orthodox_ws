pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null, currentPage = 1;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: 1.0 }); // fixed scale

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport }).promise;

  document.getElementById('pageInfo').textContent =
    `${num} / ${pdfDoc.numPages}`;

  document.getElementById('prev').disabled = num <= 1;
  document.getElementById('next').disabled = num >= pdfDoc.numPages;
}

// Load PDF
fetch('media/bizanci_intro_MM.pdf')
  .then(res => res.arrayBuffer())
  .then(buf => pdfjsLib.getDocument({ data: buf }).promise)
  .then(doc => {
    pdfDoc = doc;
    renderPage(1);
  });

// Navigation
document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

document.getElementById('next').addEventListener('click', () => {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!pdfDoc) return;

  if (e.key === 'ArrowRight' && currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }

  if (e.key === 'ArrowLeft' && currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});
