import { formatDuration } from "./formatDuration";

export function calculateDuration(startTime) {
  const endTime = new Date();
  const duration = endTime - startTime;
  return formatDuration(duration);
}
