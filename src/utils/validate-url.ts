// extremely simple url validation as a first step
export default function validateUrl({ hostname }: { hostname?: string | null }) {
  // If this isn't a valid url, return an error message
  return !!hostname;
}
