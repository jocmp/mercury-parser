export default function scorePageInLink(pageNum: any, isWp: any) {
  // page in the link = bonus. Intentionally ignore wordpress because
  // their ?p=123 link style gets caught by this even though it means
  // separate documents entirely.
  if (pageNum && !isWp) {
    return 50;
  }

  return 0;
}
