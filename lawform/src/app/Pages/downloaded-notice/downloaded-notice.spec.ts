import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadedNotice } from './downloaded-notice';

describe('DownloadedNotice', () => {
  let component: DownloadedNotice;
  let fixture: ComponentFixture<DownloadedNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadedNotice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadedNotice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
