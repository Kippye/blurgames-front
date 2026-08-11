export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1/',
  // TODO: I don't really wanna HAVE to redefine all of them here
  // It should be more like overrides
  API_REGISTER_ENDPOINT: 'Identity/Account/Register',
  API_LOGIN_ENDPOINT: 'Identity/Account/Login',
  API_LOGOUT_ENDPOINT: 'Identity/Account/Logout',
  API_REFRESH_ENDPOINT: 'Identity/Account/RefreshToken',
  API_AUTHOR_ENDPOINT: 'Author',
  API_AUTHOR_ROLE_ENDPOINT: 'AuthorRole',
  API_GENRE_ENDPOINT: 'Genre',
  API_PROJECT_ENDPOINT: 'Project',
  API_PROJECT_AUTHOR_ENDPOINT: 'ProjectAuthor',
  API_PROJECT_AUTHOR_ROLE_ENDPOINT: 'ProjectAuthorRole',
  API_PROJECT_DETAILS_ENDPOINT: 'ProjectDetails',
  API_PROJECT_DETAILS_GENRE_ENDPOINT: 'ProjectDetailsGenre',
  API_PROJECT_DETAILS_TAG_ENDPOINT: 'ProjectDetailsTag',
  API_PROJECT_TYPE_ENDPOINT: 'ProjectType',
  API_TAG_ENDPOINT: 'Tag',
};
