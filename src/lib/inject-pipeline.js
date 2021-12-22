import pipelineTransformation from './pipeline-transformation.js';

export default function injectPipeline(...transformations) {
  return pipelineTransformation((operations) => {
    return [...transformations, ...operations];
  });
}
