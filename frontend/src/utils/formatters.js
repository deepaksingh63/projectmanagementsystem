import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (value) => (value ? format(new Date(value), "dd MMM yyyy") : "-");
export const formatDateTime = (value) => (value ? format(new Date(value), "dd MMM yyyy, hh:mm a") : "-");
export const relativeTime = (value) =>
  value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : "-";
