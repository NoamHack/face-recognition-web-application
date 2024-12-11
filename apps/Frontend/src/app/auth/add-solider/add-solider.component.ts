import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider, addSoliderPics } from '../../store';
import { MessageService } from 'primeng/api';
import { SoliderPicsDto } from '../../dto/solider-pics.dto';

@Component({
  selector: 'app-register',
  templateUrl: './add-solider.component.html',
  styleUrls: ['./add-solider.component.css'],
  providers: [MessageService],
})
export class AddSoliderComponent {
  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  photos: string[] = [];
  videoStream!: MediaStream;
  soliderDto: SoliderDto = new SoliderDto();
  soliderPicsDto: SoliderPicsDto = new SoliderPicsDto();
  countdown = 0;
  displayDialog = false;
  displayPhotosDialog = false;
  snd = new Audio('/3-2-1-countdown.mp3');
  isTakingPhotos = false;

  constructor(private store: Store, private messageService: MessageService) {}

  onSubmit() {
    if (
      this.soliderPicsDto.soliderFrontPic != undefined ||
      this.soliderPicsDto.soliderLeftProfilePic != undefined ||
      this.soliderPicsDto.soliderRightProfilePic != undefined
    ) {
      this.soliderPicsDto.soliderPersonalNumber =
        this.soliderDto.soliderPersonalNumber;
      this.store.dispatch(addSolider(this.soliderDto));
      this.store.dispatch(addSoliderPics(this.soliderPicsDto));
      this.resetForm();
    } else {
      this.messageService.add({
        icon: 'pi pi-camera',
        severity: 'error',
        summary: 'Photos Must Be Taken',
        detail: 'Please take pictures of the solider before adding a solider',
      });
    }
  }

  resetForm() {
    this.soliderDto = new SoliderDto();
    this.soliderPicsDto = new SoliderPicsDto();
  }

  async capturePhotos() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoStream = stream;
      this.video.nativeElement.srcObject = stream;
      await new Promise(
        (resolve) => (this.video.nativeElement.onloadedmetadata = resolve)
      );
      this.video.nativeElement.play();
      this.takePhotos(this.video.nativeElement, 3, 5000);
    } catch (error) {
      console.error('Error capturing photos:', error);
      this.isTakingPhotos = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to access camera',
      });
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
        this.displayPhotosDialog = true;
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
        }
      }, 1000);
    }, interval);
  }

  capturePhoto(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ) {
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL('image/jpeg');
    this.photos.push(imageBase64);
    this.messageService.add({
      icon: 'pi pi-camera',
      severity: 'success',
      summary: 'Photo Captured',
      detail: `Photo ${this.photos.length} captured successfully.`,
    });
  }

  stopCamera() {
    if (this.videoStream) {
      const tracks = this.videoStream.getTracks();
      tracks.forEach((track) => track.stop());
      this.isTakingPhotos = false;
      this.video.nativeElement.srcObject = null;
    }
  }

  openCaptureDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
    this.stopCamera();
  }

  confirmDialog() {
    this.isTakingPhotos = true;
    this.displayDialog = false;
    this.capturePhotos();
  }

  retakePhotos() {
    this.photos = [];
    this.displayPhotosDialog = false;
    this.stopCamera();
    this.isTakingPhotos = true;
    this.capturePhotos();
  }

  savePhotos() {
    this.stopCamera();
    this.soliderPicsDto.soliderFrontPic = this.photos[0];
    this.soliderPicsDto.soliderRightProfilePic = this.photos[1];
    this.soliderPicsDto.soliderLeftProfilePic = this.photos[2];
    this.photos = [];
    this.displayPhotosDialog = false;
  }
}
