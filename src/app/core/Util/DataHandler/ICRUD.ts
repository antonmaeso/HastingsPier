export interface ICRUD {
  create(Path: string, contents?: string): boolean;
  read(source: string): string | false;
  update(): Function;
  delete(): Function;
}
