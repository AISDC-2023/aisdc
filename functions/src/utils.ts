import ShortUniqueId from "short-unique-id";

const uidGenerator = new ShortUniqueId({length: 10});

/**
 * Return unique conference id based on current timestamp
 *
 * @return {string} Time unique conference id
 */
export function getCid(): string {
  return uidGenerator();
}
