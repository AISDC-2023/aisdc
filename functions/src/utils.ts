import ShortUniqueId from "short-unique-id";

const uidGenerator = new ShortUniqueId({length: 8});

/**
 * Return unique conference id based on current timestamp
 *
 * @return {string} Time unique conference id
 */
export function getCid(): string {
  return uidGenerator.stamp(8);
}
