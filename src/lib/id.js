export default function identity(state) {
  return () => {
    return state;
  };
}
