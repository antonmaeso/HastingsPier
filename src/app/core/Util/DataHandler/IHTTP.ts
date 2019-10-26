export interface IHTTP {
  post(): Function;
  get(source: string): Promise<any>;
  put(): Function;
  delete(): Function;
}
