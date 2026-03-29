import getOrInitScore from './get-or-init-score';
import setScore from './set-score';

export default function addScore($node: any, $: any, amount: any) {
  try {
    const score = getOrInitScore($node, $) + amount;
    setScore($node, $, score);
  } catch {
    // Ignoring; error occurs in scoreNode
  }

  return $node;
}
