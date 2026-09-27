// extremely simple url validation as a first step
export default function validateUrl(parsedUrl) {
  // If this isn't a valid url, return an error message
  return !!parsedUrl && !!parsedUrl.hostname;
}
