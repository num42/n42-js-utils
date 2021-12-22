import pipelineTransformation from './pipeline-transformation.js';

export default pipelineTransformation((operations, current) => {
  console.log(current); //eslint-disable-line no-console
  return operations;
});
