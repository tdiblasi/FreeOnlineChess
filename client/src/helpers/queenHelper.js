import * as Bishop from './bishopHelper'
import * as Rook from './rookHelper'

export function valid (board, rank1, file1, rank2, file2) {
  return Bishop.valid(board, rank1, file1, rank2, file2) ||
  Rook.valid(board, rank1, file1, rank2, file2)
}

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  return await Promise.all([
    await Rook.getMoves(
      board, file, rank, includeOnlyAttacks),
    await Bishop.getMoves(
      board, file, rank, includeOnlyAttacks)
  ])
}
