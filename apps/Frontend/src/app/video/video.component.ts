import { Component, OnInit, ViewChild, ElementRef, SkipSelf, ApplicationRef } from '@angular/core';
import { io } from 'socket.io-client';
import { first } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
@SkipSelf()
export class VideoComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef<HTMLVideoElement> | undefined;
  videoUrl: SafeUrl | undefined;

  constructor(private applicationRef: ApplicationRef, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.applicationRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => {
      this.startVideoStream();
    });
  }

  startVideoStream() {
    const socket = io('http://localhost:3000');
    socket.on('frame', (frameBase64: string) => {
      console.log('Received frame:', frameBase64);
      this.videoUrl = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + frameBase64);
    });
  }
}
