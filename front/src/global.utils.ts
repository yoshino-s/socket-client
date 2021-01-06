export function convertAddress(address: string): string {
  if (address.startsWith("::ffff:"))
    return address + `(${(address.slice(7))})`;
  else
    return address;
}
