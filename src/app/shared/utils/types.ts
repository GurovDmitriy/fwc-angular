export type Nullable<T> = {
  [Key in keyof T]: T[Key] | null
}
