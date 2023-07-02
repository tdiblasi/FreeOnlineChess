import { React, useState, useEffect } from 'react'
import BoardSquare from '../components/BoardSquare'
import styled from 'styled-components'
import { useMousePosition } from '../hooks/useMousePosition'
import * as PieceImages from '../assets/images/pieces'
import * as ChessboardHelper from '../helpers/chessboardHelper'

const PIECE_IMAGES = {
  black: {
    Bishop: PieceImages.blackBishop,
    King: PieceImages.blackKing,
    Knight: PieceImages.blackKnight,
    Pawn: PieceImages.blackPawn,
    Queen: PieceImages.blackQueen,
    Rook: PieceImages.blackRook
  },
  white: {
    Bishop: PieceImages.whiteBishop,
    King: PieceImages.whiteKing,
    Knight: PieceImages.whiteKnight,
    Pawn: PieceImages.whitePawn,
    Queen: PieceImages.whiteQueen,
    Rook: PieceImages.whiteRook
  }
}

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const InitialBoard = [
  [
    { piece: 'Rook', isWhite: false, id: 'black-rook-a', moved: false },
    { piece: 'Knight', isWhite: false, id: 'black-knight-b' },
    { piece: 'Bishop', isWhite: false, id: 'black-bishop-c' },
    { piece: 'Queen', isWhite: false, id: 'black-queen' },
    { piece: 'King', isWhite: false, id: 'black-king', moved: false },
    { piece: 'Bishop', isWhite: false, id: 'black-bishop-f' },
    { piece: 'Knight', isWhite: false, id: 'black-knight-g' },
    { piece: 'Rook', isWhite: false, id: 'black-rook-h', moved: false }
  ],
  [
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-a' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-b' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-c' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-d' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-e' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-f' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-g' },
    { piece: 'Pawn', isWhite: false, id: 'black-pawn-h' }
  ],
  [
    null, null, null, null, null, null, null, null
  ],
  [
    null, null, null, null, null, null, null, null
  ],
  [
    null, null, null, null, null, null, null, null
  ],
  [
    null, null, null, null, null, null, null, null
  ],
  [
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-a' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-b' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-c' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-d' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-e' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-f' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-g' },
    { piece: 'Pawn', isWhite: true, id: 'white-pawn-h' }
  ],
  [
    { piece: 'Rook', isWhite: true, id: 'white-rook-a', moved: false },
    { piece: 'Knight', isWhite: true, id: 'white-knight-b' },
    { piece: 'Bishop', isWhite: true, id: 'white-bishop-c' },
    { piece: 'Queen', isWhite: true, id: 'white-queen' },
    { piece: 'King', isWhite: true, id: 'white-king', moved: false },
    { piece: 'Bishop', isWhite: true, id: 'white-bishop-f' },
    { piece: 'Knight', isWhite: true, id: 'white-knight-g' },
    { piece: 'Rook', isWhite: true, id: 'white-rook-h', moved: false }
  ]
]

const InitialBoardData = {
  squares: [
    [
      { piece: 'Rook', isWhite: false, id: 'black-rook-a', moved: false },
      { piece: 'Knight', isWhite: false, id: 'black-knight-b' },
      { piece: 'Bishop', isWhite: false, id: 'black-bishop-c' },
      { piece: 'Queen', isWhite: false, id: 'black-queen' },
      { piece: 'King', isWhite: false, id: 'black-king', moved: false },
      { piece: 'Bishop', isWhite: false, id: 'black-bishop-f' },
      { piece: 'Knight', isWhite: false, id: 'black-knight-g' },
      { piece: 'Rook', isWhite: false, id: 'black-rook-h', moved: false }
    ],
    [
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-a' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-b' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-c' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-d' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-e' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-f' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-g' },
      { piece: 'Pawn', isWhite: false, id: 'black-pawn-h' }
    ],
    [
      null, null, null, null, null, null, null, null
    ],
    [
      null, null, null, null, null, null, null, null
    ],
    [
      null, null, null, null, null, null, null, null
    ],
    [
      null, null, null, null, null, null, null, null
    ],
    [
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-a' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-b' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-c' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-d' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-e' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-f' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-g' },
      { piece: 'Pawn', isWhite: true, id: 'white-pawn-h' }
    ],
    [
      { piece: 'Rook', isWhite: true, id: 'white-rook-a', moved: false },
      { piece: 'Knight', isWhite: true, id: 'white-knight-b' },
      { piece: 'Bishop', isWhite: true, id: 'white-bishop-c' },
      { piece: 'Queen', isWhite: true, id: 'white-queen' },
      { piece: 'King', isWhite: true, id: 'white-king', moved: false },
      { piece: 'Bishop', isWhite: true, id: 'white-bishop-f' },
      { piece: 'Knight', isWhite: true, id: 'white-knight-g' },
      { piece: 'Rook', isWhite: true, id: 'white-rook-h', moved: false }
    ]
  ],
  enPassantable: [],
  whitesTurn: true,
  check: false,
  gameOver: ''
}

// king queen vs king
// const InitialBoardData = {
//   squares: [
//     [
//       null,
//       null,
//       null,
//       null,
//       { piece: 'King', isWhite: false, id: 'black-king', moved: false },
//       null,
//       null,
//       null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null, null, null, null, null, null, null, null
//     ],
//     [
//       null,
//       null,
//       null,
//       { piece: 'Queen', isWhite: true, id: 'white-queen' },
//       { piece: 'King', isWhite: true, id: 'white-king', moved: false },
//       null,
//       null,
//       null
//     ]
//   ],
//   enPassantable: [],
//   whitesTurn: true,
//   check: false,
//   gameOver: false
// }

async function getNewBoard () {
  const newBoard = []
  let count = 0
  for await (const rank of InitialBoard) {
    newBoard.push([])
    for await (const square of rank) {
      if (square) {
        newBoard[count].push(
          { ...square }
        )
      } else {
        newBoard[count].push(null)
      }
    }
    count++
  }
  return newBoard
}

const Row = styled.div`
    width:100%;
    height:12.5%;
    padding:0;
    margin:0;
    display:flex;
`

const Board = styled.div`
    width:44vw;
    height:44vw;
    padding:0;
    margin:0 auto;
    display:flex;
`

const getSquares =
  (
    rank,
    rowData,
    possibleMoves,
    hover,
    whitesTurn,
    gameOver,
    check,
    setHover,
    moveHeld,
    heldPiece,
    grabPiece
  ) => {
    return rowData.map((square, file) => {
      let hide = false
      let possibleMove = false
      let isHovered = false
      if (heldPiece.length > 0 &&
        file === FILES.indexOf(heldPiece[0]) &&
        RANKS.indexOf(rank) ===
          RANKS.indexOf(heldPiece[1])) {
        hide = true
      }
      if (possibleMoves.length > 0) {
        possibleMoves.forEach(square => {
          if (!possibleMove &&
            square.rank === RANKS.indexOf(rank) &&
            square.file === file) {
            possibleMove = true
          }
        })
      }
      if (hover.length > 0 &&
        file === FILES.indexOf(hover[0]) &&
        RANKS.indexOf(rank) ===
          RANKS.indexOf(hover[1])) {
        isHovered = true
      }
      return <BoardSquare
      key={file}
      rank={rank}
      file={FILES[file]}
      data={square}
      whitesTurn={whitesTurn}
      check={check}
      checkMate={gameOver}
      possibleMove={possibleMove}
      isHovered={isHovered && !gameOver}
      setHover={gameOver ? () => undefined : setHover}
      moveHeld={gameOver ? () => undefined : moveHeld}
      hide={hide}
      grabPiece={gameOver ? () => undefined : grabPiece}
      />
    })
  }

const getRows =
  (
    boardData,
    possibleMoves,
    reverseBoard,
    hover,
    setHover,
    moveHeld,
    heldPiece,
    grabPiece
  ) => {
    return boardData.squares.map((rowData, i) => {
      const rank = RANKS[i]
      return (
          <Row key={i} id={'row ' + rank} style={{ flexDirection: reverseBoard ? 'row-reverse' : 'row' }}>
              {getSquares(
                rank,
                rowData,
                possibleMoves,
                hover,
                boardData.whitesTurn,
                boardData.gameOver,
                boardData.check ? boardData.check : '',
                setHover,
                moveHeld,
                heldPiece,
                grabPiece
              )}
          </Row>
      )
    })
  }

const PieceImg = styled.div`
  position:absolute;
  pointer-events: none;
  cursor: none;
  width:5.5vw;
  height:5.5vw;
  display:block;
  align-self: center;
  user-select: none;
  user-drag: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  draggable="false";
  background-repeat: no-repeat;
  background-size: 100%;
`

function showGameOver (result) {
  return <p>{result}</p>
}

function Chessboard () {
  const mousePosition = useMousePosition()
  const [heldPiece, setHeldPiece] = useState('')
  const [boardData, setBoardData] =
    useState(InitialBoardData)
  const [possibleMoves, setPossibleMoves] = useState([])
  const [reverseBoard, setReverseBoard] = useState(false)
  const [hover, setHover] = useState([])

  // Enable droppable piece
  useEffect(() => {
    if (heldPiece.length > 0) {
      window.addEventListener('mouseup', dropPiece)
    }
  }, [heldPiece])

  useEffect(() => {
    if (boardData.check) {
      console.log('Check')
    }
    if (boardData.gameOver) {
      console.log(boardData.gameOver)
    }
  }, [boardData])

  function dropPiece (event) {
    if (!event.target.id.includes('square')) {
      window.removeEventListener('mouseup', dropPiece)
      setHeldPiece([])
      setPossibleMoves([])
    }
  }

  async function movePiece (file1, rank1, file2, rank2) {
    let valid = false
    valid = await ChessboardHelper.validateMove(
      boardData,
      file1,
      rank1,
      file2,
      rank2
    )
    if (valid) {
      const newBoard =
        { ...boardData, squares: [...boardData.squares] }
      await ChessboardHelper.doMove(
        newBoard,
        file1,
        rank1,
        file2,
        rank2,
        valid,
        true
      )
      newBoard.whitesTurn = !newBoard.whitesTurn
      setBoardData(newBoard)
    }
  }

  async function resetBoard () {
    getNewBoard().then(board => {
      setBoardData({
        squares: board,
        enPassantable: [],
        whitesTurn: true
      })
    })
  }

  function getPieceCursor () {
    if (heldPiece.length > 0) {
      const trueRank = RANKS.indexOf(heldPiece[1])
      const trueFile = FILES.indexOf(heldPiece[0])
      const piece =
      boardData.squares[trueRank][trueFile]
      return (
        <PieceImg
          style={{
            backgroundImage: `url(${PIECE_IMAGES[piece.isWhite ? 'white' : 'black'][piece.piece]})`,
            top: `calc(${mousePosition.y}px - 2.75vh)`,
            left: `calc(${mousePosition.x}px - 2.75vw)`
          }}
        />
      )
    }
  }

  const pieceCursor = getPieceCursor()

  function moveHeld (file, rank) {
    if (heldPiece.length > 0) {
      movePiece(
        FILES.indexOf(heldPiece[0]),
        RANKS.indexOf(heldPiece[1]),
        FILES.indexOf(file),
        RANKS.indexOf(rank)
      )
      setHeldPiece([])
      window.removeEventListener('mouseup', dropPiece)
      setPossibleMoves([])
    }
  }

  async function grabPiece (piece) {
    const rank = RANKS.indexOf(piece[1])
    const file = FILES.indexOf(piece[0])
    const thisPiece = boardData.squares[rank][file]
    if (boardData.whitesTurn === thisPiece.isWhite) {
      setHeldPiece(piece)
      setPossibleMoves(
        await
        ChessboardHelper.getPiecesMoves(
          boardData,
          file,
          rank,
          false
        )
      )
    }
  }

  return <div id='chessboard' style={{ cursor: heldPiece.length > 0 ? 'none' : 'auto' }}>
    {boardData.gameOver ? showGameOver(boardData.gameOver) : ''}
    <Board style={{ flexDirection: reverseBoard ? 'column-reverse' : 'column' }}>
      {getRows(
        boardData,
        possibleMoves,
        reverseBoard,
        hover,
        setHover,
        moveHeld,
        heldPiece,
        grabPiece
      )}
    </Board>
      <button
        onClick={() => {
          resetBoard()
        }}>
          Reset
      </button>
      <button
        onClick={() =>
          (setReverseBoard(!reverseBoard))}
      >
          Reverse
      </button>
      <button
        onClick={() =>
          console.log(
            ChessboardHelper.getAllMoves(boardData, true)
              .then(moveSet => console.log(moveSet)))}
      >
          White Moves
      </button>
      <button
        onClick={() =>
          console.log(
            ChessboardHelper.inCheck(boardData, true)
              .then(res => console.log(res)))}
      >
          White in Check
      </button>
      <button
        onClick={() =>
          console.log(
            ChessboardHelper.inCheck(boardData, false)
              .then(res => console.log(res)))}
      >
          Black in Check
      </button>
      {pieceCursor}
  </div>
}

export default Chessboard
