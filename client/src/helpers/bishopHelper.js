import { validateMove } from './chessboardHelper'
const BOARD_SIZE = 8

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const bishopMoves = []

  let endSearch = false
  for (
    let i = 1;
    file + i < BOARD_SIZE &&
    rank + i < BOARD_SIZE &&
    !endSearch;
    i++) {
    if (await validateMove(
      board,
      file,
      rank,
      file + i,
      rank + i,
      includeOnlyAttacks
    )) {
      bishopMoves.push({ rank: rank + i, file: file + i })
    }
    if (board.squares[rank + i][file + i]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let i = 1;
    file + i < BOARD_SIZE &&
    rank - i >= 0 &&
    !endSearch;
    i++) {
    if (await validateMove(
      board,
      file,
      rank,
      file + i,
      rank - i,
      includeOnlyAttacks
    )) {
      bishopMoves.push({ rank: rank - i, file: file + i })
    }
    if (board.squares[rank - i][file + i]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let i = 1;
    file - i >= 0 &&
    rank + i < BOARD_SIZE &&
    !endSearch;
    i++) {
    if (await validateMove(
      board,
      file,
      rank,
      file - i,
      rank + i,
      includeOnlyAttacks
    )) {
      bishopMoves.push({ rank: rank + i, file: file - i })
    }
    if (board.squares[rank + i][file - i]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let i = 1;
    file - i >= 0 &&
    rank - i >= 0 &&
    !endSearch;
    i++) {
    if (await validateMove(
      board,
      file,
      rank,
      file - i,
      rank - i,
      includeOnlyAttacks
    )) {
      bishopMoves.push({ rank: rank - i, file: file - i })
    }
    if (board.squares[rank - i][file - i]) {
      endSearch = true
    }
  }
  return bishopMoves
}

export function valid (board, rank1, file1, rank2, file2) {
  if (
    Math.abs(file1 - file2) !==
    Math.abs(rank1 - rank2)
  ) {
    return false
  }
  const difference = Math.abs(file1 - file2)
  if (file2 > file1) {
    if (rank2 > rank1) {
      for (let i = 1; i < difference; i++) {
        if (board.squares[rank1 + i][file1 + i]) {
          return false
        }
      }
    } else {
      for (let i = 1; i < difference; i++) {
        if (board.squares[rank1 - i][file1 + i]) {
          return false
        }
      }
    }
  } else {
    if (rank2 > rank1) {
      for (let i = 1; i < difference; i++) {
        if (board.squares[rank1 + i][file1 - i]) {
          return false
        }
      }
    } else {
      for (let i = 1; i < difference; i++) {
        if (board.squares[rank1 - i][file1 - i]) {
          return false
        }
      }
    }
  }
  return true
}
