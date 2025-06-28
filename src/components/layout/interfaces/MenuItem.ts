export interface MenuItem {
  id?: string;
  title: string;
  icon: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
}