interface IUser {
  login: string;
}
export interface IPullRequest {
  number: number;
  head: {
    ref: string;
  };
  user: IUser;
  requested_reviewers: IUser[];
}
