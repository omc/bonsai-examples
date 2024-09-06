export type SearchAuth = {
  username?: string;
  password?: string;
};

export type SearchConfig = {
  node?: string;
  auth: SearchAuth;
};
