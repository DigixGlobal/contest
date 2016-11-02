export default function () {
  const { contract } = this;
  if (!contract) { throw new Error('Contract not defined!'); }
  // otherwise let's deploy this bizatch
  return this;
}
