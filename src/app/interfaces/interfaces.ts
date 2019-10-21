export interface DialogField {
  title: string;
  type: string;
  value: string;
  hint?: string;
}

export interface DialogOptions {
  title: string;
  content: string;
  fields?: DialogField[];
  ok: string;
  cancel?: string;
}

export interface StatusResult {
  status: string;
}

export interface LoginData {
  username: string;
  pass: string;
}

export interface LoginResult {
  status: string;
  id: number;
  username: string;
  token: string;
}

export interface RegisterData {
  username: string;
  pass: string;
  conf: string;
}