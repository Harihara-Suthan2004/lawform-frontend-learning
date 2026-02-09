import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedNotice } from './created-notice';

describe('CreatedNotice', () => {
  let component: CreatedNotice;
  let fixture: ComponentFixture<CreatedNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedNotice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedNotice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
