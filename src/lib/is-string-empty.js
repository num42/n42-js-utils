export default function isStringEmpty(value) {
  // eslint-disable-next-line no-undefined
  if (value === null || value === undefined) {
    return true;
  }
  return value.trim().length <= 0;
}
