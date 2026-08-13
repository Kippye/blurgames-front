import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreAddModalComponent } from './genre.add-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GenreAddModalComponent', () => {
  let component: GenreAddModalComponent;
  let fixture: ComponentFixture<GenreAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      imports: [GenreAddModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreAddModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
