<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import charterMd from '../../docs/charter.md?raw';
import manifestoMd from '../../docs/manifesto.md?raw';
import commentaryMd from '../../docs/commentary.md?raw';
import { useHead } from '../composables/useHead';
import { charterDraft } from '../charterMeta';

const props = defineProps<{
  source: 'charter' | 'manifesto' | 'commentary';
}>();

const sources: Record<string, string> = {
  charter: charterMd,
  manifesto: manifestoMd,
  commentary: commentaryMd,
};

const meta: Record<string, { title: string; description: string }> = {
  charter: {
    title: 'The Charter — Hearthwork EU',
    description: `The Hearthwork EU Charter, ${charterDraft}. A constitutional charter for a living European Union: four standings, voluntary Hestias, paid-for votes, no permanent vetoes.`,
  },
  manifesto: {
    title: 'The Manifesto — Hearthwork EU',
    description: 'A union of choice, not compulsion. The political case for a Europe of Hestias.',
  },
  commentary: {
    title: 'The Commentary — Hearthwork EU',
    description: 'Interpretive companion to the Hearthwork EU Charter — answering the seven questions most likely to puzzle, frighten, or be misread.',
  },
};

const html = computed(() => {
  const md = sources[props.source];
  return md ? marked.parse(md) as string : '<p>Document not found.</p>';
});

useHead(() => meta[props.source] ?? {});
</script>

<template>
  <article class="document" v-html="html"></article>
</template>
