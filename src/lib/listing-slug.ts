export function slugifyListingTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getListingPath(title: string): string {
  return `/listing/${slugifyListingTitle(title)}`;
}

