import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModalComponent } from './shared-modal.component';
import { SharedModalService } from './shared-modal.service';

@NgModule({
  declarations: [SharedModalComponent],
  imports: [CommonModule],
  exports: [SharedModalComponent],
  providers: [SharedModalService]
})
export class SharedModalModule {}
