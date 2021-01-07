import pipelineTransformation from './pipeline-transformation.js';

export default function injectPipelineIf(conditionFn, ...transformations) {
  return pipelineTransformation((operations, current) => {
    return conditionFn(current, operations, transformations)
      ? [...transformations, ...operations]
      : operations;
  });
}
