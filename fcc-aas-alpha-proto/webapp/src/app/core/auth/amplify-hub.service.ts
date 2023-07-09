import { Injectable } from "@angular/core";
import { Hub } from "aws-amplify";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AmplifyHubService {
  authEvent: Observable<any>;
  private authEvent$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.listenForAuthEvents();
    this.authEvent = this.authEvent$.asObservable();
  }

  private listenForAuthEvents(): void {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      if (event === "cognitoHostedUI" || event === "signedIn") {
        if(data) {
          this.authEvent$.next(null);
        }
      }
    });
  }
}