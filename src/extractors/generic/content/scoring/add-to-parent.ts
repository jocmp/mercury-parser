import getScore from './get-score';
import scoreNode from './score-node';
import getWeight from './get-weight';
import setScore from './set-score';

// Adds 1/4 of a child's score to its parent
export default function addToParent(node: any, $: any, score: any) {
  const parent = node.parent();
  if (parent) {
    let parentScore = getScore(parent);
    if (!parentScore) {
      parentScore = scoreNode(parent) + getWeight(parent);
    }
    setScore(parent, $, parentScore + score * 0.25);
  }

  return node;
}
