import { validateMove } from './chessboardHelper'

const BOARD_SIZE = 8

const KNIGHT_MOVES = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1]
]

export function valid (
  board, rank1, file1, rank2, file2) {
  if (
    Math.abs(file1 - file2) < 3 &&
    Math.abs(rank1 - rank2) < 3 &&
    Math.abs(file1 - file2) +
    Math.abs(rank1 - rank2) === 3) {
    return true
  }
  return false
}

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const knightMoves = []
  for (const offset of KNIGHT_MOVES) {
    const newFile = file + offset[0]
    const newRank = rank + offset[1]
    if (newFile >= 0 &&
      newFile < BOARD_SIZE &&
      newRank >= 0 &&
      newRank < BOARD_SIZE &&
      await validateMove(
        board,
        file,
        rank,
        newFile,
        newRank,
        includeOnlyAttacks
      )
    ) {
      knightMoves.push({
        rank: newRank,
        file: newFile
      })
    }
  }
  return knightMoves
}
