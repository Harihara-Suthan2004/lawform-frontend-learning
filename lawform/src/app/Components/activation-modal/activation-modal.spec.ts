import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationModal } from './activation-modal';

describe('ActivationModal', () => {
  let component: ActivationModal;
  let fixture: ComponentFixture<ActivationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
