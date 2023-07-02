import * as ChessboardHelper from './chessboardHelper'

const KING_MOVES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]
const BOARD_SIZE = 8

export function valid (
  board, rank1, file1, rank2, file2) {
  if (
    Math.abs(file1 - file2) > 1 ||
    Math.abs(rank1 - rank2) > 1
  ) {
    return false
  }
  return true
}

export async function getMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const kingMoves = []
  for (const offset of KING_MOVES) {
    const newFile = file + offset[0]
    const newRank = rank + offset[1]
    if (newFile >= 0 &&
      newFile < BOARD_SIZE &&
      newRank >= 0 &&
      newRank < BOARD_SIZE &&
      await ChessboardHelper.validateMove(
        board,
        file,
        rank,
        newFile,
        newRank,
        includeOnlyAttacks
      )
    ) {
      kingMoves.push({
        rank: newRank,
        file: newFile
      })
    }
    if (!board.squares[rank][file].moved &&
      !includeOnlyAttacks) {
      for (const castleMove of [-2, 2]) {
        const newFile = file + castleMove
        if (newFile >= 0 &&
          newFile < BOARD_SIZE &&
          await ChessboardHelper.validateMove(
            board,
            file,
            rank,
            newFile,
            rank,
            includeOnlyAttacks
          )) {
          kingMoves.push({
            rank,
            file: newFile
          })
        }
      }
    }
  }
  return kingMoves
}

export async function validCastling (
  board, file1, rank1, file2, rank2) {
  const thisPiece = board.squares[rank1][file1]
  if (thisPiece.piece === 'King' && !thisPiece.moved) {
    if (rank2 === rank1 && Math.abs(file2 - file1) === 2) {
      const attackedSquares =
        await ChessboardHelper.getAllMoves(
          board, !thisPiece.isWhite, true)
      if (attackedSquares.has(`${rank1}${file1}`)) {
        return 0
      } else if (thisPiece.isWhite) {
        if (file2 === 2) {
          if (board.squares[7][0] &&
            !board.squares[7][0].moved &&
            !board.squares[7][1] &&
            !board.squares[7][2] &&
            !board.squares[7][3] &&
            !attackedSquares.has('73') &&
            !attackedSquares.has('72')) {
            return 2
          }
        } else {
          if (board.squares[7][7] &&
            !board.squares[7][7].moved &&
            !board.squares[7][6] &&
            !board.squares[7][5] &&
            !attackedSquares.has('75') &&
            !attackedSquares.has('76')) {
            return 1
          }
        }
      } else {
        if (file2 === 2) {
          if (board.squares[0][0] &&
            !board.squares[0][0].moved &&
            !board.squares[0][1] &&
            !board.squares[0][2] &&
            !board.squares[0][3] &&
            !attackedSquares.has('03') &&
            !attackedSquares.has('02')) {
            return 4
          }
        } else {
          if (board.squares[0][7] &&
            !board.squares[0][7].moved &&
            !board.squares[0][6] &&
            !board.squares[0][5] &&
            !attackedSquares.has('05') &&
            !attackedSquares.has('06')) {
            return 3
          }
        }
      }
    }
  }
  return 0
}
