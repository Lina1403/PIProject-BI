import { Component } from '@angular/core';

@Component({
  selector: 'app-human-detection',
  templateUrl: './human-detection.component.html',
})
export class HumanDetectionComponent {
  videoUrl: string | null = null;

  uploadVideo() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'video/*';

    inputElement.click();

    inputElement.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        this.videoUrl = fileUrl;
      }
    };
  }
}
