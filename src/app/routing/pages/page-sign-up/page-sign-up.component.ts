import { Component } from "@angular/core"
import { SignUpFormComponent } from "../../../ui/features/sign/sign-up-form"

@Component({
  selector: "app-page-sign-up",
  templateUrl: "./page-sign-up.component.html",
  styleUrl: "./page-sign-up.component.scss",
  standalone: true,
  imports: [SignUpFormComponent],
})
export class PageSignUpComponent {}
