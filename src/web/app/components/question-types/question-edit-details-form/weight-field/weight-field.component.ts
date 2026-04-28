import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * The input field to specify weights for Mcq/Msq options.
 */
@Component({
  selector: 'tm-weight-field',
  templateUrl: './weight-field.component.html',
  styleUrls: ['./weight-field.component.scss'],
  imports: [FormsModule],
})
export class WeightFieldComponent {

  @Input()
  isEditable: boolean = false;

  @Input()
  weight: number | null = null;

  @Output()
  weightEntered: EventEmitter<any> = new EventEmitter();

  /**
   * Emit the weight entered to the parent component.
   */
  onWeightEntered(weight: number | string | null): void {
    this.weightEntered.emit(weight === '' ? null : weight);
  }
}
