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
});
