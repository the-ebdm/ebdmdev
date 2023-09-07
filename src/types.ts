export interface HTMX {
  method: string;
  path: string;
  swap?: string;
  target?: string;
  pushUrl?: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  htmx?: HTMX;
}