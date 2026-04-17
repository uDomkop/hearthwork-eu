import './styles.css';
import { marked } from 'marked';
import charterMd from '../charter.md?raw';
import manifestoMd from '../manifesto.md?raw';

const sources = {
  charter: charterMd,
  manifesto: manifestoMd,
};

const scriptEl = document.querySelector('script[data-source]');
const source = scriptEl && scriptEl.getAttribute('data-source');
const md = sources[source];

const container = document.getElementById('document-content');
if (md) {
  container.innerHTML = marked.parse(md);
} else {
  container.innerHTML = '<p>Document not found.</p>';
}
