import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticsComponent } from './statics.component';

describe('StaticsComponent', () => {
  let component: StaticsComponent;
  let fixture: ComponentFixture<StaticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaticsComponent]
    });
    fixture = TestBed.createComponent(StaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
