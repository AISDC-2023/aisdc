import ShortUniqueId from "short-unique-id";

const uidGenerator = new ShortUniqueId();

/**
 * Return unique conference id based on current timestamp
 *
 * @return {string} Time unique conference id
 */
export function getCid(): string {
  return uidGenerator.stamp(10);
}
