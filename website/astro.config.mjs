// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://cdrobayom.github.io',
  base: '/ops-report-ai',
  integrations: [
    starlight({
      title: 'ops-report-ai',
      description: 'Demostración de arquitectura sólida para reportes operativos en pymes',
      social: {
        github: 'https://github.com/CDROBAYOM/ops-report-ai',
      },
      sidebar: [
        {
          label: 'Contexto & Negocio',
          items: [
            { label: 'Caso de Referencia', slug: 'context/caso-referencia' },
            { label: 'Plan del Proyecto', slug: 'spec/plan' },
          ],
        },
        {
          label: 'Arquitectura C4',
          items: [
            { label: 'Nivel 1: Contexto', slug: 'architecture/01-context' },
            { label: 'Nivel 2: Contenedores', slug: 'architecture/02-containers' },
          ],
        },
        {
          label: 'ADRs (Decisiones)',
          autogenerate: { directory: 'adr' },
        },
      ],
    }),
  ],
});
