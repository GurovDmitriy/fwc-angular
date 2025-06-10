import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { SignLoaderComponent } from "./ui/features/sign/sign-loader/sign-loader.component"

@Component({
  selector: "app-root",
  imports: [RouterOutlet, SignLoaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
