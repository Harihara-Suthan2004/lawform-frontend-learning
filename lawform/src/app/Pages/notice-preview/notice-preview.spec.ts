import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePreview } from './notice-preview';

describe('NoticePreview', () => {
  let component: NoticePreview;
  let fixture: ComponentFixture<NoticePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
