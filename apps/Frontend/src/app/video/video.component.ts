import {
  Component,
  OnInit,
  ApplicationRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { io } from 'socket.io-client';
import { first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})
export class VideoComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  // Add prediction results properties
  predictionName: string | null = null;
  predictionVerify: boolean | null = null;
  predictionResult: any = null;

  constructor(
    private applicationRef: ApplicationRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.applicationRef.isStable
      .pipe(first((isStable) => isStable))
      .subscribe(() => {
        this.startVideoStream();
      });
  }

  startVideoStream() {
    const socket = io('http://localhost:3000');

    socket.on('frame', (frameBase64: string) => {
      this.videoPlayer.nativeElement.src =
        'data:image/jpg;base64,' + frameBase64;
    });

    // Add listener for prediction results
    socket.on('prediction_result', (predictionData: any) => {
      if (predictionData.result instanceof Array) {
        predictionData.result = Float32Array.from(predictionData.result);
      }
      this.predictionName = predictionData.name;
      this.predictionVerify = Boolean(predictionData.verify);
      this.predictionResult = predictionData.result;
      this.applicationRef.tick();
    });
  }
}
