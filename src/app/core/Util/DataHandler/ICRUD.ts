export interface ICRUD {
  create(): Function;
  read(source: string): string | false;
  update(): Function;
  delete(): Function;
}
