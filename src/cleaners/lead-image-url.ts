export default function clean(leadImageUrl: string) {
  try {
    return new URL(leadImageUrl.trim()).toString();
  } catch {
    return null;
  }
}
