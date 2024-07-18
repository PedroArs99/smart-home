import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouseSignal, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { TriggerService } from './trigger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  logoIcon = faHouseSignal;
  lightbulbIcon = faLightbulb;
  title = 'Termite Home Control';

  constructor(private triggerService: TriggerService) {}

  trigger(originTopic: string, action: string) {
    this.triggerService.trigger(originTopic, action).subscribe(response => console.log(response));
  }

  message(deviceFriendlyName: string, message: any) {
    this.triggerService
      .message(deviceFriendlyName, message)
      .subscribe(response => console.log(response));
  }
}
