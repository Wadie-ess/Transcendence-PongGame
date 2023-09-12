type emailType = {
  value: string;
};

export class IntraDto {
  id: string;
  username: string;
  emails: emailType[];
}
