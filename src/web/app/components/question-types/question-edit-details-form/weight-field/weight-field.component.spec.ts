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

  it('should emit null for empty weight', () => {
    const weightEnteredSpy: jest.SpyInstance = jest.spyOn(component.weightEntered, 'emit');

    component.onWeightEntered(null);

    expect(weightEnteredSpy).toHaveBeenCalledWith(null);
  });

  it('should emit numeric value when a weight is entered', () => {
    const weightEnteredSpy: jest.SpyInstance = jest.spyOn(component.weightEntered, 'emit');

    component.onWeightEntered(2.5);

    expect(weightEnteredSpy).toHaveBeenCalledWith(2.5);
  });

  it('should emit 0 for zero weight, distinct from null for empty weight', () => {
    const weightEnteredSpy: jest.SpyInstance = jest.spyOn(component.weightEntered, 'emit');

    component.onWeightEntered(0);
    component.onWeightEntered(null);

    expect(weightEnteredSpy).toHaveBeenNthCalledWith(1, 0);
    expect(weightEnteredSpy).toHaveBeenNthCalledWith(2, null);
  });
});
