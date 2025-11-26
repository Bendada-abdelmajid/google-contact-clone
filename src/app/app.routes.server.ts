import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
    path: 'person/:id',
    renderMode: RenderMode.Server,
  },
    {
    path: 'person/:id/edit',
    renderMode: RenderMode.Server,
  },
    {
    path: 'label/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
