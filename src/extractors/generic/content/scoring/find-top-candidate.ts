import { NON_TOP_CANDIDATE_TAGS_RE } from './constants';
import getScore from './get-score';
import mergeSiblings from './merge-siblings';

// After we've calculated scores, loop through all of the possible
// candidate nodes we found and find the one with the highest score.
export default function findTopCandidate($: any) {
  let $candidate: any;
  let topScore: number = 0;

  $('[score]').each((index: number, node: any) => {
    // Ignore tags like BR, HR, etc
    if (NON_TOP_CANDIDATE_TAGS_RE.test(node.tagName)) {
      return;
    }

    const $node = $(node);
    const score = getScore($node);

    if (score && score > topScore) {
      topScore = score;
      $candidate = $node;
    }
  });

  // If we don't have a candidate, return the body
  // or whatever the first element is
  if (!$candidate) {
    return $('body') || $('*').first();
  }

  $candidate = mergeSiblings($candidate, topScore, $);

  return $candidate;
}
