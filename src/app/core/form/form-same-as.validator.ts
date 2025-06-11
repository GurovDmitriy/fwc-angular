import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import * as R from "ramda"

export function formSameAsValidator(
  nameFieldCurrent: string,
  nameFiledMatching: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filedMatching = control.get(nameFiledMatching)
    const fieldCurrent = control.get(nameFieldCurrent)

    if (!filedMatching || !fieldCurrent) return null

    const customError = {
      [nameFieldCurrent]: {
        customSameAs: {
          fieldCurrent: nameFieldCurrent,
          filedMatching: nameFiledMatching,
        },
      },
    }

    if (
      R.isNotEmpty(filedMatching.value) &&
      R.isNotEmpty(fieldCurrent.value) &&
      R.complement(R.equals)(filedMatching.value, fieldCurrent.value)
    ) {
      return customError
    } else {
      return null
    }
  }
}
