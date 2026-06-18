import type { SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

export function getPaginationMeta(paginator: SimplePaginatorMetaKeys) {
  return {
    total: Number(paginator.total),
    currentPage: Number(paginator.currentPage),
    lastPage: Number(paginator.lastPage),
  }
}
