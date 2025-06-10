import { Component } from "@angular/core"
import { SignInFormComponent } from "../../../ui/features/sign/sign-in-form"

@Component({
  selector: "app-page-sign-in",
  templateUrl: "./page-sign-in.component.html",
  styleUrl: "./page-sign-in.component.scss",
  standalone: true,
  imports: [SignInFormComponent],
})
export class PageSignInComponent {}
