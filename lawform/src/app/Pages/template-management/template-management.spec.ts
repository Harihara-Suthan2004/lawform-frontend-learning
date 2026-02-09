import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateManagement } from './template-management';

describe('TemplateManagement', () => {
  let component: TemplateManagement;
  let fixture: ComponentFixture<TemplateManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
