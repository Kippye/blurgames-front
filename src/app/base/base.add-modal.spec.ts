import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseAddModal } from './base.add-modal';

describe('BaseAddModal', () => {
  let component: BaseAddModal;
  let fixture: ComponentFixture<BaseAddModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseAddModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseAddModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
