// This file has multiple lines to trigger the max-lines rule
const testFunction = () => {
  console.log('Hello world'); // Will also trigger the no-console error
  return true;
};

export default testFunction;
