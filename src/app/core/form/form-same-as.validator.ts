import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import * as R from "ramda"

export function formSameAsValidator(
  nameFiledMatching: string,
  nameFieldCurrent: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filedMatching = control.get(nameFiledMatching)
    const fieldCurrent = control.get(nameFieldCurrent)

    if (!filedMatching || !fieldCurrent) return null

    const customError = {
      customSameAs: {
        filedMatching: nameFiledMatching,
        fieldCurrent: nameFieldCurrent,
      },
    }

    const errorsCurrent = fieldCurrent.errors

    if (
      R.all(R.isNotEmpty)([filedMatching.value, fieldCurrent.value]) &&
      R.complement(R.equals)(filedMatching.value, fieldCurrent.value)
    ) {
      return customError
    } else {
      if (R.isNil(errorsCurrent)) return null

      return null
    }
  }
}
