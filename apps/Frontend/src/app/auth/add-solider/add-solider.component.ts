import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider } from '../../store';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './add-solider.component.html',
  styleUrls: ['./add-solider.component.css'],
  providers: [MessageService]
})
export class AddSoliderComponent {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  photos: string[] = [];
  videoStream!: MediaStream;
  soliderDto: SoliderDto = new SoliderDto();
  countdown = 0;
  displayDialog = false;
  displayPhotosDialog = false;
  snd = new Audio("/3-2-1-countdown.mp3");

  constructor(private store: Store, private renderer: Renderer2, private messageService: MessageService) {}

  onSubmit() {
    if(this.photos[0] !== undefined) {
      this.store.dispatch(addSolider(this.soliderDto));
      this.resetForm();
    }
    else
    {
      this.messageService.add({ icon:'pi pi-camera', severity: 'error', summary: 'Photos Must Be Taken', detail: 'Please take pictures of the solider before adding a solider' });
    }
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
        this.displayPhotosDialog = true; // Show the photos dialog after capturing
        return;
      }

      this.countdown = 3;
      this.snd.play();
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.capturePhoto(video, canvasElement, context);
          photosTaken++;
          console.log(`Photo ${photosTaken} captured.`);
        }
      }, 1000);
    }, interval);
  }

  capturePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | null) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL('image/jpeg');
    this.photos.push(imageBase64);
    console.log(imageBase64);
    this.messageService.add({ icon:'pi pi-camera', severity: 'success', summary: 'Photo Captured', detail: `Photo ${this.photos.length} captured successfully.` });
  }

  stopCamera() {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach((track) => track.stop());
      console.log('Camera stopped.');
    }
  }

  openCaptureDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }

  confirmDialog() {
    this.displayDialog = false;
    this.capturePhotos();
  }

  retakePhotos() {
    this.photos = [];
    this.displayPhotosDialog = false;
    this.capturePhotos();
  }

  savePhotos() {
    this.displayPhotosDialog = false;
  }
}
