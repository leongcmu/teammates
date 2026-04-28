import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightFieldComponent } from './weight-field.component';

describe('WeightFieldComponent', () => {
  let component: WeightFieldComponent;
  let fixture: ComponentFixture<WeightFieldComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert empty string to null', () => {
    let emittedValue: number | null = 0;
    component.weightEntered.subscribe((value: number | null) => {
      emittedValue = value;
    });

    component.onWeightEntered('');

    expect(emittedValue).toBeNull();
  });

  it('should emit numeric value when valid number is entered', () => {
    let emittedValue: number | null = null;
    component.weightEntered.subscribe((value: number | null) => {
      emittedValue = value;
    });

    component.onWeightEntered(1.5);

    expect(emittedValue).toBe(1.5);
  });

  it('should display empty when weight is null', () => {
    component.weight = null;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('');
  });

  it('should display numeric value when weight is set', () => {
    component.weight = 2.5;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('2.5');
  });

  it('should handle zero weight correctly', () => {
    let emittedValue: number | null = null;
    component.weightEntered.subscribe((value: number | null) => {
      emittedValue = value;
    });

    component.onWeightEntered(0);

    expect(emittedValue).toBe(0);
  });

  it('should not crash when input is empty string', () => {
    expect(() => {
      component.onWeightEntered('');
    }).not.toThrow();
  });
});
