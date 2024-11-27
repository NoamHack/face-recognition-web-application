import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider } from '../../store';


@Component({
  selector: 'app-register',
  templateUrl: './add-solider.component.html',
  styleUrls: ['./add-solider.component.css'],
})
export class AddSoliderComponent {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  photos: string[] = [];
  videoStream!: MediaStream;
  soliderDto: SoliderDto = new SoliderDto();

  constructor(private store: Store, private renderer: Renderer2) {}

  onSubmit() {
    this.store.dispatch(addSolider(this.soliderDto));
    this.resetForm();
  }

  resetForm() {
    this.soliderDto = new SoliderDto();
  }

  async capturePhotos() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = this.renderer.createElement('video');
      this.renderer.setAttribute(videoElement, 'autoplay', 'true');
      this.renderer.setAttribute(videoElement, 'muted', 'true');
      videoElement.srcObject = stream;

      this.video = videoElement;

      await new Promise((resolve) => (videoElement.onloadedmetadata = resolve));
      videoElement.play();

      this.takePhotos(videoElement, 3, 5000);

    } catch (error) {
      console.error('Error capturing photos:', error);
    }
  }

  takePhotos(video: HTMLVideoElement, count: number, interval: number) {
    let photosTaken = 0;
    const canvasElement = this.canvas.nativeElement;
    const context = canvasElement.getContext('2d');

    const captureInterval = setInterval(() => {
      if (photosTaken >= count) {
        clearInterval(captureInterval);
        this.stopCamera();
        return;
      }

      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;

      context?.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      const imageBase64 = canvasElement.toDataURL('image/jpeg');
      this.photos.push(imageBase64);
      console.log(`Photo ${photosTaken + 1} captured.`);
      console.log(imageBase64);
      photosTaken++;
    }, interval);
  }

  stopCamera() {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach((track) => track.stop());
      console.log('Camera stopped.');
    }
  }
}
