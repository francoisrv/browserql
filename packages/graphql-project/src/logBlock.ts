export default function logBlock(...args: any[]) {
  console.log(...args.filter(Boolean))
}
