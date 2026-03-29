import convertNodeTo from './convert-node-to';

// H1 tags are typically the article title, which should be extracted
// by the title extractor instead. If there's less than 3 of them (<3),
// strip them. Otherwise, turn 'em into H2s.
export default function cleanHOnes(article: any, $: any) {
  const $hOnes = $('h1', article);

  if ($hOnes.length < 3) {
    $hOnes.each((index: number, node: any) => $(node).remove());
  } else {
    $hOnes.each((index: number, node: any) => {
      convertNodeTo($(node), $, 'h2');
    });
  }

  return $;
}
