import { validateMove } from './chessboardHelper'

const BOARD_SIZE = 8

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const pawnMoves = []
  const thisPiece = board.squares[rank][file]
  for (let i = -1; i < 2; i++) {
    const newFile = file + i
    if (newFile < BOARD_SIZE && newFile >= 0) {
      let newRank = rank + (thisPiece.isWhite ? -1 : 1)
      if (
        (!(i === 0 && includeOnlyAttacks) &&
        await validateMove(
          board,
          file,
          rank,
          newFile,
          newRank,
          includeOnlyAttacks
        )) ||
        (
          !includeOnlyAttacks &&
          newFile === board.enPassantable[0] &&
          newRank === board.enPassantable[1] &&
          await validateMove(
            board,
            file,
            rank,
            newFile,
            newRank,
            includeOnlyAttacks
          ))) {
        pawnMoves.push({ rank: newRank, file: newFile })
      }
      if (i === 0 && rank === (thisPiece.isWhite ? 6 : 1)) {
        newRank += (thisPiece.isWhite ? -1 : 1)
        if (await validateMove(
          board,
          file,
          rank,
          newFile,
          newRank,
          includeOnlyAttacks
        )) {
          pawnMoves.push({ rank: newRank, file: newFile })
        }
      }
    }
  }
  return pawnMoves
}

export function valid (
  board,
  rank1,
  file1,
  rank2,
  file2,
  thisPiece,
  attackedPiece) {
  let valid
  if (thisPiece.isWhite) {
    if (rank2 - rank1 === -1) {
      valid = (file1 === file2 && !attackedPiece) ||
        (Math.abs(file2 - file1) === 1 && attackedPiece)
    }
  } else {
    if (rank2 - rank1 === 1) {
      valid = (file1 === file2 && !attackedPiece) ||
      (Math.abs(file2 - file1) === 1 && attackedPiece)
    }
  }
  return valid
}

export function validEnPassant (
  board,
  file1,
  rank1,
  file2,
  rank2
) {
  if (board.enPassantable.length > 0) {
    if (board.enPassantable[0] === file2 &&
      board.enPassantable[1] === rank2) {
      if (board.squares[rank1][file1].isWhite) {
        if (Math.abs(file2 - file1) === 1 &&
          rank2 - rank1 === -1) {
          return true
        }
      } else {
        if (Math.abs(file2 - file1) === 1 &&
          rank2 - rank1 === 1) {
          return true
        }
      }
    }
  }
  return false
}

export function validTwoSquarePawnMove (
  board, file1, rank1, file2, rank2) {
  const thisPiece = board.squares[rank1][file1]
  if (thisPiece.isWhite) {
    if (rank2 - rank1 === -2 &&
      rank1 === 6 &&
      file1 === file2 &&
      !board.squares[rank1 - 1][file1] &&
      !board.squares[rank1 - 2][file1]) {
      return true
    }
  } else {
    if (rank2 - rank1 === 2 &&
      rank1 === 1 &&
      file1 === file2 &&
      !board.squares[rank1 + 1][file1] &&
      !board.squares[rank1 + 2][file1]) {
      return true
    }
  }
  return false
}
