import { TAGS_TO_REMOVE } from './constants';

function isComment(index: number, node: any) {
  return node.type === 'comment';
}

function cleanComments($: any) {
  $.root()
    .find('*')
    .contents()
    .filter(isComment)
    .remove();

  return $;
}

export default function clean($: any) {
  $(TAGS_TO_REMOVE).remove();

  $ = cleanComments($);
  return $;
}
