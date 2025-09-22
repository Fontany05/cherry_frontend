export interface MenuItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  external?: boolean;
  target?: '_blank' | '_self';
  className?: string;
}

export interface SocialLink {
  id: string;
  url: string;
  icon: string;
  label: string;
}
