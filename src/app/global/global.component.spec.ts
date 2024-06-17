import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalComponent } from './global.component';

describe('GlobalComponent', () => {
  let component: GlobalComponent;
  let fixture: ComponentFixture<GlobalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalComponent]
    });
    fixture = TestBed.createComponent(GlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
