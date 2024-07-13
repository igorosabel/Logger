import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'mcd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export default class ConfirmDialogComponent {
  public dialogRef: MatDialogRef<ConfirmDialogComponent> = inject(MatDialogRef);

  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public ok: WritableSignal<string> = signal<string>('Continue');
  public cancel: WritableSignal<string> = signal<string>('Cancel');
}
