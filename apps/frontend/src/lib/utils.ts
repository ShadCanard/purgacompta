// Fonctions utilitaires pour la gestion des montants et autres helpers

export function formatDollar(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '$0';
  return '$' + Number(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
