const fileInput = document.getElementById('fileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcript');
const notesEl = document.getElementById('notes');

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
  selectedFile = e.target.files[0] || null;
  if (selectedFile) {
    statusEl.textContent = `Selected: ${selectedFile.name}`;
    transcribeBtn.disabled = false;
  } else {
    statusEl.textContent = '';
    transcribeBtn.disabled = true;
  }
});

transcribeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  statusEl.textContent = 'Transcribing... (placeholder)';
  transcribeBtn.disabled = true;

  // For now, fake a transcript so we can test the note formatting
  const fakeTranscript = `
    Today we are going to talk about the fundamentals of machine learning.
    First, we will define supervised learning, unsupervised learning, and reinforcement learning.
    Then we will look at some common algorithms such as linear regression, logistic regression, and decision trees.
    Finally, we will discuss overfitting, regularization, and cross-validation.
  `.trim();

  transcriptEl.value = fakeTranscript;
  statusEl.textContent = 'Transcription complete (placeholder).';

  const notesHtml = generateNotesFromTranscript(fakeTranscript);
  notesEl.innerHTML = notesHtml;

  transcribeBtn.disabled = false;
});

/**
 * Very simple rule-based "note generator"
 * You can improve this later, but this gives you structured notes.
 */
function generateNotesFromTranscript(text) {
  const sentences = text
    .split(/[\.\?\!]\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const title = sentences[0] || 'Lecture Notes';

  const bulletPoints = sentences.slice(1);

  const keywords = extractKeywords(text);

  let html = '';

  html += `<h3>${title}</h3>`;
  html += `<h4>Key points</h4>`;
  html += '<ul>';
  for (const s of bulletPoints) {
    html += `<li>${s}</li>`;
  }
  html += '</ul>';

  if (keywords.length) {
    html += `<h4>Key terms</h4>`;
    html += '<ul>';
    for (const k of keywords) {
      html += `<li>${k}</li>`;
    }
    html += '</ul>';
  }

  return html;
}

/**
 * Very naive keyword extractor: picks frequent non-trivial words.
 */
function extractKeywords(text) {
  const stopwords = new Set([
    'the','and','or','a','an','of','to','in','on','for','with','is','are','was','were','this','that','it','as','we','will','be','by','from','at','about'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));

  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  return sorted;
}
