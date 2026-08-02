import findWithin from './find-within';

export default function removeEmpty($article, $) {
  findWithin($article, 'p').each((index, p) => {
    const $p = $(p);
    if (findWithin($p, 'iframe, img').length === 0 && $p.text().trim() === '')
      $p.remove();
  });

  return $;
}
