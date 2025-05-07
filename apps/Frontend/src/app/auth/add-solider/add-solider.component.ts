import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SoliderDto } from '../../dto/solider.dto';
import { addSolider, addSoliderPics } from '../../store';
import { MessageService } from 'primeng/api';
import { SoliderPicsDto } from '../../dto/solider-pics.dto';
import { io } from 'socket.io-client';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-register',
  templateUrl: './add-solider.component.html',
  styleUrls: ['./add-solider.component.css'],
  providers: [MessageService],
})
export class AddSoliderComponent implements OnInit, OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLCanvasElement>;
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
  private faceDetectionInterval: any;
  private isFaceDetected = false;
  private currentFaceBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null = null;

  numberOfPhotos = 8;

  constructor(private store: Store, private messageService: MessageService) {}

  async ngOnInit() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('stop_video');
    await this.loadFaceDetectionModels();
  }

  private async loadFaceDetectionModels() {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load face detection models',
      });
    }
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
      this.startFaceDetection();
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

  private startFaceDetection() {
    this.faceDetectionInterval = setInterval(async () => {
      if (!this.video.nativeElement || !this.overlay.nativeElement) return;

      const detections = await faceapi
        .detectAllFaces(
          this.video.nativeElement,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks();

      const overlay = this.overlay.nativeElement;
      const context = overlay.getContext('2d');
      if (!context) return;

      // Clear previous drawings
      context.clearRect(0, 0, overlay.width, overlay.height);

      if (detections.length > 0) {
        const detection = detections[0];
        const box = detection.detection.box;
        this.currentFaceBox = box;
        this.isFaceDetected = true;

        // Draw face detection box
        context.strokeStyle = '#0000FF';
        context.lineWidth = 2;
        context.strokeRect(box.x, box.y, box.width, box.height);
      } else {
        this.isFaceDetected = false;
        this.currentFaceBox = null;
      }
    }, 100);
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
    if (!context || !this.currentFaceBox) return;

    // Set canvas size to match Python's 200x200 output
    canvas.width = 200;
    canvas.height = 200;

    // Calculate the face region with the same padding as Python code
    const x = this.currentFaceBox.x; // Add 22px padding from left
    const y = this.currentFaceBox.y - 30; // No top padding
    const width = this.currentFaceBox.width; // Subtract 22px from each side
    const height = this.currentFaceBox.height + 30; // Add 30px to bottom

    // Draw the face region
    context.drawImage(video, x, y, width, height, 0, 0, 200, 200);

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
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
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
