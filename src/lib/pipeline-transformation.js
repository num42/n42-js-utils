export default function pipelineTransformation(fn, data) {
  return {
    exec(current, nextOperations /* callback */) {
      // TODO(asol): if callback use callback instead of return
      return {
        next: fn(nextOperations, current, data),
        current,
      };
    },
  };
}
