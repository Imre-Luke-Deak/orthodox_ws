pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null, currentPage = 1, zoom = 1.0;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: zoom });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;
  document.getElementById('pageInfo').textContent = `${num} / ${pdfDoc.numPages}`;
  document.getElementById('zoomVal').textContent = Math.round(zoom * 100) + '%';
  document.getElementById('prev').disabled = num <= 1;
  document.getElementById('next').disabled = num >= pdfDoc.numPages;
}

// Auto-loads the PDF from your repo
fetch('./assets/slides.pdf')
  .then(res => res.arrayBuffer())
  .then(buf => pdfjsLib.getDocument({ data: buf }).promise)
  .then(doc => { pdfDoc = doc; renderPage(1); });

document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; renderPage(currentPage); }
});
document.getElementById('next').addEventListener('click', () => {
  if (currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
});
document.getElementById('zoomIn').addEventListener('click', () => {
  zoom = Math.min(zoom + 0.25, 4); renderPage(currentPage);
});
document.getElementById('zoomOut').addEventListener('click', () => {
  zoom = Math.max(zoom - 0.25, 0.25); renderPage(currentPage);
});

document.addEventListener('keydown', e => {
  if (!pdfDoc) return;
  if (e.key === 'ArrowRight' && currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
  if (e.key === 'ArrowLeft' && currentPage > 1) { currentPage--; renderPage(currentPage); }
});
