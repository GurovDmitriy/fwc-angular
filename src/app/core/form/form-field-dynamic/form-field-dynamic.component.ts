import { Component, input } from "@angular/core"
import { FormGroup, ReactiveFormsModule } from "@angular/forms"
import { NzFormModule } from "ng-zorro-antd/form"
import {
  NzInputDirective,
  NzInputGroupComponent,
  NzInputModule,
} from "ng-zorro-antd/input"
import { FormFieldMeta } from "./types"

@Component({
  selector: "app-form-field-dynamic",
  templateUrl: "./form-field-dynamic.component.html",
  imports: [
    ReactiveFormsModule,
    NzInputDirective,
    NzInputGroupComponent,
    NzFormModule,
    NzInputModule,
  ],
})
export class FormFieldDynamicComponent {
  form = input.required<FormGroup>()
  formMeta = input.required<FormFieldMeta>()
  errorMessage = input.required<string | null | undefined>()
}
