export default function removeEmpty($article: any, $: any) {
  $article.find('p').each((index: number, p: any) => {
    const $p = $(p);
    if ($p.find('iframe, img').length === 0 && $p.text().trim() === '')
      $p.remove();
  });

  return $;
}
