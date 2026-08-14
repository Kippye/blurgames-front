import { TestBed } from '@angular/core/testing';

import { AuthorRoleService } from './author-role.service';

describe('AuthorRoleService', () => {
  let service: AuthorRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
