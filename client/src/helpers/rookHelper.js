import { validateMove } from './chessboardHelper'
const BOARD_SIZE = 8

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const rookMoves = []
  let endSearch = false
  for (
    let newFile = file + 1;
    newFile < BOARD_SIZE && !endSearch;
    newFile++) {
    if (await validateMove(
      board, file, rank, newFile, rank, includeOnlyAttacks
    )) {
      rookMoves.push({ rank, file: newFile })
    }
    if (board.squares[rank][newFile]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let newFile = file - 1;
    newFile >= 0 && !endSearch;
    newFile--) {
    if (await validateMove(
      board, file, rank, newFile, rank, includeOnlyAttacks
    )) {
      rookMoves.push({ rank, file: newFile })
    }
    if (board.squares[rank][newFile]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let newRank = rank + 1;
    newRank < BOARD_SIZE && !endSearch;
    newRank++) {
    if (await validateMove(
      board, file, rank, file, newRank, includeOnlyAttacks
    )) {
      rookMoves.push({ rank: newRank, file })
    }
    if (board.squares[newRank][file]) {
      endSearch = true
    }
  }

  endSearch = false
  for (
    let newRank = rank - 1;
    newRank >= 0 && !endSearch;
    newRank--) {
    if (await validateMove(
      board, file, rank, file, newRank, includeOnlyAttacks
    )) {
      rookMoves.push({ rank: newRank, file })
    }
    if (board.squares[newRank][file]) {
      endSearch = true
    }
  }
  return rookMoves
}

export function valid (
  board, rank1, file1, rank2, file2) {
  if (
    file1 !== file2 && rank1 !== rank2
  ) {
    return false
  }
  switch (true) {
    case file2 > file1:
      for (let i = file1 + 1; i < file2; i++) {
        if (board.squares[rank2][i]) {
          return false
        }
      }
      break

    case file2 < file1:
      for (let i = file2 + 1; i < file1; i++) {
        if (board.squares[rank2][i]) {
          return false
        }
      }
      break

    case rank2 > rank1:
      for (let i = rank1 + 1; i < rank2; i++) {
        if (board.squares[i][file2]) {
          return false
        }
      }
      break

    case rank2 < rank1:
      for (let i = rank2 + 1; i < rank1; i++) {
        if (board.squares[i][file2]) {
          return false
        }
      }
      break

    default:
      break
  }
  return true
}
