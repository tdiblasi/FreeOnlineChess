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
  console.log(await inCheck(board, !thisPiece.isWhite))
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

// piece moves from (rank1, file1) to (rank2, file2)
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
      valid = bishopValid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'King':
      valid = kingValid(
        board, rank1, file1, rank2, file2
      )
      castle =
        await handleCastling(
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
      valid = knightValid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'Pawn':
      valid = pawnValid(
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
        twoSquarePawnMove(
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
          enPassant(
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
      valid = queenValid(
        board, rank1, file1, rank2, file2
      )
      break

    case 'Rook':
      valid = rookValid(
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

function bishopValid (board, rank1, file1, rank2, file2) {
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

function kingValid (board, rank1, file1, rank2, file2) {
  if (
    Math.abs(file1 - file2) > 1 ||
    Math.abs(rank1 - rank2) > 1
  ) {
    return false
  }
  return true
}

function knightValid (board, rank1, file1, rank2, file2) {
  if (
    Math.abs(file1 - file2) < 3 &&
    Math.abs(rank1 - rank2) < 3 &&
    Math.abs(file1 - file2) +
    Math.abs(rank1 - rank2) === 3) {
    return true
  }
  return false
}

function pawnValid (
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

function rookValid (board, rank1, file1, rank2, file2) {
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

function queenValid (board, rank1, file1, rank2, file2) {
  return bishopValid(board, rank1, file1, rank2, file2) ||
  rookValid(board, rank1, file1, rank2, file2)
}

/*
  0: no castle
  1: white king's side
  2: white queen's side
  3: black king's side
  4: black queen's side
*/
export async function handleCastling (
  board, file1, rank1, file2, rank2) {
  const thisPiece = board.squares[rank1][file1]
  if (thisPiece.piece === 'King' && !thisPiece.moved) {
    if (rank2 === rank1 && Math.abs(file2 - file1) === 2) {
      const attackedSquares =
        await getAllMoves(board, !thisPiece.isWhite, true)
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

export function twoSquarePawnMove (
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

export function enPassant (
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
      await getPawnMoves(
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
      await getRookMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(rookMoves => {
          moves = rookMoves
        })
      break

    case 'Knight':
      await getKnightMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(knightMoves => {
          moves = knightMoves
        })
      break

    case 'Bishop':
      await getBishopMoves(
        board,
        file,
        rank,
        includeOnlyAttacks)
        .then(bishopMoves => {
          moves = bishopMoves
        })
      break

    case 'Queen':
      await Promise.all([
        await getRookMoves(
          board, file, rank, includeOnlyAttacks),
        await getBishopMoves(
          board, file, rank, includeOnlyAttacks)
      ]).then(values => {
        for (const arr of values) {
          for (const move of arr) {
            moves.push(move)
          }
        }
      })
      break

    case 'King':
      await getKingMoves(
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

async function getRookMoves (
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

async function getBishopMoves (
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
    console.log(board.squares[rank + i][file - i])
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

async function getKnightMoves (
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

async function getPawnMoves (
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

async function getKingMoves (
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
      await validateMove(
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
          await validateMove(
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

export async function inCheck (board, whiteIsAttacked) {
  let kingSquare = null
  const moveSet =
    await getAllMoves(board, !whiteIsAttacked, true)
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

async function testForCheck (
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
