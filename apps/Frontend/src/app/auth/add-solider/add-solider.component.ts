import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider, addSoliderPics } from '../../store';
import { MessageService } from 'primeng/api';
import { SoliderPicsDto } from '../../dto/solider-pics.dto';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-register',
  templateUrl: './add-solider.component.html',
  styleUrls: ['./add-solider.component.css'],
  providers: [MessageService],
})
export class AddSoliderComponent implements OnInit, OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  photos: string[] = [];
  videoStream!: MediaStream;
  soliderDto: SoliderDto = new SoliderDto();
  soliderPicsDto: SoliderPicsDto = new SoliderPicsDto();
  countdown = 0;
  displayDialog = false;
  displayPhotosDialog = false;
  snd = new Audio('/3-2-1-countdown.mp3');
  isTakingPhotos = false;
  private socket: any;

  numberOfPhotos = 8;

  constructor(private store: Store, private messageService: MessageService) {}

  ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('stop_video');
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.socket) {
      this.socket.emit('start_video');
      this.socket.disconnect();
    }
  }

  onSubmit() {
    if (
      this.soliderPicsDto.soliderPositivePic1 != undefined ||
      this.soliderPicsDto.soliderPositivePic2 != undefined ||
      this.soliderPicsDto.soliderPositivePic3 != undefined ||
      this.soliderPicsDto.soliderPositivePic4 != undefined ||
      this.soliderPicsDto.soliderAnchorPic1 != undefined ||
      this.soliderPicsDto.soliderAnchorPic2 != undefined ||
      this.soliderPicsDto.soliderAnchorPic3 != undefined ||
      this.soliderPicsDto.soliderAnchorPic4 != undefined
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
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoStream = stream;
      this.video.nativeElement.srcObject = stream;
      await new Promise<void>(
        (resolve) =>
          (this.video.nativeElement.onloadedmetadata = () => resolve())
      );
      this.video.nativeElement.play();
      this.takePhotos(this.video.nativeElement, this.numberOfPhotos, 5000);
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

      this.countdown = 1;
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

    // Set canvas size to our desired crop dimensions
    canvas.width = 200;
    canvas.height = 200;

    // Draw only the cropped region
    context.drawImage(
      video,
      215, // Start X position to crop from
      160, // Start Y position to crop from
      175, // Width of the crop
      250, // Height of the crop
      0, // Destination X on canvas
      0, // Destination Y on canvas
      250, // Destination width
      250 // Destination height
    );

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
    this.soliderPicsDto.soliderPositivePic1 = this.photos[0];
    this.soliderPicsDto.soliderPositivePic2 = this.photos[1];
    this.soliderPicsDto.soliderPositivePic3 = this.photos[2];
    this.soliderPicsDto.soliderPositivePic4 = this.photos[3];
    this.soliderPicsDto.soliderAnchorPic1 = this.photos[4];
    this.soliderPicsDto.soliderAnchorPic2 = this.photos[5];
    this.soliderPicsDto.soliderAnchorPic3 = this.photos[6];
    this.soliderPicsDto.soliderAnchorPic4 = this.photos[7];
    this.photos = [];
    this.displayPhotosDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Photos Saved',
      detail: 'All photos have been saved successfully.',
    });
  }
}
