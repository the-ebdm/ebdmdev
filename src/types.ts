export default interface HTMX {
  method: string;
  path: string;
  swap?: string;
  target?: string;
  pushUrl?: boolean;
}