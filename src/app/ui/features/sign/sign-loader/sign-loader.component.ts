import { AsyncPipe } from "@angular/common"
import { Component, inject } from "@angular/core"
import { NzSpinComponent } from "ng-zorro-antd/spin"
import { AuthLoaderUsecase } from "../../../../domains/auth/auth-loader.usecase"

@Component({
  selector: "app-sign-loader",
  templateUrl: "./sign-loader.component.html",
  styleUrl: "./sign-loader.component.scss",
  imports: [AsyncPipe, NzSpinComponent],
})
export class SignLoaderComponent {
  authLoader = inject(AuthLoaderUsecase)
}
