export const Status = {
  useless: "useless",
  pending: "pending",
  success: "success",
  failure: "failure",
} as const

export type StatusName = keyof typeof Status
