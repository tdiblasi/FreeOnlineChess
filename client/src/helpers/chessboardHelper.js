import * as Rook from './rookHelper'
import * as Bishop from './bishopHelper'
import * as King from './kingHelper'
import * as Knight from './knightHelper'
import * as Pawn from './pawnHelper'
import * as Queen from './queenHelper'

const BOARD_SIZE = 8

export async function doMove (
  board,
  file1,
  rank1,
  file2,
  rank2,
  special,
  prepareNextMove
) {
  const thisPiece = board.squares[rank1][file1]
  if (!thisPiece.moved) {
    thisPiece.moved = true
  }
  board.squares[rank2][file2] = board.squares[rank1][file1]
  board.squares[rank1][file1] = null
  if (special.isEnPassant) {
    if (thisPiece.isWhite) {
      board.squares[rank2 + 1][file2] = null
    } else {
      board.squares[rank2 - 1][file2] = null
    }
  }
  board.enPassantable = []
  if (special.isTwoSquarePawnMove) {
    board.enPassantable =
      [file2, rank2 + (thisPiece.isWhite ? 1 : -1)]
  } else if (special.castle) {
    switch (special.castle) {
      case 1:
        board.squares[7][5] = board.squares[7][7]
        board.squares[7][7] = null
        break

      case 2:
        board.squares[7][3] = board.squares[7][0]
        board.squares[7][0] = null
        break

      case 3:
        board.squares[0][5] = board.squares[0][7]
        board.squares[0][7] = null
        break

      case 4:
        board.squares[0][3] = board.squares[0][0]
        board.squares[0][0] = null
        break
    }
  }
  if (thisPiece.piece === 'Pawn' &&
    rank2 === (thisPiece.isWhite
      ? 0
      : 7)) {
    thisPiece.piece = 'Queen'
  }
  if (prepareNextMove) {
    if (await inCheck(board, !thisPiece.isWhite)) {
      board.check = thisPiece.isWhite ? 'black' : 'white'
    } else {
      board.check = false
    }
    board.possibleMoves =
      await getAllMoves(board, !thisPiece.isWhite, false)
    if (
      board.possibleMoves.size === 0
    ) {
      console.log('End')
      board.gameOver = board.check
        ? thisPiece.isWhite
          ? 'White Wins'
          : 'Black Wins'
        : 'Stalemate'
    } else {
      console.log(
        await getAllMoves(board, !thisPiece.isWhite, false))
    }
  }
}

export async function getPiecesMoves (
  board,
  file,
  rank,
  includeOnlyAttacks
) {
  const thisPiece = board.squares[rank][file]
  let moves = []
  switch (thisPiece.piece) {
    case 'Pawn':
      await Pawn.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks
      )
        .then(pawnMoves => {
          moves = pawnMoves
        })
      break

    case 'Rook':
      await Rook.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(rookMoves => {
          moves = rookMoves
        })
      break

    case 'Knight':
      await Knight.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(knightMoves => {
          moves = knightMoves
        })
      break

    case 'Bishop':
      await Bishop.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(bishopMoves => {
          moves = bishopMoves
        })
      break

    case 'Queen':
      await Queen.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(values => {
          for (const arr of values) {
            for (const move of arr) {
              moves.push(move)
            }
          }
        })
      break

    case 'King':
      await King.getMoves(
        board,
        file,
        rank,
        includeOnlyAttacks
      )
        .then(kingMoves => {
          moves = kingMoves
        })
      break

    default:
  }
  return moves
}

export async function getAllMoves (
  board,
  whiteMove,
  includeOnlyAttacks
) {
  const possibleMoves = new Set()
  for (let rank = 0; rank < BOARD_SIZE; rank++) {
    for (let file = 0; file < BOARD_SIZE; file++) {
      const piece = board.squares[rank][file]
      if (piece && piece.isWhite === whiteMove) {
        const myMoves =
          await getPiecesMoves(
            board, file, rank, includeOnlyAttacks)
        myMoves.forEach(move => {
          possibleMoves.add(`${move.rank}${move.file}`)
        })
      }
    }
  }
  return possibleMoves
}

export async function validateMove (
  board,
  file1,
  rank1,
  file2,
  rank2,
  includeOnlyAttacks
) {
  let valid = false
  let isTwoSquarePawnMove = false
  let isEnPassant = false
  let castle = false
  const thisPiece = board.squares[rank1][file1]
  const attackedPiece = board.squares[rank2][file2]
  if ((
    rank1 === rank2 &&
      file1 === file2
  ) ||
    (attackedPiece &&
    attackedPiece.isWhite === thisPiece.isWhite)) {
    return false
  }
  switch (thisPiece.piece) {
    case 'Bishop':
      valid = Bishop.valid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'King':
      valid = King.valid(
        board, rank1, file1, rank2, file2
      )
      castle =
        await King.validCastling(
          board,
          file1,
          rank1,
          file2,
          rank2
        )
      if (castle) {
        valid = { castle }
      }
      break

    case 'Knight':
      valid = Knight.valid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'Pawn':
      valid = Pawn.valid(
        board,
        rank1,
        file1,
        rank2,
        file2,
        thisPiece,
        attackedPiece
      )
      isTwoSquarePawnMove =
        !includeOnlyAttacks &&
        Pawn.validTwoSquarePawnMove(
          board,
          file1,
          rank1,
          file2,
          rank2
        )
      if (isTwoSquarePawnMove) {
        valid = { isTwoSquarePawnMove: true }
      } else if (board.enPassantable.length > 0) {
        isEnPassant =
          Pawn.validEnPassant(
            board,
            file1,
            rank1,
            file2,
            rank2
          )
        if (isEnPassant) {
          valid = { isEnPassant: true }
        }
      }
      break

    case 'Queen':
      valid = Queen.valid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'Rook':
      valid = Rook.valid(
        board, rank1, file1, rank2, file2
      )
      break

    default:
      valid = true
  }
  if (valid && !includeOnlyAttacks) {
    return await testForCheck(
      board, file1, rank1, file2, rank2, valid)
      ? false
      : valid
  }
  return valid
}

export async function testForCheck (
  board,
  file1,
  rank1,
  file2,
  rank2,
  special
) {
  const testBoard = await copyBoard(board)
  await doMove(
    testBoard, file1, rank1, file2, rank2, special)
  const checkFound =
    await inCheck(
      testBoard,
      testBoard.squares[rank2][file2].isWhite
    )
  return checkFound
}

export async function inCheck (board, whiteIsAttacked) {
  let kingSquare = null
  const moveSet =
    await getAllMoves(
      board, !whiteIsAttacked, true)
  for (let rank = 0; rank < BOARD_SIZE; rank++) {
    for (let file = 0; file < BOARD_SIZE; file++) {
      if (!kingSquare) {
        const thisPiece = board.squares[rank][file]
        if (
          thisPiece &&
          thisPiece.piece === 'King' &&
          thisPiece.isWhite === whiteIsAttacked) {
          kingSquare = `${rank}${file}`
        }
      }
    }
  }
  return moveSet.has(kingSquare)
}

async function copyBoard (oldBoard) {
  const newBoard = { ...oldBoard, squares: [] }
  let count = 0
  for await (const rank of oldBoard.squares) {
    newBoard.squares.push([])
    for await (const square of rank) {
      if (square) {
        newBoard.squares[count].push(
          { ...square }
        )
      } else {
        newBoard.squares[count].push(null)
      }
    }
    count++
  }
  return newBoard
}
