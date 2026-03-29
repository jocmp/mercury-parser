export default function setScore($node: any, $: any, score: any) {
  $node.attr('score', score);
  return $node;
}
