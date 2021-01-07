import pipelineTransformation from './pipeline-transformation.js';

export default pipelineTransformation((operations, current) => {
  Error.stackTraceLimit = Infinity;
  console.info(current); //eslint-disable-line no-console
  return operations;
});
