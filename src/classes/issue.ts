import {isLabeled} from '../functions/is-labeled';
import {isPullRequest} from '../functions/is-pull-request';
import {IAssignee} from '../interfaces/assignee';
import {IIssue} from '../interfaces/issue';
import {IIssuesProcessorOptions} from '../interfaces/issues-processor-options';
import {ILabel} from '../interfaces/label';
import {IMilestone} from '../interfaces/milestone';
import {IPullRequest} from '../interfaces/pull-request';
import {IsoDateString} from '../types/iso-date-string';
import {Operations} from './operations';

export class Issue implements IIssue {
  private readonly _options: IIssuesProcessorOptions;
  readonly title: string;
  readonly number: number;
  created_at: IsoDateString;
  updated_at: IsoDateString;
  readonly labels: ILabel[];
  pull_request: Object | null | undefined | void | IPullRequest;
  readonly state: string | 'closed' | 'open';
  readonly locked: boolean;
  readonly milestone: IMilestone | undefined;
  readonly assignees: IAssignee[];
  isStale: boolean;
  operations = new Operations();

  get isPullRequest(): boolean {
    return isPullRequest(this);
  }

  get staleLabel(): string {
    return this._getStaleLabel();
  }

  get hasAssignees(): boolean {
    return this.assignees.length > 0;
  }

  constructor(
    options: Readonly<IIssuesProcessorOptions>,
    issue: Readonly<IIssue>
  ) {
    this._options = options;
    this.title = issue.title;
    this.number = issue.number;
    this.created_at = issue.created_at;
    this.updated_at = issue.updated_at;
    this.labels = issue.labels;
    this.pull_request = issue.pull_request;
    this.state = issue.state;
    this.locked = issue.locked;
    this.milestone = issue.milestone;
    this.assignees = issue.assignees;

    this.isStale = isLabeled(this, this.staleLabel);
  }

  private _getStaleLabel(): string {
    return this.isPullRequest
      ? this._options.stalePrLabel
      : this._options.staleIssueLabel;
  }
}
