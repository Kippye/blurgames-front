import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorsComponent } from '../validation/validation.errors';
import { ProjectService } from '../projects/project.service';
import { BaseFormControlComponent } from '../../base/forms/form-control.comp';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProjectTypeService } from '../project-types/project-type.service';
import { map, tap } from 'rxjs';
import { GenreService } from '../genres/genre.service';
import { TagService } from '../tags/tag.service';
import { ProjectDetailsService } from '../project-details/project-details.service';
import { SearchSelectDropdownComponent } from '../../base/forms/search-select-dropdown.comp';
import { QuerySelectDropdownComponent } from '../../base/forms/query-select-dropdown.comp';
import { IProjectDetails } from '../project-details/project-details.types';
import { IAuthor } from '../authors/author.types';
import { AuthorService } from '../authors/author.service';
import { IProjectUpload } from '../projects/project.types';
import { Router } from '@angular/router';
import { IProjectAuthorItem } from '../project-authors/project-author.types';

@Component({
  selector: 'app-upload-project',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ValidationErrorsComponent,
    BaseFormControlComponent,
    SearchSelectDropdownComponent,
    QuerySelectDropdownComponent,
  ],
  template: `
    <div class="row justify-content-center">
      <div class="col-6">
        <h1 class="page-title">Upload Project</h1>
        @if (isLoadingFormData()) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        } @else if (loadingErrors().length > 0) {
          <div class="alert alert-danger">
            @for (error of loadingErrors(); track error) {
              <p>{{ error }}</p>
            }
          </div>
        } @else {
          <form [formGroup]="form" class="form-group" (ngSubmit)="submit()" novalidate>
            <app-form-control inputId="title" label="Title" required>
              <input
                id="title"
                type="text"
                class="form-control"
                required
                formControlName="title"
                [class.is-invalid]="form.get('title')?.touched && form.controls.title.invalid"
              />
            </app-form-control>
            <app-validation-errors [control]="form.controls.title" [submitted]="submitted()" />
            <app-form-control inputId="projectType" label="Project Type" required>
              <select
                id="projectType"
                class="form-control"
                required
                formControlName="projectTypeId"
                [class.is-invalid]="
                  form.get('projectTypeId')?.touched && form.controls.projectTypeId.invalid
                "
              >
                @for (projectType of projectTypesResource.value()!.items; track projectType.id) {
                  <option [value]="projectType.id">{{ projectType.projectTypeName }}</option>
                }
              </select>
            </app-form-control>
            <app-validation-errors
              [control]="form.controls.projectTypeId"
              [submitted]="submitted()"
            />
            <app-form-control inputId="relatedProject" label="Related Project">
              <app-query-select-dropdown
                [fetcher]="detailsFetcher"
                inputId="relatedProject"
                nameProperty="title"
                formControlName="relatedProjectId"
                [class.is-invalid]="
                  form.get('relatedProjectId')?.touched && form.controls.relatedProjectId.invalid
                "
              />
            </app-form-control>
            <app-validation-errors
              [control]="form.controls.relatedProjectId"
              [submitted]="submitted()"
            />
            <app-form-control inputId="authors" label="Authors">
              <app-query-select-dropdown
                [fetcher]="authorFetcher"
                [selectedItems]="authorMap()"
                (selectItem)="addAuthor($event)"
                (deselectItem)="removeAuthor($event.id)"
                inputId="authors"
                nameProperty="displayName"
                hideSelected
                multiselect
              />
            </app-form-control>
            <div class="mt-2 mb-3">
              @for (item of projectAuthors(); track item.authorId) {
                <div class="mb-2 text-start border rounded">
                  <div class="row mx-0 w-100 justify-content-start align-items-center">
                    <div class="col-auto">
                      <strong class="author-name px-2" aria-label="Author name">{{
                        item.authorName
                      }}</strong>
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">
                      <button
                        class="btn btn-link btn-sm"
                        type="button"
                        (click)="removeAuthor(item.authorId)"
                        [aria-label]="'Remove author ' + item.authorName"
                        style="--bs-btn-padding-y: .2rem; --bs-btn-padding-x: .5rem;"
                      >
                        <i
                          class="bi bi-person-x-fill"
                          style="font-size: 1.25rem; color: crimson;"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <input
                    class="form-control"
                    [id]="getCreditInputId(item)"
                    type="text"
                    maxlength="60"
                    placeholder="Contributed..."
                    [ngModel]="item.contributionCredit"
                    (ngModelChange)="setAuthorCredit(item.authorId, $event)"
                    [ngModelOptions]="{ standalone: true }"
                    (keydown.enter)="$event.preventDefault()"
                    [aria-label]="'Contribution credit for ' + item.authorName"
                  />
                </div>
              }
            </div>
            <app-form-control inputId="genres" label="Genres">
              <app-search-select-dropdown
                inputId="genres"
                [(selectedItemIds)]="form.controls.genres.value"
                [items]="genresResource.value()!.items"
                nameProperty="genreName"
                descriptionProperty="genreDescription"
                multiselect
              >
              </app-search-select-dropdown>
            </app-form-control>
            <app-form-control inputId="tags" label="Tags">
              <app-search-select-dropdown
                inputId="tags"
                [(selectedItemIds)]="form.controls.tags.value"
                [items]="tagsResource.value()!.items"
                nameProperty="tagName"
                descriptionProperty="tagDescription"
                multiselect
              >
              </app-search-select-dropdown>
            </app-form-control>
            <app-form-control inputId="shortDescription" label="Short Description">
              <input
                type="text"
                id="shortDescription"
                formControlName="shortDescription"
                class="form-control"
                autocomplete="off"
                [class.is-invalid]="
                  form.get('shortDescription')?.touched && form.controls.shortDescription.invalid
                "
              />
            </app-form-control>
            <app-validation-errors
              [control]="form.controls.shortDescription"
              [submitted]="submitted()"
            />
            <app-form-control inputId="description" label="Description">
              <textarea
                id="description"
                formControlName="description"
                class="form-control"
                autocomplete="off"
                [class.is-invalid]="
                  form.get('description')?.touched && form.controls.description.invalid
                "
              >
              </textarea>
            </app-form-control>
            <app-validation-errors
              [control]="form.controls.description"
              [submitted]="submitted()"
            />
            @if (uploadError()) {
              <div class="alert alert-danger">
                {{ uploadError() }}
              </div>
            }
            <div class="mt-4">
              <button type="submit" class="btn btn-primary bg-gradient btn-block w-100">
                Upload
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: `
    .form-group {
      margin-bottom: 1rem;
    }
  `,
})
export class UploadProjectComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);
  private readonly detailsService = inject(ProjectDetailsService);
  private readonly projectTypeService = inject(ProjectTypeService);
  private readonly genreService = inject(GenreService);
  private readonly tagService = inject(TagService);
  private readonly authorService = inject(AuthorService);

  readonly projectAuthors = signal<IProjectAuthorItem[]>([]);
  readonly submitted = signal(false);
  readonly uploadError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(70)]],
    projectTypeId: ['', [Validators.required]],
    relatedProjectId: [new Map<string, IProjectDetails>()],
    shortDescription: ['', [Validators.maxLength(60)]],
    description: ['', [Validators.maxLength(1000)]],
    genres: [[] as string[]],
    tags: [[] as string[]],
  });

  projectTypesResource = rxResource({
    stream: () =>
      this.projectTypeService.getPaged({ sort: [{ property: 'name' }] }).pipe(
        tap((projectTypes) => {
          if (projectTypes.items.length > 0) {
            this.form.controls.projectTypeId.setValue(projectTypes.items[0].id);
          }
        }),
      ),
  });

  genresResource = rxResource({
    stream: () => this.genreService.getPaged({ sort: [{ property: 'name' }] }),
  });

  tagsResource = rxResource({
    stream: () => this.tagService.getPaged({ sort: [{ property: 'name' }] }),
  });

  isLoadingFormData = computed(
    () =>
      this.projectTypesResource.isLoading() ||
      this.genresResource.isLoading() ||
      this.tagsResource.isLoading(),
  );

  loadingErrors = computed(() => {
    const errors: string[] = [];

    if (this.projectTypesResource.error()) {
      errors.push('Error loading project types: ' + this.projectTypesResource.error()!.message);
    }
    if (this.genresResource.error()) {
      errors.push('Error loading genres: ' + this.genresResource.error()!.message);
    }
    if (this.tagsResource.error()) {
      errors.push('Error loading tags: ' + this.tagsResource.error()!.message);
    }

    return errors;
  });

  authorFetcher = (query: string) =>
    this.authorService
      .getPaged({
        filter: {
          logic: 'and',
          conditions: [
            // TODO: Should this filter by isActive or allow adding inactive authors to projects?
            { property: 'displayName', operator: 'contains', value: query },
            {
              property: 'id',
              operator: 'isNotIn',
              value: Array.from(this.authorMap().keys()),
            },
          ],
        },
        sort: [{ property: 'name' }],
        page: { page: 1, pageSize: 5 },
      })
      .pipe(map((paged) => paged.items));

  // NOTE: We only fetch details here since details contain project ID anyway.
  // TODO: Ensure that there is only one (most recent) details per project. (i guess this is the API's job)
  // We use projectId as key in @for so it better be unique.
  detailsFetcher = (query: string) =>
    this.detailsService
      .getPaged({
        filter: {
          logic: 'and',
          conditions: [
            { property: 'publishedAt', operator: 'isNotNull' },
            { property: 'activeUntil', operator: 'isNull' },
            { property: 'title', operator: 'contains', value: query },
            {
              property: 'id',
              operator: 'isNotIn',
              value: Array.from(this.form.controls.relatedProjectId.value!.keys()),
            },
          ],
        },
        sort: [{ property: 'title' }],
        page: { page: 1, pageSize: 5 },
      })
      .pipe(map((paged) => paged.items));

  // Just a readonly mapping from projectAuthors to keep the search element in sync
  readonly authorMap = computed(() => {
    const m = new Map<string, IAuthor>();
    for (const a of this.projectAuthors()) {
      m.set(a.authorId, { id: a.authorId, displayName: a.authorName } as IAuthor);
    }
    return m;
  });

  getCreditInputId(entry: IProjectAuthorItem) {
    return `author-credit-${entry.authorId}`;
  }

  addAuthor(author: IAuthor) {
    this.projectAuthors.update((list) =>
      list.some((a) => a.authorId === author.id)
        ? list
        : [
            ...list,
            { authorId: author.id, authorName: author.displayName, contributionCredit: '' },
          ],
    );
  }

  removeAuthor(authorId: string) {
    this.projectAuthors.update((list) => list.filter((a) => a.authorId !== authorId));
  }

  setAuthorCredit(authorId: string, credit: string) {
    this.projectAuthors.update((list) =>
      list.map((a) => (a.authorId === authorId ? { ...a, contributionCredit: credit } : a)),
    );
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.submitted.update((v) => !v);
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();

    const projectUpload: IProjectUpload = {
      project: {
        projectTypeId: formValue.projectTypeId,
        relatedProjectId: Array.from(formValue.relatedProjectId.values())[0]?.projectId,
      },
      projectDetails: {
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        description: formValue.description,
        genres: formValue.genres.map((id, index) => ({ genreId: id, orderIndex: index })),
        tags: formValue.tags.map((id, index) => ({ tagId: id, orderIndex: index })),
      },
      authors: this.projectAuthors().map((a) => ({
        authorId: a.authorId,
        contributionCredit: a.contributionCredit,
      })),
    };

    this.projectService.upload(projectUpload).subscribe({
      next: (uploaded) => {
        // TODO: Redirect to project page instead
        this.router.navigateByUrl('/projects');
        console.log(uploaded);
        this.form.reset();
      },
      error: (error: Error) => {
        this.uploadError.set(error!.message);
      },
    });
  }
}
