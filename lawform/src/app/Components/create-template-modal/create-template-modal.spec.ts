import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplateModal } from './create-template-modal';

describe('CreateTemplateModal', () => {
  let component: CreateTemplateModal;
  let fixture: ComponentFixture<CreateTemplateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTemplateModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTemplateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
